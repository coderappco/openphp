<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAddColumnToCita extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('CIT_CITA', function (Blueprint $table) {
            $table->integer('ID_AGENDA')->unsigned();

            $table->foreign('ID_AGENDA')->references('ID_AGENDA')->on('CFG_AGENDA')->onDelete('cascade');
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
            $table->dropColumn(['ID_AGENDA']);
        });
    }
}
