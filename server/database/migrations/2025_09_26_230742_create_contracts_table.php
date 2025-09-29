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
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('category_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('category_id')->references('id')->on('contracts_categories');
            $table->string('code', 40);
            $table->string('title', 180);

            $table->text('searchable')->nullable();
            $table->fullText('searchable');
            $table->timestamps();

            $table->unique(['user_id', 'code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
