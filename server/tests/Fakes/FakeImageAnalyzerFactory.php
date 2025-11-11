<?php

namespace Tests\Fakes;

use App\Models\Event;
use App\Models\User;
use App\Services\ImageAnalysis\ImageAnalyzerFactory;
use App\Services\ImageAnalysis\Interfaces\ImageAnalyzer;

class FakeImageAnalyzerFactory extends ImageAnalyzerFactory
{
    public function make(Event $event = null, ?User $user = null): ImageAnalyzer
    {
        return new class implements ImageAnalyzer {
            public function indexFace(string $s3ObjectKey, int|string $id): array
            {
                return ['Face' => ['FaceId' => 'fake-face-id-123']];
            }

            public function removeFace(string $faceId): bool
            {
                return true;
            }

            public static function fullS3Key(string $relativePath): string
            {
                return $relativePath;
            }

            public function findAllKnownFacesInPhoto(string $s3ObjectKey, int $matchThreshold = 85): array
            {
                return [];
            }

            public function findKnownFacesInPhoto(string $s3ObjectKey, int $matchThreshold = 85): array
            {
                return [];
            }

            public function searchSingleFaceCrop(string $s3ObjectKey, int $matchThreshold = 85): ?array
            {
                return [];
            }

            public function countFaces(string $s3ObjectKey): int
            {
                return 1;
            }

            public function countFacesByBytes(string $imageBytes): int
            {
                return 1;
            }
        };
    }
}
