<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableAutorizacionServicio extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CIT_AUTORIZACION_SERVICIO', function (Blueprint $table) {
            $table->increments('ID_AUTORIZACION_SERV');
            $table->integer('ID_AUTORIZACION')->unsigned();
            $table->integer('NUM_SESION_AUT');
            $table->integer('NUM_SESIONES_PEND');
            $table->integer('NUM_SESIONES_REAL');
            $table->integer('ID_ITEM')->unsigned();

            $table->foreign('ID_AUTORIZACION')->references('ID_AUTORIZACION')->on('CIT_AUTORIZACION')->onDelete('cascade');
            $table->foreign('ID_ITEM')->references('ID_ITEM')->on('FAC_ITEM');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CIT_AUTORIZACION_SERVICIO');
    }
}
