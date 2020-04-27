<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableUserEmpresa extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CFG_USER_EMPRESA', function (Blueprint $table) {
            $table->increments('ID_USER_EMPRESA');
            $table->integer('ID_USUARIO')->unsigned();
            $table->integer('ID_EMPRESA')->unsigned();

            $table->foreign('ID_USUARIO')->references('ID_USUARIO')->on('user')->onDelete('cascade');
            $table->foreign('ID_EMPRESA')->references('ID_EMPRESA')->on('CFG_EMPRESA')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CFG_USER_EMPRESA');
    }
}
