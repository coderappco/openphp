<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableTratamientosOdontologicos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CFG_TRAT_ODON_PADRE', function (Blueprint $table) {
            $table->increments('ID_TRAT_PADRE');
            $table->string('CODIGO');
            $table->string('DESCRIPCION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CFG_TRAT_ODON_PADRE');
    }
}
