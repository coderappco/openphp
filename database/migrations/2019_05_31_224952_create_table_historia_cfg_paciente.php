<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableHistoriaCfgPaciente extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('HISTORIA_CFG_PACIENTE', function (Blueprint $table) {
            $table->increments('ID_HISTORIA_PACIENTE');
            $table->integer('ID_PACIENTE')->unsigned();
            $table->integer('ID_PARENTESCO')->unsigned();
            $table->integer('ID_USUARIO')->unsigned();
            $table->integer('ID_HISTORIA')->unsigned();
            $table->datetime('FEC_DILIGENCIADA');

            $table->foreign('ID_USUARIO')->references('ID_USUARIO')->on('user');
            $table->foreign('ID_PACIENTE')->references('ID_PACIENTE')->on('CFG_PACIENTE')->onDelete('cascade');
            $table->foreign('ID_PARENTESCO')->references('ID_PARENTESCO')->on('CFG_PARENTESCO');
            $table->foreign('ID_HISTORIA')->references('ID_HISTORIA')->on('HISTORIA_CFG_VALIDACION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('HISTORIA_CFG_PACIENTE');
    }
}
