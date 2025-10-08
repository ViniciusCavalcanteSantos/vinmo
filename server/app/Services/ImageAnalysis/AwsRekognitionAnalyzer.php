<?php

namespace App\Services\ImageAnalysis;

use App\Services\ImageAnalysis\Exceptions\ImageAnalysisException;
use App\Services\ImageAnalysis\Interfaces\ImageAnalyzer;
use Aws\Exception\AwsException;
use Aws\Rekognition\RekognitionClient;

class AwsRekognitionAnalyzer implements ImageAnalyzer
{
    protected RekognitionClient $client;

    public function __construct(RekognitionClient $client)
    {
        $this->client = $client;
    }

    public function countFaces(string $imageBytes): int
    {
        try {
            $result = $this->client->detectFaces([
                'Image' => [
                    'Bytes' => $imageBytes,
                ],
                'Attributes' => []
            ]);
            return count($result['FaceDetails'] ?? []);
        } catch (AwsException $e) {
            throw new ImageAnalysisException(
                'Falha ao analisar a imagem com o serviço da AWS: '.$e->getMessage(),
                $e->getCode(),
                $e
            );
        }
    }
}