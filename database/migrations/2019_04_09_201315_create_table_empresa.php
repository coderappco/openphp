<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableEmpresa extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CFG_EMPRESA', function (Blueprint $table) {
            $table->increments('ID_EMPRESA');
            $table->integer('ID_MUNICIPIO')->unsigned(); //IDENTIFICADOR DEL MUNICIPIO
            $table->string('NUM_TRIBUTARIO', 20)->unique(); //NUMERO DE IDENTIFICADOR TRIBUTARIO
            $table->string('NOM_EMPRESA'); //NOMBRE DE LA EMPRESA
            $table->string('NUM_DOC_REP_LEGAL')->nullable(); //NUMERO DE CEDULA DEL REPRESENTANTE LEGAL DE LA EMPRESA
            $table->string('NOM_REP_LEGAL')->nullable(); //NOMBRE DEL GERENTE O REPRESENTANTE LEGAL
            $table->string('DIREC_EMP')->nullable(); //DIRECCION DE LA EMPRESA
            $table->string('TELEF')->nullable(); //TELEFONO 1 DE LA EMPRESA
            $table->string('CORREO')->nullable(); //CORREO ELECTRONICO DE LA EMPRESA
            $table->string('LOGO_EMP')->nullable(); //LOGOTIPO DE LA EMPRESA QUE SE UTILIZA EN LOS ENCABEZADOS DE LOS INFORMES DE LA APLICACIÓN
            $table->string('WEBSITE')->nullable(); //PAGINA WEB DE LA EMPRESA

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
        Schema::dropIfExists('CFG_EMPRESA');
    }
}
