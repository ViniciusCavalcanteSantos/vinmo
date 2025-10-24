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
        Schema::create('clients_register_links', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $table->string('title', 80);
            $table->integer('max_registers')->nullable();
            $table->integer('used_registers')->default(0);
            $table->boolean('require_address')->default(false);
            $table->boolean('require_guardian_if_minor')->default(false);
            $table->json('default_assignments')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients_register_links');
    }
};
