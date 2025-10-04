<?php

return [
    'host' => env('ELASTICSEARCH_PORT') && env('ELASTICSEARCH_SCHEME')
        ? env('ELASTICSEARCH_SCHEME').'://'.env('ELASTICSEARCH_HOST').':'.env('ELASTICSEARCH_PORT')
        : env('ELASTICSEARCH_HOST'),
    'user' => env('ELASTICSEARCH_USER'),
    'password' => env('ELASTICSEARCH_PASSWORD', env('ELASTICSEARCH_PASS')),
    'cloud_id' => env('ELASTICSEARCH_CLOUD_ID', env('ELASTICSEARCH_API_ID')),
    'api_key' => env('ELASTICSEARCH_API_KEY'),
    'ssl_verification' => env('ELASTICSEARCH_SSL_VERIFICATION', true),
    'queue' => [
        'timeout' => env('SCOUT_QUEUE_TIMEOUT'),
    ],
    'indices' => [
        'mappings' => [
            'default' => [
                'properties' => [
                    'id' => [
                        'type' => 'keyword',
                    ],
                ],
                'dynamic_templates' => [
                    [
                        'strings' => [
                            'match_mapping_type' => 'string',
                            'mapping' => [
                                'type' => 'text',
                                'analyzer' => 'autocomplete_analyzer',
                                'search_analyzer' => 'standard',
                                'fields' => [
                                    'keyword' => [
                                        'type' => 'keyword',
                                        'ignore_above' => 256,
                                    ]
                                ]
                            ]
                        ]
                    ]
                ],
            ],
        ],
        'settings' => [
            'default' => [
                'number_of_shards' => 1,
                'number_of_replicas' => 0,
                'analysis' => [
                    'filter' => [
                        'autocomplete_filter' => [
                            'type' => 'edge_ngram',
                            'min_gram' => 2,
                            'max_gram' => 15,
                        ],
                    ],
                    'analyzer' => [
                        'autocomplete_analyzer' => [
                            'type' => 'custom',
                            'tokenizer' => 'standard',
                            'filter' => [
                                'lowercase',
                                'autocomplete_filter',
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
];
