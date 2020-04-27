<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAddColumnTipoToCita extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('CIT_CITA', function (Blueprint $table) {
            $table->integer('TIPO_CITA');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('CIT_CITA', function (Blueprint $table) {
            $table->dropColumn(['TIPO_CITA']);
        });
    }
}
