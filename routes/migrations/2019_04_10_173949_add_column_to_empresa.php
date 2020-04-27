<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnToEmpresa extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('CFG_EMPRESA', function (Blueprint $table) {
            $table->integer('LOGO_SIZE')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('CFG_EMPRESA', function (Blueprint $table) {
            $table->dropColumn(['LOGO_SIZE']);
        });
    }
}
