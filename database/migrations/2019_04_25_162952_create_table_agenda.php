<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableAgenda extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CFG_AGENDA', function (Blueprint $table) {
            $table->increments('ID_AGENDA');
            $table->integer('ID_GRUPO')->unsigned(); 
            $table->integer('ID_SEDE')->unsigned(); 
            $table->integer('ID_USER_PRESTADOR')->unsigned(); 

            $table->foreign('ID_SEDE')->references('ID_SEDE')->on('CFG_EMPRESA_SEDE')->onDelete('cascade');
            $table->foreign('ID_GRUPO')->references('ID_GRUPO')->on('CFG_GRUPO_HORARIO');
            $table->foreign('ID_USER_PRESTADOR')->references('ID_USER_PRESTADOR')->on('CFG_USER_PRESTADOR')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CFG_AGENDA');
    }
}
