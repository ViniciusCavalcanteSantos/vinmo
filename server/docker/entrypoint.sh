#!/bin/sh
set -e

# Define os diretórios que precisam de permissão de escrita
TARGETS="/var/www/storage /var/www/bootstrap/cache"

# Loop inteligente para verificar permissões
for d in $TARGETS; do
    # 1. Verifica se o diretório existe
    if [ -d "$d" ]; then
        # 2. Obtém o ID do dono atual da pasta
        owner=$(stat -c '%u:%g' "$d" 2>/dev/null || echo "")

        # 3. Obtém o ID do usuário www-data (geralmente 82 no Alpine ou 33 no Debian)
        www_uid=$(id -u www-data)
        www_gid=$(id -g www-data)

        # 4. Compara: Se o dono NÃO for o www-data, então corrige
        if [ "$owner" != "$www_uid:$www_gid" ]; then
            echo "🔧 Corrigindo permissões em: $d"
            chown -R www-data:www-data "$d" || echo "⚠️ Aviso: Falha ao definir owner em $d"
        else
            echo "✅ Permissões corretas em: $d"
        fi

        # 5. Garante permissão de escrita (rwx para usuário e grupo)
        chmod -R 775 "$d" || echo "⚠️ Aviso: Falha ao definir chmod em $d"
    fi
done

echo "🚀 Iniciando aplicação..."
exec "$@"
