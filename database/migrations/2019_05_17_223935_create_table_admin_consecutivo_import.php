<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableAdminConsecutivoImport extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('FAC_ADMINISTRADORA_IMPORT', function (Blueprint $table) {
            $table->increments('ID_ADMIN_IMPORT');
            $table->integer('ID_ADMINISTRADORA')->unsigned();
            $table->string('IDENTIFICADOR');
            $table->integer('POS');

            $table->foreign('ID_ADMINISTRADORA')->references('ID_ADMINISTRADORA')->on('FAC_ADMINISTRADORA')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('FAC_ADMINISTRADORA_IMPORT');
    }
}
