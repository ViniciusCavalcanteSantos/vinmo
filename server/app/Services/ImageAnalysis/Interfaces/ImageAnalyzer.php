<?php

namespace App\Services\ImageAnalysis\Interfaces;

use App\Services\ImageAnalysis\Exceptions\ImageAnalysisException;

interface ImageAnalyzer
{
    /**
     * Analisa uma imagem para contar o número de rostos detectados.
     *
     * @param  string  $imageBytes  O conteúdo binário da imagem.
     * @return int O número de rostos encontrados.
     * @throws ImageAnalysisException Se ocorrer um erro durante a análise.
     */
    public function countFaces(string $imageBytes): int;
}