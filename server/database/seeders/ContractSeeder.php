<?php

namespace Database\Seeders;

use App\Models\Contract;
use App\Models\ContractCategory;
use App\Models\User;
use Faker\Factory;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class ContractSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('email', 'admin@photon.com')->first();

        if (!$user) {
            $this->command->warn('⚠ Nenhum usuário admin encontrado, rode primeiro o UserSeeder.');
            return;
        }

        $categories = ContractCategory::all();
        $faker = Factory::create();
        foreach ($categories as $category) {
            Contract::factory(3)
                ->state(new Sequence(
                    fn($sequence) => ['title' => $category->name." - ".$faker->sentence(3)]
                ))
                ->create([
                    'organization_id' => $user->organization->id,
                    'category_id' => $category->id,
                ]);
        }
    }
}
