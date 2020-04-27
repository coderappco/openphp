<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableDiscapacidad extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CFG_DISCAPACIDAD', function (Blueprint $table) {
            $table->increments('ID_DISCAPACIDAD');
            $table->string('COD_DISCAPACIDAD');
            $table->string('NOM_DISCAPACIDAD');
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
        Schema::dropIfExists('CFG_DISCAPACIDAD');
    }
}
