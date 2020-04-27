<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableTratamientosOdontologicosHijos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CFG_TRAT_ODON_HIJO', function (Blueprint $table) {
            $table->increments('ID_TRAT_HIJO');
            $table->integer('ID_TRAT_PADRE')->unsigned();
            $table->string('CODIGO');
            $table->string('DESCRIPCION');
            $table->integer('TIPO_IDENTI')->nullable();
            $table->string('VALOR')->nullable();

            $table->foreign('ID_TRAT_PADRE')->references('ID_TRAT_PADRE')->on('CFG_TRAT_ODON_PADRE')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CFG_TRAT_ODON_HIJO');
    }
}
