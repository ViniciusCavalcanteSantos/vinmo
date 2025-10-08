<?php

namespace App\Services\ImageAnalysis;


use App\Models\Event;
use App\Models\User;
use App\Services\ImageAnalysis\Interfaces\ImageAnalyzer;
use Illuminate\Contracts\Foundation\Application;
use InvalidArgumentException;

class ImageAnalyzerFactory
{
    /** @var Application */
    protected $app;

    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    /**
     * Cria a instância correta do ImageAnalyzer com base no contexto.
     *
     * @param  Event|null  $event
     * @param  User|null  $user
     * @return ImageAnalyzer
     */
    public function make(?Event $event = null, ?User $user = null): ImageAnalyzer
    {
        $providerKey = config('services.image_analysis.default'); // Padrão do sistema
        return $this->buildProvider($providerKey);
    }

    /**
     * Constrói a implementação do provider com base em uma chave.
     *
     * @param  string  $providerKey
     * @return ImageAnalyzer
     */
    protected function buildProvider(string $providerKey): ImageAnalyzer
    {
        return match ($providerKey) {
            'aws' => $this->app->make(AwsRekognitionAnalyzer::class),
            default => throw new InvalidArgumentException("Provider de análise de imagem desconhecido: [{$providerKey}]"),
        };
    }
}