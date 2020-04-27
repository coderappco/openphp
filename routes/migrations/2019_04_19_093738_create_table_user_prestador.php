<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableUserPrestador extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CFG_USER_PRESTADOR', function (Blueprint $table) {
            $table->increments('ID_USER_PRESTADOR');
            $table->integer('ID_USUARIO')->unsigned();
            $table->integer('ID_ESPECIALIDAD')->unsigned();

            $table->foreign('ID_USUARIO')->references('ID_USUARIO')->on('user')->onDelete('cascade');
            $table->foreign('ID_ESPECIALIDAD')->references('ID_ESPECIALIDAD')->on('CFG_ESPECIALIDAD');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CFG_USER_PRESTADOR');
    }
}
