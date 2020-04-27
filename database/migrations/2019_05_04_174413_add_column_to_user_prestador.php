<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnToUserPrestador extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('CFG_USER_PRESTADOR', function (Blueprint $table) {
            $table->integer('CONCURRENCIA');
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
            $table->dropColumn(['CONCURRENCIA']);
        });
    }
}
