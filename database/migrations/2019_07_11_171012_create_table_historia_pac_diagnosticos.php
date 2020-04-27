<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableHistoriaPacDiagnosticos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('HISTORIA_CFG_PACIENTE_DIAG', function (Blueprint $table) {
            $table->increments('ID_HIST_PAC_DIAG');
            $table->integer('ID_HISTORIA_PACIENTE')->unsigned();
            $table->string('CAMPO');
            $table->integer('ID_DIAGNOSTICO')->unsigned();

            $table->foreign('ID_HISTORIA_PACIENTE')->references('ID_HISTORIA_PACIENTE')->on('HISTORIA_CFG_PACIENTE')->onDelete('cascade');
            $table->foreign('ID_DIAGNOSTICO')->references('ID_DIAGNOSTICO')->on('CFG_DIAGNOSTICO');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('HISTORIA_CFG_PACIENTE_DIAG');
    }
}
