<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAddColumnToPaciente extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('CFG_PACIENTE', function (Blueprint $table) {
            $table->string('PHOTO')->nullable();
            $table->integer('PHOTO_SIZE')->nullable();
            $table->boolean('CONTRATO');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('CFG_PACIENTE', function (Blueprint $table) {
            $table->dropColumn(['PHOTO_SIZE', 'PHOTO', 'CONTRATO']);
        });
    }
}
