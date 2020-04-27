<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableDiagnosOdonHijo extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CGF_DIAG_ODON_HIJO', function (Blueprint $table) {
            $table->increments('ID_DIAG_HIJO');
            $table->integer('ID_DIAG_PADRE')->unsigned();
            $table->string('CODIGO');
            $table->string('DESCRIPCION');
            $table->integer('TIPO_IDENTI')->nullable();
            $table->string('VALOR')->nullable();

            $table->foreign('ID_DIAG_PADRE')->references('ID_DIAG_PADRE')->on('CGF_DIAG_ODON_PADRE')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CGF_DIAG_ODON_HIJO');
    }
}
