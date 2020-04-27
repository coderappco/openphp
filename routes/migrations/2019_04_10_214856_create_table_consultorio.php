<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableConsultorio extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CFG_EMP_SEDE_CONSULTORIO', function (Blueprint $table) {
            $table->increments('ID_CONSULTORIO');
            $table->string('NOM_CONSULTORIO'); //NOMBRE DEL CONSULTORIO
            $table->string('COD_CONSULTORIO'); //CODIGO DEL CONSULTORIO
            $table->string('PISO_CONSUL'); //PISO DEL CONSULTORIO DEFAULT 1
            $table->integer('ID_SEDE')->unsigned(); //IDENTIFICADOR DE LA EMPRESA
            $table->integer('ID_ESPECIALIDAD')->unsigned(); //IDENTIFICADOR DE LA ESPECIALIDAD

            $table->foreign('ID_SEDE')->references('ID_SEDE')->on('CFG_EMPRESA_SEDE')->onDelete('cascade');
            $table->foreign('ID_ESPECIALIDAD')->references('ID_ESPECIALIDAD')->on('CFG_ESPECIALIDAD');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CFG_EMP_SEDE_CONSULTORIO');
    }
}
