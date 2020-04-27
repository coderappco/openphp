<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableHistoriaCfgBasica extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('HISTORIA_CFG_BASICA', function (Blueprint $table) {
            $table->increments('ID_HISTORIA_BASICA');
            $table->integer('ID_PACIENTE')->unsigned();
            $table->integer('ID_PARENTESCO')->unsigned();
            $table->string('NOM_PARIENTE')->nullable();
            $table->string('DIR_PARIENTE')->nullable();
            $table->string('TELEF_PARIENTE')->nullable();
            $table->string('ACOMPANANTE')->nullable();
            $table->integer('ID_ESCOLARIDAD')->unsigned();
            $table->integer('ID_ETNIA')->unsigned();
            $table->integer('ID_OCUPACION')->unsigned();
            $table->integer('ID_DISCAPACIDAD')->unsigned();
            $table->integer('ID_RELIGION')->unsigned();
            $table->integer('GESTACION')->nullable();

            $table->integer('DESPLAZADO');
            $table->integer('VIC_MALTRATO');
            $table->integer('VIC_CONF_ARMADO');
            $table->integer('PENSIONADO');
            $table->integer('LGBTI');
            $table->text('MOTIVO_CONSULTA')->nullable();

            $table->foreign('ID_PACIENTE')->references('ID_PACIENTE')->on('CFG_PACIENTE')->onDelete('cascade');
            $table->foreign('ID_PARENTESCO')->references('ID_PARENTESCO')->on('CFG_PARENTESCO');
            $table->foreign('ID_ESCOLARIDAD')->references('ID_ESCOLARIDAD')->on('CFG_ESCOLARIDAD');
            $table->foreign('ID_ETNIA')->references('ID_ETNIA')->on('CFG_ETNIA');
            $table->foreign('ID_OCUPACION')->references('ID_OCUPACION')->on('CFG_OCUPACION');
            $table->foreign('ID_DISCAPACIDAD')->references('ID_DISCAPACIDAD')->on('CFG_DISCAPACIDAD');
            $table->foreign('ID_RELIGION')->references('ID_RELIGION')->on('CFG_RELIGION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('HISTORIA_CFG_BASICA');
    }
}
