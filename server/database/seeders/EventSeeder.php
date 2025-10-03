<?php

namespace Database\Seeders;

use App\Models\Contract;
use App\Models\Event;
use App\Models\EventType;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $contracts = Contract::all();

        foreach ($contracts as $contract) {
            for ($i = 0; $i < 5; $i++) {
                $eventType = EventType::where('category_id', $contract->category->id)->inRandomOrder()->first();
                Event::factory()->create([
                    'contract_id' => $contract->id,
                    'type_id' => $eventType->id,
                ]);
            }
        }
    }
}
