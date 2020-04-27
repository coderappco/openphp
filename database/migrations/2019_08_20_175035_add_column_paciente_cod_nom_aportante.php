<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnPacienteCodNomAportante extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('CFG_PACIENTE', function (Blueprint $table) {
            $table->string('COD_APORTANTE')->nullable();
            $table->string('NOM_APORTANTE')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('CFG_PACIENTE', function (Blueprint $table) {
            $table->dropColumn(['COD_APORTANTE', 'NOM_APORTANTE']);
        });
    }
}
