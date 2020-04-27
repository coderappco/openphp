<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableHistoriaCfgValid extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('HISTORIA_CFG_VALIDACION', function (Blueprint $table) {
            $table->increments('ID_HISTORIA');
            $table->string('NOM_HISTORIA');
            $table->integer('ID_RANGO')->nullable();
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
        Schema::dropIfExists('HISTORIA_CFG_VALIDACION');
    }
}
