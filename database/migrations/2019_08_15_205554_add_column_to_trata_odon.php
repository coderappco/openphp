<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnToTrataOdon extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('HISTORIA_CFG_PACIENTE_ODON_TRAT', function (Blueprint $table) {
            $table->integer('EVOLUCION');
            $table->text('OBSERVACION')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('HISTORIA_CFG_PACIENTE_ODON_TRAT', function (Blueprint $table) {
            $table->dropColumn(['EVOLUCION', 'OBSERVACION']);
        });
    }
}
