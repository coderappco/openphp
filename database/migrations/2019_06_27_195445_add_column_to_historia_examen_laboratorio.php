<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnToHistoriaExamenLaboratorio extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('HISTORIA_CFG_PACIENTE_EXAMENL', function (Blueprint $table) {
            $table->string('RESULTADO')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('HISTORIA_CFG_PACIENTE_EXAMENL', function (Blueprint $table) {
            $table->dropColumn(['RESULTADO']);
        });
    }
}
