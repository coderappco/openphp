<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableAdministradora extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('FAC_ADMINISTRADORA', function (Blueprint $table) {
            $table->increments('ID_ADMINISTRADORA');
            $table->string('COD_ADMINISTRADORA', 50)->nullable();
            $table->string('NOM_ADMINISTRADORA', 150);
            $table->integer('ID_TIPO_DOCUMENTO')->unsigned();
            $table->string('NUM_TRIB', 150)->nullable();
            $table->integer('ID_MUNICIPIO')->unsigned();
            $table->string('NUM_IDEN_REP_LEGAL', 150)->nullable();
            $table->string('NOM_REP_LEGAL', 150)->nullable();
            $table->string('DIREC_ADMINISTRADORA')->nullable();
            $table->string('TELEF')->nullable();
            $table->string('CORREO')->nullable(); //CORREO ELECTRONICO DE LA EMPRESA
            $table->string('WEBSITE')->nullable();
            $table->string('TIPO_ADMINISTRADORA')->nullable();

            $table->foreign('ID_TIPO_DOCUMENTO')->references('ID_TIPO_IDENTIFICACION')->on('CFG_TIPO_IDENTIFICACION');
            $table->foreign('ID_MUNICIPIO')->references('ID_MUNICIPIO')->on('CFG_MUNICIPIOS');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('FAC_ADMINISTRADORA');
    }
}
