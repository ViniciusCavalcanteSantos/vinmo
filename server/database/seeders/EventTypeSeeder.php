<?php

namespace Database\Seeders;

use App\Models\ContractCategory;
use App\Models\EventType;
use Illuminate\Database\Seeder;

class EventTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            'graduation' => [
                ['name' => 'Invitation Photo Shoot'],
                ['name' => 'Gala Ball'],
                ['name' => 'Festive Graduation Ceremony'],
                ['name' => 'Official Graduation Ceremony'],
                ['name' => 'Ecumenical Service'],
                ['name' => 'Half-Course Party'],
                ['name' => 'Pre-Internship Photo Shoot'],
                ['name' => 'Parents\' Dinner'],
                ['name' => 'White Coat Ceremony'],
                ['name' => 'Creative Photo Shoots'],
                ['name' => 'Family Photo Shoot'],
                ['name' => 'Farewell Class'],
            ],
            'wedding' => [
                ['name' => 'Engagement Photo Shoot'],
                ['name' => 'Civil Ceremony'],
                ['name' => 'Religious Ceremony'],
                ['name' => 'Reception Party'],
                ['name' => 'Bridal Shower / Kitchen Tea'],
            ],
            'cycling' => [
                ['name' => 'Championship Race'],
                ['name' => 'Awards Ceremony'],
                ['name' => 'Charity Ride'],
                ['name' => 'Briefing / Technical Congress'],
            ],
            'festival' => [
                ['name' => 'Music Concert / Show'],
                ['name' => 'Dance Performance'],
                ['name' => 'Theater Play'],
                ['name' => 'Art Exhibition'],
            ],
            'marathon' => [
                ['name' => 'Championship Race'],
                ['name' => 'Awards Ceremony'],
                ['name' => 'Charity Run'],
                ['name' => 'Briefing / Technical Congress'],
                ['name' => 'Kit Delivery'],
            ],
            'parish' => [
                ['name' => 'Baptism'],
                ['name' => 'First Communion'],
                ['name' => 'Confirmation'],
                ['name' => 'Religious Procession'],
                ['name' => 'Parish Feast / Festival'],
            ],
        ];

        foreach ($data as $contractCategorySlug => $eventTypes) {
            $contractCategory = ContractCategory::where("slug", $contractCategorySlug)->first();
            if ($contractCategory) {
                foreach ($eventTypes as $eventType) {
                    EventType::firstOrCreate([
                        'category_id' => $contractCategory->id,
                        'name' => $eventType['name'],
                    ]);
                }
            }
        }
    }
}
