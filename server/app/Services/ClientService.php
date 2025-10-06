<?php

namespace App\Services;

use App\Http\Requests\ClientRequest;
use App\Models\Client;
use Illuminate\Support\Facades\DB;

class ClientService
{
    public function createClient(ClientRequest $request): Client
    {
        $validated = $request->validated();
        $picture = $request->file('picture');
        $pictureUrl = 'temp';

        return DB::transaction(function () use ($validated, $pictureUrl) {
            $client = Client::create([
                'user_id' => auth()->id(),
                'name' => $validated['name'],
                'picture_url' => $pictureUrl,

                'code' => $validated['code'] ?? null,
                'birthdate' => $validated['birthdate'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'guardian_name' => $validated['guardian_name'] ?? null,
                'guardian_type' => $validated['guardian_type'] ?? null,
                'guardian_email' => $validated['guardian_email'] ?? null,
                'guardian_phone' => $validated['guardian_phone'] ?? null,
            ]);

            if ($validated['inform_address']) {
                $client->address()->create([
                    'label' => 'Client address',
                    'granularity' => 'full_address',
                    'postal_code' => $validated['street'],
                    'street' => $validated['street'],
                    'number' => $validated['number'],
                    'neighborhood' => $validated['neighborhood'],
                    'complement' => $validated['complement'] ?? null,
                    'city' => $validated['city'],
                    'state' => $validated['state'],
                    'country' => $validated['country'],
                ]);
            }

            return $client;
        });
    }

    public function updateClient(Client $client, ClientRequest $request): Client
    {
        $validated = $request->validated();
        return $client;
    }
}