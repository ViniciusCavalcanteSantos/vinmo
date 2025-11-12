<?php

namespace App\Services\ImageAnalysis;

use Exception;
use Illuminate\Http\UploadedFile;
use Intervention\Image\Encoders\JpegEncoder;
use Intervention\Image\Encoders\PngEncoder;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\Image as InterventionImage;
use Intervention\Image\Interfaces\EncoderInterface;
use Intervention\Image\Laravel\Facades\Image;

class ImagePreparationService
{
    protected InterventionImage $image;
    protected ?string $forcedFormat = null;
    protected int $quality = 90;

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
        $this->image->scaleDown($maxWidth, $maxHeight);
        return $this;
    }

    /**
     * Garante que a imagem esteja em um dos formatos permitidos,
     * * e define o formato-alvo para exportações futuras.
     */
    public function ensureFormat(array $formats = ['image/jpeg', 'image/png', 'image/webp'], int $quality = 90): self
    {
        $this->quality = $quality;
        $currentFormat = $this->image->origin()->mimetype();
        if (!in_array($currentFormat, $formats)) {
            $this->forcedFormat = $formats[0];
        } else {
            $this->forcedFormat = $currentFormat;
        }

        return $this;
    }

    /**
     * Reduz a imagem para que o tamanho final em bytes seja menor ou igual a $maxBytes.
     *
     * @param  int  $maxBytes  Tamanho máximo em bytes (padrão: 5MB)
     * @param  ?int  $maxWidth  Largura máxima da imagem (padrão: null)
     * @return self
     * @throws Exception Se não for possível reduzir a imagem para o tamanho alvo.
     */
    public function fitBytes(int $maxBytes = 5 * 1024 * 1024, int $maxWidth = null): self
    {
        if ($this->getFileSize() <= $maxBytes) {
            return $this;
        }

        $quality = $this->quality;
        $minQuality = 50;
        $qualityStep = 10;

        $targetMime = $this->hasAlpha()
            ? 'image/webp'
            : 'image/jpeg';
        $this->forcedFormat = $targetMime;

        while ($quality >= $minQuality) {
            $encoded = $this->image->encode($this->getEncoder($targetMime, $quality));
            if ($encoded->size() <= $maxBytes) {
                $this->quality = $quality;
                return $this;
            }
            $quality -= $qualityStep;
        }

        if ($maxWidth !== null) {
            $currentWidth = $this->image->width();
            $targetWidth = min($currentWidth, $maxWidth);
            $minWidth = 800;
            $widthStep = 300;

            while ($targetWidth >= $minWidth) {
                $clone = clone $this->image;
                $clone->scaleDown($targetWidth);

                $encoded = $clone->encode($this->getEncoder($targetMime, 85));
                if ($encoded->size() <= $maxBytes) {
                    $this->image = $clone;
                    $this->quality = 85;
                    return $this;
                }

                $targetWidth -= $widthStep;
            }
        }
        throw new Exception(
            "Não foi possível reduzir a imagem para o tamanho alvo de {$maxBytes} bytes. "
        );
    }

    public function getFileSize()
    {
        return strlen($this->getAsBytes());
    }

    public function getAsBytes(): string
    {
        return (string) $this->image->encode($this->getEncoder());
    }

    /**
     * Cria o encoder apropriado com base no formato definido.
     */
    protected function getEncoder($mime = null, $quality = null): EncoderInterface
    {
        $mimeFinal = $mime ?? $this->getMimetype();
        $qualityFinal = $quality ?? $this->quality;

        return match ($mimeFinal) {
            'image/png' => new PngEncoder(false, true),
            'image/webp' => new WebpEncoder(quality: $qualityFinal),
            'image/jpeg' => new JpegEncoder(quality: $qualityFinal),
            default => new JpegEncoder(quality: $qualityFinal),
        };
    }

    public function getMimetype(): string
    {
        return $this->forcedFormat ?? $this->image->origin()->mimetype();
    }

    /**
     * Detecta se a imagem possui canal alpha (transparência).
     *
     * - Se Imagick estiver disponível, faz detecção real via header/canais.
     * - Caso contrário, assume true para PNG/WebP por segurança.
     */
    public function hasAlpha()
    {
        $mime = $this->getMimetype();
        $hasAlpha = $mime === 'image/png' || $mime === 'image/webp';
        try {
            $core = $this->image->core();
            if (method_exists($core, 'native')) {
                $native = $core->native();
                if ($native instanceof \Imagick) {
                    $hasAlpha = $native->getImageAlphaChannel();
                }
            }
        } catch (\Throwable $e) {
        }

        return $hasAlpha;

    }

    public function toFilePointer()
    {
        return $this->image->encode($this->getEncoder())->toFilePointer();
    }

    public function getIntervantionImage(): InterventionImage
    {
        return $this->image;
    }

    public function width()
    {
        return $this->image->width();
    }

    public function height()
    {
        return $this->image->width();
    }

    /**
     * Retorna a extensão do arquivo com base no MIME type da imagem atual.
     */
    public function getExtension(): string
    {
        return match ($this->getMimetype()) {
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif',
            default => 'jpg',
        };
    }
}