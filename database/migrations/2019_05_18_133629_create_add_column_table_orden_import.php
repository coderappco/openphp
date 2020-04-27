<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAddColumnTableOrdenImport extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('CFG_ORDEN_IMPORT', function (Blueprint $table) {
            $table->string('DESCRIPCION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('CFG_ORDEN_IMPORT', function (Blueprint $table) {
            $table->dropColumn(['DESCRIPCION']);
        });
    }
}
