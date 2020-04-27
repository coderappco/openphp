<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAddTableRangoEdades extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CFG_RANGO_EDADES', function (Blueprint $table) {
            $table->increments('ID_RANGO');
            $table->string('NOM_RANGO');
            $table->integer('EDAD_INICIAL');
            $table->integer('EDAD_FINAL')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CFG_RANGO_EDADES');
    }
}
