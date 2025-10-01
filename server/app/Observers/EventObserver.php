<?php

namespace App\Observers;

use App\Models\Event;
use Illuminate\Support\Facades\DB;

class EventObserver
{
    /**
     * Handle the Event "saved" event.
     * O evento 'saved' é disparado após 'create' e 'update'.
     */
    public function saved(Event $event): void
    {
        DB::afterCommit(function () use ($event) {
            $this->updateSearchableContent($event);
        });
    }

    /**
     * Atualiza o conteúdo de busca para um evento.
     */
    public function updateSearchableContent(Event $event): void
    {
        $event->load('type.category');

        $date = $event->event_date;
        $type = $event->type?->name;
        $category = $event->type?->category->name;
        $searchableContent = collect([
            $date->format('Y-m-d'),
            $date->format('d/m/Y'),
            $date->format('m/d/Y'),
            $event->start_time?->format('H:i'),
            $event->description,
        ]);

        $locales = config('app.supported_locales');
        foreach ($locales as $locale) {
            $searchableContent->push($date->locale($locale)->translatedFormat('F')); // "outubro"
            $searchableContent->push($date->locale($locale)->translatedFormat('d \d\e F')); // "01 de outubro"
            $searchableContent->push($date->locale($locale)->translatedFormat('F \d\e Y')); // "outubro de 2025"

            if ($type) {
                $searchableContent->push(__($type, [], $locale));
            }
            if ($category) {
                $searchableContent->push(__($category, [], $locale));
            }
        }

        // IMPORTANTE: Usamos uma atualização de query bruta (raw) aqui.
        // Se usássemos $contract->save(), dispararíamos o observer novamente,
        // criando um loop infinito. A atualização bruta evita isso.
        DB::table('events')
            ->where('id', $event->id)
            ->update(['searchable' => $searchableContent->filter()->implode(' ')]);
    }
}
