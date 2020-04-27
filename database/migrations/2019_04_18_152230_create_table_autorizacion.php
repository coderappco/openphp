<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableAutorizacion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CIT_AUTORIZACION', function (Blueprint $table) {
            $table->increments('ID_AUTORIZACION');
            $table->integer('ID_PACIENTE')->unsigned();
            $table->string('NUM_AUTORIZACION');
            $table->date('FEC_AUTORIZACION')->nullable();
            $table->boolean('CERRADA');
            $table->integer('ID_USUARIO_CREADOR')->unsigned();
            $table->datetime('FEC_CREACION');
            $table->boolean('FACTURADA');

            $table->foreign('ID_PACIENTE')->references('ID_PACIENTE')->on('CFG_PACIENTE')->onDelete('cascade');
            $table->foreign('ID_USUARIO_CREADOR')->references('ID_USUARIO')->on('user');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CIT_AUTORIZACION');
    }
}
