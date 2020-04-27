<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableSede extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CFG_EMPRESA_SEDE', function (Blueprint $table) {
            $table->increments('ID_SEDE');
            $table->integer('ID_MUNICIPIO')->unsigned(); //IDENTIFICADOR DEL MUNICIPIO
            $table->string('NOM_SEDE'); //NOMBRE DE LA SEDE
            $table->string('COD_SEDE'); //CODIGO DE LA SEDE
            $table->string('DIREC_SEDE')->nullable(); //DIRECCION DE LA SEDE
            $table->string('TELEF')->nullable(); //TELEFONO 1 DE LA SEDE
            $table->integer('ID_EMPRESA')->unsigned(); //IDENTIFICADOR DE LA EMPRESA

            $table->foreign('ID_MUNICIPIO')->references('ID_MUNICIPIO')->on('CFG_MUNICIPIOS');
            $table->foreign('ID_EMPRESA')->references('ID_EMPRESA')->on('CFG_EMPRESA')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CFG_EMPRESA_SEDE');
    }
}
