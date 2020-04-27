<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableDpto extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CFG_DPTO', function (Blueprint $table) {
            $table->increments('ID_DPTO');//IDENTIFICADOR DE LA TABLA
            $table->string('NOM_DEPARTAMENTO');//NOMBRE DEL DEPARTAMENTO
            $table->integer('COD_DEPARTAMENTO');//CODIGO DEL DEPARTAMENTO
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CFG_DPTO');
    }
}
