<?php

namespace App\Observers;

use App\Models\Client;
use Illuminate\Support\Facades\DB;

class ClientObserver
{
    public function saved(Client $client): void
    {
        DB::afterCommit(function () use ($client) {
            $this->updateSearchableContent($client);
        });
    }

    public function updateSearchableContent(Client $client)
    {
        $birthdate = $client->birthdate;
        $searchable = collect([
            $client->code,
            $client->name,
            $birthdate?->format('Y-m-d'),
            $birthdate?->format('d/m/Y'),
            $birthdate?->format('m/d/Y'),
            $client->phone,
            $client->guardian_name,
            $client->guardian_email,
            $client->guardian_phone
        ]);

        $locales = config('app.supported_locales');
        foreach ($locales as $locale) {
            if ($birthdate) {
                $searchable->push($birthdate->locale($locale)->translatedFormat('F')); // "outubro"
                $searchable->push($birthdate->locale($locale)->translatedFormat('d \d\e F')); // "01 de outubro"
                $searchable->push($birthdate->locale($locale)->translatedFormat('F \d\e Y')); // "outubro de 2025"
            }

            if ($client->guardian_type) {
                $searchable->push(__($client->guardian_type, [], $locale));
            }
        }

        DB::table('clients')
            ->where('id', $client->id)
            ->update(['searchable' => $searchable->filter()->implode(' ')]);
    }
}
