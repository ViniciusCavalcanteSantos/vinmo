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
        Schema::create('face_crops', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->cascadeOnDelete();
            $table->foreignUlid('image_id')->constrained()->cascadeOnDelete();

            $table->integer('box_x');
            $table->integer('box_y');
            $table->integer('box_w');
            $table->integer('box_h');

            $table->boolean('dismissed')->default(false);
            $table->timestamps();

            $table->unique(['event_id', 'image_id', 'box_x', 'box_y', 'box_w', 'box_h'], 'uniq_face_detection');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('face_crops');
    }
};
