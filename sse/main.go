package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/redis/go-redis/v9"
)

var rdb *redis.Client

func main() {
	redisAddr := os.Getenv("REDIS_HOST") + ":" + os.Getenv("REDIS_PORT")
	if redisAddr == ":" {
		redisAddr = "redis:6379"
	}

	redisPassword := os.Getenv("REDIS_PASSWORD")

	rdb = redis.NewClient(&redis.Options{
		Addr:     redisAddr,
		Password: redisPassword,
		DB:       0,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if _, err := rdb.Ping(ctx).Result(); err != nil {
		log.Fatalf("Erro ao conectar no Redis: %v", err)
	}
	log.Println("Conectado ao Redis com sucesso!")

	http.HandleFunc("/stream", sseHandler)

	port := "8080"
	log.Printf("Microsserviço SSE rodando na porta %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func sseHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, Cache-Control, X-Requested-With")
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")

	ticket := r.URL.Query().Get("ticket")
	if ticket == "" {
		http.Error(w, "Ticket required", http.StatusUnauthorized)
		return
	}

	ctx := r.Context()
	redisKey := "sse_auth:" + ticket

	userID, err := rdb.Get(ctx, redisKey).Result()
	if err == redis.Nil {
		http.Error(w, "Invalid or expired ticket", http.StatusForbidden)
		return
	} else if err != nil {
		log.Printf("Erro no Redis: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	rdb.Del(ctx, redisKey)

	flusher, ok := w.(http.Flusher)
	if !ok {
		http.Error(w, "Streaming unsupported", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, ": conectado ao canal user:%s\n\n", userID)
	flusher.Flush()

	ctx = r.Context()
	pubsub := rdb.Subscribe(ctx, "sse:user:"+userID)
	defer pubsub.Close()

	ch := pubsub.Channel()

	log.Printf("Cliente conectado: User %s", userID)

	for {
		select {
		case msg := <-ch:
			var raw json.RawMessage
			if err := json.Unmarshal([]byte(msg.Payload), &raw); err != nil {
				log.Printf("Payload inválido no Redis: %v", err)
				continue
			}

			fmt.Fprintf(w, "data: %s\n\n", msg.Payload)
			flusher.Flush()

		case <-ctx.Done():
			log.Printf("Cliente desconectou: User %s", userID)
			return
		}
	}
}
