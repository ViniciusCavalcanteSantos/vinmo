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
        Schema::create('face_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('face_crop_id')->constrained()->cascadeOnDelete();
            $table->unique('face_crop_id');

            $table->decimal('face_confidence', 6, 3)->nullable();

            $table->unsignedTinyInteger('age_low')->nullable();
            $table->unsignedTinyInteger('age_high')->nullable();

            $table->string('gender_value', 16)->nullable();
            $table->decimal('gender_confidence', 6, 3)->nullable();

            $table->decimal('eye_direction_confidence', 6, 3)->nullable();
            $table->decimal('eye_direction_pitch', 6, 3)->nullable();
            $table->decimal('eye_direction_yaw', 6, 3)->nullable();

            $table->decimal('pose_pitch', 6, 3)->nullable();
            $table->decimal('pose_roll', 6, 3)->nullable();
            $table->decimal('pose_yaw', 6, 3)->nullable();

            $table->decimal('quality_brightness', 6, 3)->nullable();
            $table->decimal('quality_sharpness', 6, 3)->nullable();

            $table->boolean('beard_value')->nullable();
            $table->decimal('beard_confidence', 6, 3)->nullable();

            $table->boolean('mustache_value')->nullable();
            $table->decimal('mustache_confidence', 6, 3)->nullable();

            $table->boolean('eyeglasses_value')->nullable();
            $table->decimal('eyeglasses_confidence', 6, 3)->nullable();

            $table->boolean('sunglasses_value')->nullable();
            $table->decimal('sunglasses_confidence', 6, 3)->nullable();

            $table->boolean('eyes_open_value')->nullable();
            $table->decimal('eyes_open_confidence', 6, 3)->nullable();

            $table->boolean('mouth_open_value')->nullable();
            $table->decimal('mouth_open_confidence', 6, 3)->nullable();

            $table->boolean('face_occluded_value')->nullable();
            $table->decimal('face_occluded_confidence', 6, 3)->nullable();

            $table->boolean('smile_value')->nullable();
            $table->decimal('smile_confidence', 6, 3)->nullable();

            $table->json('raw')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('face_details');
    }
};
