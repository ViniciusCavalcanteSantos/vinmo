<?php

namespace App\Services;

use App\Http\Requests\ClientRequest;
use App\Models\Client;
use App\Services\ImageAnalysis\ImagePreparationService;
use Illuminate\Support\Facades\DB;

class ClientService
{
    public function createClient(ClientRequest $request): Client
    {
        $validated = $request->validated();
        $profile = $request->file('profile');

        return DB::transaction(function () use ($validated, $profile) {
            $client = Client::create([
                'user_id' => auth()->id(),
                'name' => $validated['name'],
                'profile_url' => '',

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

            $processedProfile = ImagePreparationService::from($profile)
                ->fixOrientation()
                ->limitDimensions()
                ->ensureFormat()
                ->fitBytes();
            $processedProfileExtension = $processedProfile->getExtension();
            $path = StoragePathService::getClientProfilePath($client->id, 'profile.'.$processedProfileExtension);
            $saved = \Storage::put(
                $path,
                $processedProfile->getIntervantionImage()->encode()->toFilePointer()
            );

            if (!$saved) {
                throw new \Exception('Unable to store profile picture');
            }

            $client->update(['profile_url' => $path]);

            return $client;
        });
    }

    public function updateClient(Client $client, ClientRequest $request): Client
    {
        $validated = $request->validated();
        return $client;
    }
}