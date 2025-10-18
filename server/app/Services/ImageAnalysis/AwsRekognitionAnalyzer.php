<?php

namespace App\Services\ImageAnalysis;

use App\Services\ImageAnalysis\Exceptions\ImageAnalysisException;
use App\Services\ImageAnalysis\Interfaces\ImageAnalyzer;
use Aws\Exception\AwsException;
use Aws\Rekognition\RekognitionClient;
use Illuminate\Support\Arr;

class AwsRekognitionAnalyzer implements ImageAnalyzer
{
    protected RekognitionClient $client;
    protected string $collectionId;
    protected string $s3Bucket;

    public function __construct(RekognitionClient $client)
    {
        $this->client = $client;
        $this->collectionId = config('filesystems.disks.s3.collection_id');
        $this->s3Bucket = config('filesystems.disks.s3.bucket');
    }

    public function indexFace(string $s3ObjectKey, int|string $id): array
    {
        try {
            $result = $this->client->indexFaces([
                'CollectionId' => $this->collectionId,
                'DetectionAttributes' => [],
                'ExternalImageId' => (string) $id,
                'Image' => [
                    'S3Object' => [
                        'Bucket' => $this->s3Bucket,
                        'Name' => $this::fullS3Key($s3ObjectKey),
                    ],
                ],
                'MaxFaces' => 1,
                'QualityFilter' => 'AUTO',
            ]);

            $faceRecord = Arr::first($result['FaceRecords']);

            if (!$faceRecord) {
                throw new ImageAnalysisException(__('No faces were detected in the image'));
            }

            return $faceRecord;
        } catch (AwsException $e) {
            // TODO: Tratar erros específicos como 'InvalidS3ObjectException'
            throw new ImageAnalysisException(__('Failed to index face:')." ".$e->getAwsErrorMessage(),
                $e->getCode(), $e);
        }
    }

    public static function fullS3Key(string $relativePath): string
    {
        $root = config('filesystems.disks.s3.root');
        if (!$root) {
            return $relativePath;
        }

        return rtrim($root, '/').'/'.ltrim($relativePath, '/');
    }

    public function findKnownFacesInPhoto(string $s3ObjectKey, int $matchThreshold = 95): array
    {
        try {
            $result = $this->client->searchFacesByImage([
                'CollectionId' => $this->collectionId,
                'FaceMatchThreshold' => $matchThreshold,
                'Image' => [
                    'S3Object' => [
                        'Bucket' => $this->s3Bucket,
                        'Name' => $s3ObjectKey,
                    ],
                ],
                'MaxFaces' => 100,
            ]);

            if (empty($result['FaceMatches'])) {
                return [];
            }

            $customerIds = array_map(function ($match) {
                return $match['Face']['ExternalImageId'];
            }, $result['FaceMatches']);

            return array_unique($customerIds);
        } catch (AwsException $e) {
            throw new ImageAnalysisException(__('Failed to search for faces in the image')." ".$e->getAwsErrorMessage(),
                $e->getCode(), $e);
        }
    }

    public function removeFace(string $faceId): bool
    {
        try {
            $result = $this->client->deleteFaces([
                'CollectionId' => $this->collectionId,
                'FaceIds' => [$faceId],
            ]);

            return !empty($result['DeletedFaces']) && $result['DeletedFaces'][0] === $faceId;
        } catch (AwsException $e) {
            throw new ImageAnalysisException(__('Failed to remove collection face:')." ".$e->getAwsErrorMessage(),
                $e->getCode(), $e);
        }
    }

    public function countFaces(string $s3ObjectKey): int
    {
        try {
            $result = $this->client->detectFaces([
                'Image' => [
                    'S3Object' => [
                        'Bucket' => $this->s3Bucket,
                        'Name' => $s3ObjectKey,
                    ],
                ],
            ]);
            return count($result['FaceDetails'] ?? []);
        } catch (AwsException $e) {
            throw new ImageAnalysisException(__('Failed to count faces in image:')." ".$e->getAwsErrorMessage(),
                $e->getCode(), $e);
        }
    }

    public function countFacesByBytes(string $imageBytes): int
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
            throw new ImageAnalysisException(__('Failed to parse image with AWS service:')." ".$e->getAwsErrorMessage(),
                $e->getCode(), $e);
        }
    }
}