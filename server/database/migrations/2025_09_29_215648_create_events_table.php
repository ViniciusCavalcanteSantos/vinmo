<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained();
            $table->foreignId('contract_id');
            $table->unsignedBigInteger('type_id');
            $table->foreign('type_id')->references('id')->on('event_types');
            $table->date('event_date');
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->string('description', 300)->nullable();

            $table->text('searchable')->nullable();
            if (DB::connection()->getDriverName() !== 'sqlite') {
                $table->fullText('searchable');
            } else {
                $table->index('searchable');
            }

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
