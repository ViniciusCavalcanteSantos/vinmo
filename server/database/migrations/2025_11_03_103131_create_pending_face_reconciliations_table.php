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
        Schema::create('pending_face_reconciliations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->cascadeOnDelete();
            $table->foreignUlid('image_id')->nullable()->constrained()->cascadeOnDelete();
            $table->enum('reason', ['images_ready', 'client_linked', 'manual'])->default('images_ready');

            $table->unique(['event_id', 'image_id', 'reason']);
            $table->timestamps();

            $table->index(['event_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pending_face_reconciliations');
    }
};
