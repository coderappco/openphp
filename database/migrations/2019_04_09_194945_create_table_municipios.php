<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableMunicipios extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CFG_MUNICIPIOS', function (Blueprint $table) {
            $table->increments('ID_MUNICIPIO');//IDENTIFICADOR DE LA TABLA
            $table->string('NOM_MUNICIPIO');//NOMBRE DEL MUNICIPIO
            $table->integer('COD_MUNICIPIO');//CODIGO DEL MUNICIPIO

            $table->integer('ID_DPTO')->unsigned(); //IDENTIFICADOR DEL DEPARTAMENTO
            $table->foreign('ID_DPTO')->references('ID_DPTO')->on('CFG_DPTO');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CFG_MUNICIPIOS');
    }
}
