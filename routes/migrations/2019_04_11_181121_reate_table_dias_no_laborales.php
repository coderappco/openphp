<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ReateTableDiasNoLaborales extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CIT_CFG_DIA_NO_LABORAL', function (Blueprint $table) {
            $table->increments('ID_DIA_NO_LABORAL');
            $table->integer('ID_SEDE')->unsigned(); //IDENTIFICADOR DE LA EMPRESA
            $table->date('FEC_NO_LABORAL');

            $table->foreign('ID_SEDE')->references('ID_SEDE')->on('CFG_EMPRESA_SEDE');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CIT_CFG_DIA_NO_LABORAL');
    }
}
