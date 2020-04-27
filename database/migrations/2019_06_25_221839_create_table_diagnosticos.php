<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableDiagnosticos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CFG_DIAGNOSTICO', function (Blueprint $table) {
            $table->increments('ID_DIAGNOSTICO');
            $table->string('COD_DIAGNOSTICO');
            $table->string('NOM_DIAGNOSTICO');
            $table->integer('GENERO');
            $table->integer('EDAD_INICIAL')->nullable();
            $table->integer('UNID_EDAD_INICIAL')->nullable();
            $table->integer('EDAD_FINAL')->nullable();
            $table->integer('UNID_EDAD_FINAL')->nullable();
            $table->integer('ATEN_OBLIG')->nullable();
            $table->integer('VIG_EPIDEM')->nullable();
            $table->integer('DIS_MENTAL')->nullable();
            $table->integer('DIS_SENSORIAL')->nullable();
            $table->integer('DIS_MOTRIZ')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CFG_DIAGNOSTICO');
    }
}
