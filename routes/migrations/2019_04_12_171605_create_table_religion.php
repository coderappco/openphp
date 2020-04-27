<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableReligion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CFG_RELIGION', function (Blueprint $table) {
            $table->increments('ID_RELIGION');
            $table->string('COD_RELIGION');
            $table->string('NOM_RELIGION');
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
        Schema::dropIfExists('CFG_RELIGION');
    }
}
