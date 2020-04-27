<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableTipoCita extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CIT_CFG_TIPO_CITA', function (Blueprint $table) {
            $table->increments('ID_TIPO_CITA');
            $table->string('NOM_TIPO_CITA'); //NOMBRE DE LA SEDE
            $table->date('FEC_CREACION'); //CODIGO DE LA SEDE
            $table->integer('ACTIVO'); //TELEFONO 1 DE LA SEDE
            $table->integer('ID_ITEM')->unsigned(); //IDENTIFICADOR DE LA EMPRESA

            $table->foreign('ID_ITEM')->references('ID_ITEM')->on('FAC_ITEM')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CIT_CFG_TIPO_CITA');
    }
}
