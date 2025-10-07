<?php

namespace App\Services;

class StoragePathService
{
    protected static bool $useEncodedIds = false;

    public function __construct()
    {
        self::$useEncodedIds = config('app.encoded_ids');
    }

    public static function enableEncodedIds(): void
    {
        self::$useEncodedIds = true;
    }

    public static function disableEncodedIds(): void
    {
        self::$useEncodedIds = false;
    }

    public static function getEventFolder(int|string $eventId): string
    {
        return 'events/'.self::id($eventId);
    }

    protected static function id(int|string $id): string
    {
        return self::$useEncodedIds
            ? base64_encode($id)
            : (string) $id;
    }

    public static function getClientProfilePath(int|string $clientId, string $filename): string
    {
        return 'clients/'.self::id($clientId).'/'.$filename;
    }
}