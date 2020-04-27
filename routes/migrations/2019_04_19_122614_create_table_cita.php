<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableCita extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CIT_CITA', function (Blueprint $table) {
            $table->increments('ID_CITA');
            $table->integer('ID_PACIENTE')->unsigned();
            $table->integer('ID_PRESTADOR')->unsigned();
            $table->integer('ID_USUARIO')->unsigned();
            $table->integer('ID_ITEM')->unsigned();
            $table->integer('ID_MOTIVO_CONSULTA')->unsigned();
            $table->datetime('FEC_CITA');
            $table->datetime('FEC_ESTADO');
            $table->datetime('FEC_SOLICITUD');
            $table->datetime('FEC_ASIGNACION_CITA');
            $table->integer('ID_ESTADO_CITA');
            $table->integer('ID_MEDIO_SOLICITUD');
            $table->text('OBS_CITA')->nullable();

            $table->foreign('ID_PACIENTE')->references('ID_PACIENTE')->on('CFG_PACIENTE')->onDelete('cascade');
            $table->foreign('ID_PRESTADOR')->references('ID_USER_PRESTADOR')->on('CFG_USER_PRESTADOR');
            $table->foreign('ID_USUARIO')->references('ID_USUARIO')->on('user');
            $table->foreign('ID_ITEM')->references('ID_ITEM')->on('FAC_ITEM');
            $table->foreign('ID_MOTIVO_CONSULTA')->references('ID_MOTIVO_CONSULTA')->on('CIT_CFG_MOTIVO_CONSULTA');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CIT_CITA');
    }
}
