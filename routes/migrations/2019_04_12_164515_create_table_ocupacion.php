<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableOcupacion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CFG_OCUPACION', function (Blueprint $table) {
            $table->increments('ID_OCUPACION');
            $table->string('COD_OCUPACION');
            $table->string('NOM_OCUPACION');
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
        Schema::dropIfExists('CFG_OCUPACION');
    }
}
