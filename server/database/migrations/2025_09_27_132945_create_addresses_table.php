<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->morphs('addressable');

            $table->enum('granularity', ['full_address', 'city_area'])
                ->default('full_address')
                ->comment('Define if this is a complete street address or just a general city area.');

            $table->string('label')->nullable();
            $table->string('postal_code', 12)->nullable();
            $table->string('street', 120)->nullable();
            $table->string('number', 10)->nullable();
            $table->string('complement', 120)->nullable();
            $table->string('neighborhood'. 40)->nullable();
            $table->string('city', 40);
            $table->string('state', 12);
            $table->string('country', 3);
            $table->timestamps();

            $table->index(['addressable_id', 'addressable_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
