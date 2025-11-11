<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Client>
 */
class ClientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $code = $this->faker->unique()->bothify('###');

        return [
            'organization_id' => Organization::factory(),
            'code' => $code,
            'name' => $this->faker->name(),
            'rekognition_face_id' => $this->faker->slug()
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Client $client) {
            $client->image()->create([
                'organization_id' => $client->organization_id,
                'original_name' => $this->faker->word().'.'.$this->faker->fileExtension(),
                'path' => "clients/{$client->id}/{$this->faker->uuid()}.jpg",
                'size' => 5120
            ]);
        });
    }
}
