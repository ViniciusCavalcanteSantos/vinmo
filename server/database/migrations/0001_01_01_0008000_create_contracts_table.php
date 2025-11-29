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
            $table->foreignId('organization_id')->constrained();
            $table->unsignedBigInteger('category_id');
            $table->foreign('category_id')->references('id')->on('contract_categories');
            $table->string('code', 40);
            $table->string('title', 180);

            $table->text('searchable')->nullable();
            if (DB::connection()->getDriverName() !== 'sqlite') {
                $table->fullText('searchable');
            } else {
                $table->index('searchable');
            }

            $table->timestamps();

            $table->unique(['organization_id', 'code']);
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
