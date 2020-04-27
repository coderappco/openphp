<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTablePacienteOdonTratamiento extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('HISTORIA_CFG_PACIENTE_ODON_TRAT', function (Blueprint $table) {
            $table->increments('ID_HIST_PAC_ODON_TRAT');
            $table->integer('ID_HISTORIA_PACIENTE')->unsigned();
            $table->string('CAMPO');
            $table->string('NAME');
            $table->string('TRATAMIENTO');

            $table->foreign('ID_HISTORIA_PACIENTE')->references('ID_HISTORIA_PACIENTE')->on('HISTORIA_CFG_PACIENTE')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('HISTORIA_CFG_PACIENTE_ODON_TRAT');
    }
}
