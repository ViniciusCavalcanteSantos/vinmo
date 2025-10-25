<?php

namespace App\Services\ImageAnalysis\Interfaces;

use App\Services\ImageAnalysis\Exceptions\ImageAnalysisException;

interface ImageAnalyzer
{
    public static function fullS3Key(string $relativePath): string;

    /**
     * Adiciona a face de um cliente à collection de reconhecimento.
     *
     * @param  string  $s3ObjectKey  A chave do objeto da imagem de referência no S3.
     * @param  string|int  $id  O ID único do cliente no seu sistema.
     * @return array Retorna os detalhes da face indexada, incluindo o FaceId.
     * @throws ImageAnalysisException
     */
    public function indexFace(string $s3ObjectKey, string|int $id): array;

    /**
     * Procura por rostos conhecidos (clientes) em uma determinada imagem de evento.
     *
     * @param  string  $s3ObjectKey  A chave do objeto da imagem do evento no S3.
     * @param  int  $matchThreshold  A porcentagem mínima de similaridade (0-100).
     * @return array Uma lista de IDs de clientes (ExternalImageId) encontrados na imagem.
     * @throws ImageAnalysisException
     */
    public function findAllKnownFacesInPhoto(string $s3ObjectKey, int $matchThreshold = 85): array;

    /**
     * Procura por rostos conhecidos (clientes) em uma determinada imagem de evento. (apenas o maior rosto)
     *
     * @param  string  $s3ObjectKey  A chave do objeto da imagem do evento no S3.
     * @param  int  $matchThreshold  A porcentagem mínima de similaridade (0-100).
     * @return array Uma lista de IDs de clientes (ExternalImageId) encontrados na imagem.
     * @throws ImageAnalysisException
     */
    public function findKnownFacesInPhoto(string $s3ObjectKey, int $matchThreshold = 85): array;

    /**
     * Remove uma face da collection de reconhecimento.
     *
     * @param  string  $faceId  O FaceId gerado pela AWS que foi salvo no seu banco.
     * @return bool Retorna true se a operação foi bem-sucedida.
     * @throws ImageAnalysisException
     */
    public function removeFace(string $faceId): bool;

    /**
     * Analisa uma imagem no S3 para contar o número de rostos detectados.
     *
     * @param  string  $s3ObjectKey  A chave do objeto da imagem no S3.
     * @return int O número de rostos encontrados.
     * @throws ImageAnalysisException Se ocorrer um erro durante a análise.
     */
    public function countFaces(string $s3ObjectKey): int;

    /**
     * Analisa uma imagem pelos bytes para contar o número de rostos detectados.
     *
     * @param  string  $imageBytes  O conteúdo binário da imagem.
     * @return int O número de rostos encontrados.
     * @throws ImageAnalysisException Se ocorrer um erro durante a análise.
     */
    public function countFacesByBytes(string $imageBytes): int;
}