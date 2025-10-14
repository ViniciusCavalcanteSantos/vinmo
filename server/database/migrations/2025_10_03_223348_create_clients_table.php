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
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users');

            $table->string('name', 60);
            $table->string('profile_url');

            $table->string('code', 20)->nullable();
            $table->date('birthdate')->nullable();
            $table->string('phone', 20)->nullable();

            $table->string('guardian_name', 60)->nullable();
            $table->enum('guardian_type', [
                'mother', 'father', 'grandmother', 'grandfather', 'uncle', 'aunt',
                'sister', 'brother', 'godmother', 'godfather', 'other'
            ])->nullable();
            $table->string('guardian_email', 60)->nullable();
            $table->string('guardian_phone', 20)->nullable();

            $table->text('searchable')->nullable();
            $table->fullText('searchable');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
