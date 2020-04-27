<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnTableDiagnostico extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('CFG_DIAGNOSTICO', function (Blueprint $table) {
            $table->boolean('ODONTO')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('CFG_DIAGNOSTICO', function (Blueprint $table) {
            $table->dropColumn(['ODONTO']);
        });
    }
}
