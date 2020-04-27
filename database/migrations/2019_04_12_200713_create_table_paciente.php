<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTablePaciente extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CFG_PACIENTE', function (Blueprint $table) {
            $table->increments('ID_PACIENTE');
            $table->integer('ID_TIPO_DOC')->unsigned();
            $table->string('NUM_DOC', 50)->unique();
            $table->date('FECHA_NAC')->nullable();
            $table->integer('GENERO')->nullable();
            $table->string('PRIMER_NOMBRE');
            $table->string('SEGUNDO_NOMBRE')->nullable();
            $table->string('PRIMER_APELLIDO');
            $table->string('SEGUNDO_APELLIDO')->nullable(); 
            $table->integer('ID_MUNICIPIO')->unsigned();
            $table->integer('ZONA')->nullable();
            $table->string('BARRIO')->nullable();
            $table->string('TELEF')->nullable();
            $table->string('MOVIL')->nullable();
            $table->string('CORREO')->nullable();
            $table->string('DIREC_PACIENTE')->nullable();
            $table->integer('ID_ESTADO_CIVIL')->unsigned();
            $table->integer('ID_GRP_SANG')->unsigned();
            $table->integer('ID_ESCOLARIDAD')->unsigned();
            $table->integer('ID_ETNIA')->unsigned();
            $table->integer('ID_OCUPACION')->unsigned();
            $table->integer('ID_DISCAPACIDAD')->unsigned();
            $table->integer('ID_RELIGION')->unsigned();
            $table->integer('GESTACION')->nullable();
            $table->integer('ID_TIPO_AFIL')->unsigned();
            $table->date('FECHA_AFIL')->nullable();
            $table->string('NUM_SISBEN')->nullable();
            $table->date('FECHA_SISBEN')->nullable();
            $table->integer('ID_REGIMEN')->unsigned();
            //$table->integer('ID_ADMINISTRADORA')->unsigned();
            $table->integer('DESPLAZADO');
            $table->integer('VIC_MALTRATO');
            $table->integer('VIC_CONF_ARMADO');
            $table->integer('PENSIONADO');
            $table->integer('LGBTI');
            $table->boolean('ACTIVO');

            $table->foreign('ID_TIPO_DOC')->references('ID_TIPO_IDENTIFICACION')->on('CFG_TIPO_IDENTIFICACION');
            $table->foreign('ID_MUNICIPIO')->references('ID_MUNICIPIO')->on('CFG_MUNICIPIOS');
            $table->foreign('ID_ESTADO_CIVIL')->references('ID_ESTADO_CIVIL')->on('CFG_ESTADO_CIVIL');
            $table->foreign('ID_GRP_SANG')->references('ID_GRP_SANG')->on('CFG_GRUPO_SANGUINEO');
            $table->foreign('ID_ESCOLARIDAD')->references('ID_ESCOLARIDAD')->on('CFG_ESCOLARIDAD');
            $table->foreign('ID_ETNIA')->references('ID_ETNIA')->on('CFG_ETNIA');
            $table->foreign('ID_OCUPACION')->references('ID_OCUPACION')->on('CFG_OCUPACION');
            $table->foreign('ID_DISCAPACIDAD')->references('ID_DISCAPACIDAD')->on('CFG_DISCAPACIDAD');
            $table->foreign('ID_RELIGION')->references('ID_RELIGION')->on('CFG_RELIGION');
            $table->foreign('ID_TIPO_AFIL')->references('ID_TIPO_AFIL')->on('CFG_TIPO_AFILIADO');
            $table->foreign('ID_REGIMEN')->references('ID_REGIMEN')->on('CFG_REGIMEN');
            //$table->foreign('ID_ADMINISTRADORA')->references('ID_ADMINISTRADORA')->on('FAC_ADMINISTRADORA');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CFG_PACIENTE');
    }
}
