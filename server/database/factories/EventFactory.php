<?php

namespace Database\Factories;

use App\Models\Contract;
use App\Models\EventType;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $contract = Contract::inRandomOrder()->first() ?? Contract::factory();
        $startTime = Carbon::parse($this->faker->time());
        $endTime = $startTime->copy()->addHours($this->faker->numberBetween(1, 4));
        $title = $this->faker->sentence(2);

        return [
            'organization_id' => $contract->organization_id,
            'contract_id' => $contract->id,
            'type_id' => EventType::inRandomOrder()->first()->id ?? 1,
            'title' => $title,
            'event_date' => $this->faker->dateTimeBetween('-3 months', '+6 months')->format('Y-m-d'),
            'start_time' => $startTime->format('H:i'),
            'end_time' => $endTime->format('H:i'),
            'description' => $this->faker->optional()->sentence(10),
            'searchable' => null
        ];
    }
}
