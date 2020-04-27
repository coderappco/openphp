<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableItems extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('FAC_ITEM', function (Blueprint $table) {
            $table->increments('ID_ITEM');
            $table->string('COD_ITEM');
            $table->string('COT_NTFS')->nullable();
            $table->string('COD_CUP')->nullable();
            $table->string('COD_ISS')->nullable();
            $table->string('COD_CUM')->nullable();
            $table->string('NOM_ITEM');
            $table->string('NOM_GENERICO')->nullable();
            $table->string('NOM_COMERCIAL')->nullable();
            $table->string('PRES_ITEM')->nullable();
            $table->boolean('POS');
            $table->string('CONCENTRACION')->nullable();
            $table->boolean('CONTROL_MED')->nullable();
            $table->string('MOD_ADM')->nullable();
            $table->double('FAC_SOAT')->nullable();
            $table->double('VALOR_SOAT')->nullable();
            $table->double('FAC_ISS')->nullable();
            $table->double('VALOR_ISS')->nullable();
            $table->double('VALOR_PARTICULAR')->nullable();
            $table->string('ANIO')->nullable();
            $table->boolean('MEDICAMENTO')->nullable();
            $table->boolean('SERVICIO')->nullable();
            $table->boolean('EXAM_LAB')->nullable();
            $table->integer('EDAD_INICIAL')->nullable();
            $table->integer('UNID_EDAD_INICIAL')->nullable();
            $table->integer('EDAD_FINAL')->nullable();
            $table->integer('UNID_EDAD_FINAL')->nullable();
            $table->boolean('VALOR_IVA')->nullable();
            $table->boolean('VALOR_CREE')->nullable();
            $table->integer('GENERO')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('FAC_ITEM');
    }
}
