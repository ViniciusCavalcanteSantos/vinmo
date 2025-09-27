<?php

namespace Database\Seeders;

use App\Models\ContractCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ContractCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Graduation', 'slug' => 'graduation'],
            ['name' => 'Wedding', 'slug' => 'wedding'],
            ['name' => 'Cycling', 'slug' => 'cycling'],
            ['name' => 'Festival', 'slug' => 'festival'],
            ['name' => 'Marathon', 'slug' => 'marathon'],
            ['name' => 'Parish', 'slug' => 'parish'],
        ];

        foreach ($categories as $category) {
            ContractCategory::firstOrCreate(['slug' => $category['slug']], $category);
        }
    }
}
