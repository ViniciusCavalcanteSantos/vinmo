<?php

use PragmaRX\Countries\Package\Countries;

if (!function_exists('getCountryName')) {
    function getCountryName(string $cca2): ?string
    {
        $cca2 = strtoupper($cca2);
        $lang = app()->getLocale();
        $langMap = config('localization.pragmarx_lang_map');
        $translationKey = $langMap[$lang] ?? 'eng';
        $cacheKey = "country_name_{$cca2}_{$translationKey}";

        return Cache::rememberForever($cacheKey, function () use ($cca2, $translationKey) {
            $country = (new Countries())->where('cca2', $cca2)->first();
            if (!$country) {
                return null;
            }

            $translatedName = data_get($country, "translations.{$translationKey}.common");

            return $translatedName ?? $country->name->common ?? null;
        });
    }

    if (!function_exists('getStateName')) {
        function getStateName(string $countryCca2, string $stateCode): ?string
        {
            $countryCca2 = strtoupper($countryCca2);
            $stateCode = strtoupper($stateCode);

            $cacheKey = "state_name_{$countryCca2}_{$stateCode}";

            return Cache::rememberForever($cacheKey, function () use ($countryCca2, $stateCode) {
                $countries = new Countries();
                $country = $countries->where('cca2', $countryCca2)->first();

                if (!$country) {
                    return null;
                }

                $state = $country->hydrate('states')->states->where('postal', $stateCode)->first();
                return $state->name ?? null;
            });
        }
    }
}