<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableTipoAfiliado extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CFG_TIPO_AFILIADO', function (Blueprint $table) {
            $table->increments('ID_TIPO_AFIL');
            $table->string('NOM_TIPO_AFIL');
            $table->boolean('ACTIVO');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CFG_TIPO_AFILIADO');
    }
}
