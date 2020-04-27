<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTablePacienteContrato extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CFG_PACIENTE_CONTRATO', function (Blueprint $table) {
            $table->increments('ID_PAC_CONTRATO');
            $table->integer('ID_CONTRATO')->unsigned();
            $table->integer('ID_PACIENTE')->unsigned();

            $table->foreign('ID_CONTRATO')->references('ID_CONTRATO')->on('FAC_CONTRATO');
            $table->foreign('ID_PACIENTE')->references('ID_PACIENTE')->on('CFG_PACIENTE')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CFG_PACIENTE_CONTRATO');
    }
}
