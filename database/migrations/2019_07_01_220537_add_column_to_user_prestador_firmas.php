<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnToUserPrestadorFirmas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('CFG_USER_PRESTADOR', function (Blueprint $table) {
            $table->text('FIRMA')->nullable();
            $table->integer('FIRMA_SIZE')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('CFG_USER_PRESTADOR', function (Blueprint $table) {
            $table->dropColumn(['FIRMA_SIZE', 'FIRMA']);
        });
    }
}
