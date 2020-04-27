<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableGrupoHorarioDia extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CFG_GRUPO_HORARIO_DIA', function (Blueprint $table) {
            $table->increments('ID_GRUPO_DIA');
            $table->string('DIA');
            $table->time('HORA_INICIO');
            $table->time('HORA_FIN');
            $table->integer('ID_GRUPO')->unsigned();

            $table->foreign('ID_GRUPO')->references('ID_GRUPO')->on('CFG_GRUPO_HORARIO')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CFG_GRUPO_HORARIO_DIA');
    }
}
