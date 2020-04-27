<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableOrdenImport extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CFG_ORDEN_IMPORT', function (Blueprint $table) {
            $table->increments('ID_IMPORT');
            $table->string('IDENTIFICADOR');
            $table->integer('POS');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CFG_ORDEN_IMPORT');
    }
}
