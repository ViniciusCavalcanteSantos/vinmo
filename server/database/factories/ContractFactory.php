<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\Contract;
use App\Models\ContractCategory;
use App\Models\ContractGraduationDetail;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Contract>
 */
class ContractFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->sentence(3);
        $code = strtoupper($this->faker->unique()->bothify('###'));
        return [
            'organization_id' => Organization::factory(),
            'category_id' => ContractCategory::inRandomOrder()->first()->id ?? 1,
            'code' => $code,
            'title' => $title,
            'searchable' => $title.' '.$code
        ];
    }

    /**
     * Estado para contratos de Graduation
     */
    public function graduation(): Factory
    {
        return $this->state(function () {
            $graduationCategory = ContractCategory::where('slug', 'graduation')->first();
            return [
                'category_id' => $graduationCategory ? $graduationCategory->id : 1,
            ];
        });
    }

    public function configure()
    {
        return $this->afterCreating(function (Contract $contract) {
            // Sempre cria Address (city_area)
            $contract->address()->create(Address::factory()->new()->state([
                'granularity' => 'city_area',
            ])->make()->toArray());

            // Se for Graduation, cria detalhe
            if ($contract->category->slug === 'graduation') {
                ContractGraduationDetail::factory()->create([
                    'contract_id' => $contract->id
                ]);
            }
        });
    }
}
