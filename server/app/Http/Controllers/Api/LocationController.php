<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use PragmaRX\Countries\Package\Countries;

class LocationController extends Controller
{
    public function getCountries()
    {
        $lang = app()->getLocale();
        $langMap = ['en' => 'eng', 'pt_BR' => 'por',];
        $translationKey = $langMap[$lang] ?? 'eng';

        $countries = new Countries();
        $allCountries = $countries->all()
            ->filter(function ($country) {
                return $country->independent === true;
            })
            ->sortBy('name.common')
            ->map(function ($country) use ($translationKey) {
                $nativeName = optional($country->name->native)->first()->common;
                $translatedName = data_get(
                    $country,
                    "translations.{$translationKey}.common"
                ) ?? $country->name->common;

                return [
                    'value' => $country->cca3,
                    'label' => $translatedName .  ($nativeName ? " ({$nativeName})" : ''),
                ];
            });

        return response()->json([
            'status' => 'success',
            'message' => 'All countries obtained',
            'countries' => $allCountries->values()->toArray(),
        ]);
    }

    public function getStates(Request $request, $country_cca3)
    {
        $countries = new Countries();
        $country = $countries->where('cca3', strtoupper($country_cca3))->first();
        if($country->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => __('Country not found'),
            ], 404);
        }

        $states = $country->hydrateStates()->states;
        if ($states->isEmpty()) {
            return response()->json([
                'status' => 'success',
                'message' => __('No states found for this country'),
                'states' => []
            ]);
        }

        $states = $states->map(function($state) {
            return [
                'value' => $state['postal'],
                'label' => $state['name'],
            ];
        })->sortBy('label');

        return response()->json([
            'status' => 'success',
            'message' => 'All states obtained',
            'states' => $states->values()->toArray(),
        ]);
    }

    public function getCities(Request $request, $country_cca3, $state_code)
    {
        $countries = new Countries();
        $country = $countries->where('cca3', strtoupper($country_cca3))->first();
        if($country->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => __('Country not found'),
            ], 404);
        }

        $state = $country->hydrateStates()->states->where('postal', $state_code)->first();
        if($state->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => __('State not found'),
            ], 404);
        }

        $cities = $state->hydrate('cities')->cities;
        if ($cities->isEmpty()) {
            return response()->json(['status' => 'success', 'cities' => []]);
        }

        $cities = $cities->map(function($city) {
            return [
                'value' => $city['name'],
                'label' => $city['name'],
            ];
        })->sortBy('label');

        return response()->json([
            'status' => 'success',
            'message' => __('All cities obtained'),
            'cities' => $cities->values()->toArray(),
        ]);
    }
}
