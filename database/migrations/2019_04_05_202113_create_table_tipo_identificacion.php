<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableTipoIdentificacion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CFG_TIPO_IDENTIFICACION', function (Blueprint $table) {
            $table->increments('ID_TIPO_IDENTIFICACION'); //IDENTIFICADOR DE LA TABLA
            $table->string('COD_TIPO_IDENTIFICACION', 5); //CODIGO DE LA IDENTIFICACION DEFINDO POR EL USUARIO FINAL
            $table->string('NOM_TIPO_IDENTIFICACION', 50); //NOMBRE DE LA IDENTIFICACION DEFINDO POR EL USUARIO FINAL
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
        Schema::dropIfExists('CFG_TIPO_IDENTIFICACION');
    }
}
