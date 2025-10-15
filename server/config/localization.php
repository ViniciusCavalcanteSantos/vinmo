<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Laravel Locale Map
    |--------------------------------------------------------------------------
    |
    | Mapeia os códigos de locale aceitos pelo Laravel (ex: "pt-BR")
    | para o formato interno usado por pacotes ou bibliotecas externas
    | que não seguem a convenção padrão ISO (ex: "pt_BR").
    |
    */
    'laravel_lang_map' => [
        'en' => 'en',
        'pt-BR' => 'pt_BR',
        'pt' => 'pt_BR',
    ],

    /*
    |--------------------------------------------------------------------------
    | PragmaRX Countries Lang Map
    |--------------------------------------------------------------------------
    |
    | Mapeia os locais do Laravel para os códigos de idioma ISO 639-3
    | utilizados internamente pelo pacote "PragmaRX\Countries".
    |
    | Referência: https://en.wikipedia.org/wiki/List_of_ISO_639-3_codes
    |
    */
    'pragmarx_lang_map' => [
        'pt_BR' => 'por',
        'pt' => 'por',
        'en' => 'eng',
    ],

    /*
    |--------------------------------------------------------------------------
    | Default fallback language
    |--------------------------------------------------------------------------
    |
    | Idioma a ser usado caso o mapeamento ou tradução não seja encontrado.
    |
    */
    'fallback' => 'en',
];