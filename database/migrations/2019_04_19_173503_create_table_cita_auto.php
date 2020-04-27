<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableCitaAuto extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CIT_CITA_AUTORIZACION', function (Blueprint $table) {
            $table->increments('ID_CITA_AUTO');
            $table->integer('ID_CITA')->unsigned();
            $table->integer('ID_AUTORIZACION')->unsigned();

            $table->foreign('ID_CITA')->references('ID_CITA')->on('CIT_CITA')->onDelete('cascade');
            $table->foreign('ID_AUTORIZACION')->references('ID_AUTORIZACION')->on('CIT_AUTORIZACION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CIT_CITA_AUTORIZACION');
    }
}
