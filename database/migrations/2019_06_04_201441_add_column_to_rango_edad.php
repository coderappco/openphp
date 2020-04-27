<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnToRangoEdad extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('CFG_RANGO_EDADES', function (Blueprint $table) {
            $table->integer('EDAD_INICIAL_MESES');
            $table->integer('EDAD_FINAL_MESES');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('CFG_RANGO_EDADES', function (Blueprint $table) {
            $table->dropColumn(['EDAD_INICIAL_MESES', 'EDAD_FINAL_MESES']);
        });
    }
}
