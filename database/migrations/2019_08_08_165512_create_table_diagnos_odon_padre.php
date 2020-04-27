<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableDiagnosOdonPadre extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('CGF_DIAG_ODON_PADRE', function (Blueprint $table) {
            $table->increments('ID_DIAG_PADRE');
            $table->string('CODIGO');
            $table->string('DESCRIPCION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('CGF_DIAG_ODON_PADRE');
    }
}
