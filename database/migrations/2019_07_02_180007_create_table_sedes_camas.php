<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableSedesCamas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CFG_EMPRESA_SEDE_CAMA', function (Blueprint $table) {
            $table->increments('ID_SEDE_CAMA');
            $table->string('NUMERO'); //NOMBRE DE LA SEDE
            $table->integer('PISO'); //CODIGO DE LA SEDE
            $table->string('OBSERVACION')->nullable(); //DIRECCION DE LA SEDE
            $table->integer('URGENCIAS')->nullable(); //TELEFONO 1 DE LA SEDE
            $table->integer('ID_SEDE')->unsigned(); //IDENTIFICADOR DE LA EMPRESA

            $table->foreign('ID_SEDE')->references('ID_SEDE')->on('CFG_EMPRESA_SEDE')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CFG_EMPRESA_SEDE_CAMA');
    }
}
