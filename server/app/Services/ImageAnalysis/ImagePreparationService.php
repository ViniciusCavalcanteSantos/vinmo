<?php

namespace App\Services\ImageAnalysis;

use Exception;
use Illuminate\Http\UploadedFile;
use Intervention\Image\Encoders\JpegEncoder;
use Intervention\Image\Encoders\PngEncoder;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\Image as InterventionImage;
use Intervention\Image\Laravel\Facades\Image;

class ImagePreparationService
{
    protected InterventionImage $image;

    /**
     * Cria uma instância a partir de um arquivo ou caminho de arquivo.
     *
     * Uso típico:
     * ```php
     * $img = ImagePreparationService::from($file)->fixOrientation()->limitDimensions(2000, 2000);
     * ```
     *
     * @param  UploadedFile|string  $source  O arquivo enviado ou o caminho da imagem.
     * @return self
     */
    public static function from(UploadedFile|string $source): self
    {
        $instance = new self();
        $instance->image = Image::read($source);
        return $instance;
    }

    /**
     * Corrige a orientação da imagem com base nos dados EXIF.
     *
     * Isso garante que imagens tiradas em smartphones ou câmeras
     * sejam exibidas na orientação correta.
     *
     * @return self
     */
    public function fixOrientation(): self
    {
        $this->image->orient();
        return $this;
    }

    /**
     * Limita a imagem para que não ultrapasse as dimensões máximas.
     * Não aumenta imagens menores que os limites.
     *
     * @param  int  $maxWidth  Largura máxima permitida.
     * @param  int  $maxHeight  Altura máxima permitida.
     * @return self
     */
    public function limitDimensions(int $maxWidth = 2500, int $maxHeight = 2500): self
    {
        $this->image->resizeDown($maxWidth, $maxHeight);
        return $this;
    }

    /**
     * Garante que a imagem esteja em um dos formatos permitidos.
     * Converte para o primeiro formato da lista se necessário.
     */
    public function ensureFormat(
        array $formats = ['image/jpeg', 'image/png'],
        int $quality = 90
    ): self {
        $currentFormat = $this->image->origin()->mimetype();
        if (in_array($currentFormat, $formats)) {
            return $this;
        }

        $targetFormat = $formats[0];
        switch ($targetFormat) {
            case 'image/png':
                $encoder = new PngEncoder(false, true);
                break;
            case 'image/webp':
                $encoder = new WebpEncoder(quality: $quality);
                break;
            case 'image/jpeg':
            default:
                $encoder = new JpegEncoder(quality: $quality);
                break;
        }

        $this->image->encode($encoder);
        return $this;
    }

    /**
     * Reduz a imagem para que o tamanho final em bytes seja menor ou igual a $maxBytes.
     *
     * @param  int  $maxBytes  Tamanho máximo em bytes (padrão: 5MB)
     * @param  int  $maxWidth  Largura máxima da imagem (padrão: 2000px)
     * @return self
     * @throws Exception Se não for possível reduzir a imagem para o tamanho alvo.
     */
    public function fitBytes(int $maxBytes = 5 * 1024 * 1024, int $maxWidth = 2000): self
    {
        $quality = 90;
        $minQuality = 50;
        $minWidth = 800;
        $widthStep = 300;
        $qualityStep = 10;

        while (true) {
            $clone = clone $this->image;
            $clone->resizeDown($maxWidth);
            $encoded = $clone->encode(new JpegEncoder(quality: $quality));

            if ($encoded->size() <= $maxBytes) {
                $this->image = $clone;
                return $this;
            }

            if ($quality - $qualityStep >= $minQuality) {
                $quality -= $qualityStep;
            } elseif ($maxWidth - $widthStep >= $minWidth) {
                $maxWidth -= $widthStep;
                $quality = 90;
            } else {
                throw new Exception(
                    "Não foi possível reduzir a imagem para o tamanho alvo de {$maxBytes} bytes. "
                );
            }
        }
    }

    public function getIntervantionImage(): InterventionImage
    {
        return $this->image;
    }

    public function getFileSize()
    {
        return strlen($this->getAsBytes());
    }

    public function getAsBytes(): string
    {
        return (string) $this->image->encode();
    }

    /**
     * Retorna a extensão do arquivo com base no MIME type da imagem atual.
     */
    public function getExtension(): string
    {
        $mime = $this->image->origin()->mimetype();

        return match ($mime) {
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif',
            default => 'jpg', // padrão seguro
        };
    }
}