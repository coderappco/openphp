<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableEstadoCivil extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CFG_ESTADO_CIVIL', function (Blueprint $table) {
            $table->increments('ID_ESTADO_CIVIL');
            $table->string('COD_ESTADO_CIVIL');
            $table->string('NOM_ESTADO_CIVIL');
            $table->boolean('ACTIVO');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CFG_ESTADO_CIVIL');
    }
}
