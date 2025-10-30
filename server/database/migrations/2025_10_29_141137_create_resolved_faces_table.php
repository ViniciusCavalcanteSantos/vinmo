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
        Schema::create('resolved_faces', function (Blueprint $table) {
            $table->id();
            $table->foreignId('face_detection_id')->constrained()->cascadeOnDelete();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();

            // Duplicate
            $table->foreignId('event_id')->constrained()->cascadeOnDelete();
            $table->foreignUlid('image_id')->constrained()->cascadeOnDelete();

            $table->enum('matched_by', ['rekognition', 'manual'])->default('rekognition');
            $table->decimal('confidence', 5, 2)->nullable();
            $table->string('notes', 255)->nullable();

            $table->unsignedBigInteger('created_by')->nullable()->index();
            $table->unsignedBigInteger('approved_by')->nullable()->index();
            $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
            $table->foreign('approved_by')->references('id')->on('users')->nullOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resolved_faces');
    }
};
