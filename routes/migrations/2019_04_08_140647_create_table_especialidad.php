<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableEspecialidad extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CFG_ESPECIALIDAD', function (Blueprint $table) {
            $table->increments('ID_ESPECIALIDAD'); //IDENTIFICADOR DE LA TABLA
            $table->string('ESPECIALIDAD'); //DESCRIPCION DE LA ESPECIALIDAD
            $table->boolean('ACTIVO'); //INDICADOR SI ESTA ACTIVO O NO
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CFG_ESPECIALIDAD');
    }
}
