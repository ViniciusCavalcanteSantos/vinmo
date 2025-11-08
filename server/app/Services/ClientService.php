<?php

namespace App\Services;

use App\Http\Requests\ClientPublicRequest;
use App\Http\Requests\ClientRequest;
use App\Jobs\GenerateImageVersions;
use App\Models\Client;
use App\Services\ImageAnalysis\Exceptions\ImageAnalysisException;
use App\Services\ImageAnalysis\ImageAnalyzerFactory;
use App\Services\ImageAnalysis\ImagePreparationService;
use App\Services\ImageAnalysis\Interfaces\ImageAnalyzer;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * Serviço de criação/atualização de clientes.
 */
class ClientService
{
    protected ImageAnalyzer $imageAnalyzer;

    public function __construct(ImageAnalyzerFactory $analyzerFactory)
    {
        $this->imageAnalyzer = $analyzerFactory->make();
    }

    /**
     * Cria um cliente e processa a imagem de perfil (obrigatória).
     * @throws \Throwable
     */
    public function createClient(ClientRequest|ClientPublicRequest $request, ?int $organizationId = null): Client
    {
        $validated = $request->validated();
        $profile = $request->file('profile');
        return DB::transaction(function () use ($validated, $profile, $organizationId) {
            $client = Client::create([
                'organization_id' => $organizationId ?? Auth::user()?->organization_id,
                'name' => $validated['name'],
                'rekognition_face_id' => '',
                'code' => $validated['code'] ?? null,
                'birthdate' => $validated['birthdate'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'guardian_name' => $validated['guardian_name'] ?? null,
                'guardian_type' => $validated['guardian_type'] ?? null,
                'guardian_email' => $validated['guardian_email'] ?? null,
                'guardian_phone' => $validated['guardian_phone'] ?? null,
            ]);

            $this->upsertAddress($client, $validated);
            $this->syncAssignmentsIfAny($client, $validated);

            $this->processAndStoreProfile($client, $profile, null);

            return $client->fresh();
        });
    }

    /**
     * Cria/atualiza endereço caso informado; caso contrário, remove.
     */
    protected function upsertAddress(Client $client, array $validated): void
    {
        if (!empty($validated['inform_address'])) {
            $addressData = collect($validated)->only([
                'postal_code', 'street', 'number', 'neighborhood',
                'complement', 'city', 'state', 'country',
            ])->toArray();

            $client->address()->updateOrCreate(
                [],
                array_merge($addressData, [
                    'label' => 'Client address',
                    'granularity' => 'full_address',
                ])
            );
        } else {
            $client->address()->delete();
        }
    }

    /**
     * Sincroniza eventos atribuídos (se o payload trouxer).
     */
    protected function syncAssignmentsIfAny(Client $client, array $validated): void
    {
        if (!empty($validated['assignments'])) {
            $client->events()->sync($validated['assignments']);
        }
    }

    // ------------------------
    // Helpers
    // ------------------------

    /**
     * Processa a imagem localmente, envia para um caminho temporário,
     * indexa a face no temp, remove a face antiga (se houver),
     * move para o caminho final, atualiza/gera o registro Image e
     * despacha a criação de versões.
     *
     * @param  Client  $client
     * @param  \Illuminate\Http\UploadedFile|\Symfony\Component\HttpFoundation\File\UploadedFile  $uploaded
     * @param  string|null  $oldFaceId
     * @throws ValidationException
     * @throws \Exception|\Throwable
     */
    protected function processAndStoreProfile(Client $client, $uploaded, ?string $oldFaceId): void
    {
        $exif = @exif_read_data($uploaded->getRealPath(), null, true);
        $processed = ImagePreparationService::from($uploaded)
            ->fixOrientation()
            ->limitDimensions()
            ->ensureFormat()
            ->fitBytes();

        $bytes = $processed->getAsBytes();
        $ext = $processed->getExtension();
        $mime = $processed->getMimetype();

        $finalPath = StoragePathService::getClientProfilePath($client->id, "profile.$ext");
        $tempPath = StoragePathService::getClientProfilePath($client->id, "profile_".Str::ulid().".$ext");

        if (!Storage::put($tempPath, $bytes)) {
            throw new \RuntimeException('Unable to store profile picture (temp).');
        }

        try {
            $face = $this->imageAnalyzer->indexFace($tempPath, $client->id);
            if (!empty($oldFaceId)) {
                $this->imageAnalyzer->removeFace($oldFaceId);
            }

            Storage::move($tempPath, $finalPath);

            $client->rekognition_face_id = $face['Face']['FaceId'];
            $client->save();

            $image = $client->image()->first();
            if (!$image) {
                $image = $client->image()->create([
                    'organization_id' => auth()->user()->organization_id,
                    'original_name' => $uploaded->getClientOriginalName(),
                    'path' => '',
                    'size' => 0,
                    'mime_type' => '',
                ]);
            }
            if ($exif) {
                $image->storeExif($exif);
            }

            if ($image->path && $image->path !== $finalPath && Storage::exists($image->path)) {
                Storage::delete($image->path);
            }

            $image->fill([
                'path' => $finalPath,
                'size' => strlen($bytes),
                'mime_type' => $mime,
            ])->save();

            GenerateImageVersions::dispatch($image);

        } catch (ImageAnalysisException $e) {
            Storage::delete([$tempPath, $finalPath]);
            throw ValidationException::withMessages(['profile' => $e->getMessage()]);
        } catch (\Throwable $e) {
            Storage::delete([$tempPath, $finalPath]);
            throw $e;
        }
    }

    public function deleteClient(Client $client): void
    {
        DB::transaction(function () use ($client) {
            if ($client->rekognition_face_id) {
                try {
                    $this->imageAnalyzer->removeFace($client->rekognition_face_id);
                } catch (ImageAnalysisException $e) {
                    \Log::warning("Falha ao remover face da AWS para cliente #{$client->id}: ".$e->getMessage());
                }
            }

            $client->delete();
        });
    }

    /**
     * Atualiza dados, endereço, eventos e (se enviado) a imagem/face.
     */
    public function updateClient(Client $client, ClientRequest $request): Client
    {
        $validated = $request->validated();
        $profile = $request->file('profile');

        return DB::transaction(function () use ($client, $validated, $profile) {

            $client->update($this->onlyClientFields($validated));

            $this->upsertAddress($client, $validated);
            $this->syncAssignmentsIfAny($client, $validated);

            if ($profile) {
                $this->processAndStoreProfile($client, $profile, $client->rekognition_face_id);
            }

            return $client->fresh();
        });
    }

    /**
     * Campos permitidos para update do cliente.
     */
    protected function onlyClientFields(array $validated): array
    {
        return collect($validated)->only([
            'name', 'code', 'birthdate', 'phone',
            'guardian_name', 'guardian_type', 'guardian_email', 'guardian_phone',
        ])->toArray();
    }
}
