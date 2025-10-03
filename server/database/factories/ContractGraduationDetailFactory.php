<?php

namespace Database\Factories;

use App\Models\Contract;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ContractGraduationDetail>
 */
class ContractGraduationDetailFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = $this->faker->randomElement(['university', 'school']);

        return [
            'contract_id' => Contract::factory()->graduation(),
            'type' => $type,
            'institution_name' => $this->faker->company().' University',
            'institution_acronym' => strtoupper($this->faker->lexify('???')),
            'class' => $this->faker->bothify('Class ##'),
            'shift' => $this->faker->randomElement(['morning', 'afternoon', 'night', 'full_time']),
            'conclusion_year' => $this->faker->year('+4 years'),
            'university_course' => $type === 'university' ? $this->faker->words(2, true) : null,
            'school_grade_level' => $type === 'school'
                ? $this->faker->randomElement(['elementary_school', 'middle_school', 'high_school'])
                : null,
        ];
    }
}
