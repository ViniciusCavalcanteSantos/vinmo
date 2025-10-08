<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use PragmaRX\Countries\Package\Countries;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Address>
 */
class AddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $countries = new Countries();
        $country = $countries->whereIn('cca2', ['US', 'BR'])->random();
        $countryCode = $country->cca2;

        $states = $country->hydrateStates()->states;
        $state = $states->isNotEmpty() ? $states->random() : null;

        // A biblioteca PragmaRX\Countries faz cache e carrega todas as cidades do país em vez de uma só.
        // Por isso, primeiro obtemos a lista completa e, em seguida, filtramos
        // para pegar apenas as cidades que pertencem ao estado sorteado.
        $citiesInCountry = $state ? $states->where('postal',
            $state['postal'])->first()->hydrate('cities')->cities : collect();
        $citiesInState = $citiesInCountry->where('adm1name', $state['name']);
        $city = $citiesInState->isNotEmpty() ? $citiesInState->random()['name'] : $this->faker->city();

        $granularity = $this->granularity ?? 'full_address';

        return [
            'addressable_id' => null,
            'addressable_type' => null,
            'granularity' => $granularity,
            'label' => $granularity === 'full_address' ? $this->faker->randomElement([
                'Home', 'Work', 'Billing'
            ]) : 'City Area',
            'postal_code' => $granularity === 'full_address' ? $this->faker->postcode() : null,
            'street' => $granularity === 'full_address' ? $this->faker->streetName() : null,
            'number' => $granularity === 'full_address' ? $this->faker->buildingNumber() : null,
            'complement' => $granularity === 'full_address' ? $this->faker->secondaryAddress() : null,
            'neighborhood' => $granularity === 'full_address' ? $this->faker->word() : null,
            'city' => $city,
            'state' => $state['postal'] ?? $this->faker->stateAbbr(),
            'country' => $countryCode,
        ];
    }
}
