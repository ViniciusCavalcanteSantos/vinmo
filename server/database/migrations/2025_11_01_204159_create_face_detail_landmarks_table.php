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
        Schema::create('face_detail_landmarks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('face_detail_id')->constrained('face_details')->cascadeOnDelete();

            $table->string('type', 32);
            $table->decimal('x', 8, 6);
            $table->decimal('y', 8, 6);

            $table->timestamps();
            $table->index(['face_detail_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('face_detail_landmarks');
    }
};
