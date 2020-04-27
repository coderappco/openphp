<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableEscolaridad extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CFG_ESCOLARIDAD', function (Blueprint $table) {
            $table->increments('ID_ESCOLARIDAD');
            $table->string('COD_ESCOLARIDAD');
            $table->string('NOM_ESCOLARIDAD');
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
        Schema::dropIfExists('CFG_ESCOLARIDAD');
    }
}
