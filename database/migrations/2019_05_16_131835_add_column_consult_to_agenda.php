<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnConsultToAgenda extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('CFG_AGENDA', function (Blueprint $table) {
            $table->integer('ID_CONSULTORIO');

            //$table->foreign('ID_CONSULTORIO')->references('ID_CONSULTORIO')->on('CFG_EMP_SEDE_CONSULTORIO')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('CFG_AGENDA', function (Blueprint $table) {
            $table->dropColumn(['ID_CONSULTORIO']);
        });
    }
}
