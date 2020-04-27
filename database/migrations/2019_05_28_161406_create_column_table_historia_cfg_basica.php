<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateColumnTableHistoriaCfgBasica extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('HISTORIA_CFG_BASICA', function (Blueprint $table) {
            $table->integer('ID_USUARIO')->unsigned();
            $table->datetime('FEC_DILIGENCIADA');

            $table->foreign('ID_USUARIO')->references('ID_USUARIO')->on('user');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('HISTORIA_CFG_BASICA', function (Blueprint $table) {
            $table->dropColumn(['ID_USUARIO', 'FEC_DILIGENCIADA']);
        });
    }
}
