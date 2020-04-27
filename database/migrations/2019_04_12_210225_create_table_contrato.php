<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableContrato extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('FAC_CONTRATO', function (Blueprint $table) {
            $table->increments('ID_CONTRATO');
            $table->integer('ID_ADMINISTRADORA')->unsigned();
            $table->string('COD_CONTRATO');
            $table->string('NOM_CONTRATO');
            $table->date('FEC_INICIO');
            $table->date('FEC_FINAL');
            $table->integer('ID_REGIMEN')->unsigned();
            $table->integer('TIPO_PAGO');
            $table->integer('TIPO_FACTURA');
            $table->integer('NUM_AFILIADO')->nullable();
            $table->double('VALOR_TOTAL')->nullable();
            $table->double('VALOR_ALERTA')->nullable();
            $table->double('VALOR_MENSUAL')->nullable();
            $table->double('VALOR_MENSUAL_VAL')->nullable();
            $table->text('OBS_CONTRATO')->nullable();

            $table->foreign('ID_ADMINISTRADORA')->references('ID_ADMINISTRADORA')->on('FAC_ADMINISTRADORA')->onDelete('cascade');
            $table->foreign('ID_REGIMEN')->references('ID_REGIMEN')->on('CFG_REGIMEN');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('FAC_CONTRATO');
    }
}
