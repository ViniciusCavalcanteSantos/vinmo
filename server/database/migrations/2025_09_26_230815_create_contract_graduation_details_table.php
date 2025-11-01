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
        Schema::create('contract_graduation_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('contract_id')->unique();
            $table->foreign('contract_id')->references('id')->on('contracts')->onDelete('cascade');
            $table->enum('type', ['university', 'school']);
            $table->string('institution_name', 180);
            $table->string('institution_acronym', 20)->nullable();
            $table->string('class', 40);
            $table->enum('shift', ['morning', 'afternoon', 'night', 'full_time']);
            $table->year('conclusion_year');

            $table->string('university_course', 120)->nullable();
            $table->enum('school_grade_level', ['elementary_school', 'middle_school', 'high_school'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contract_graduation_details');
    }
};
