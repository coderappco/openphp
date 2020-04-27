<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAddColumnTableAdminConsecutivoImport extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('FAC_ADMINISTRADORA_IMPORT', function (Blueprint $table) {
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
        Schema::table('FAC_ADMINISTRADORA_IMPORT', function (Blueprint $table) {
            $table->dropColumn(['DESCRIPCION']);
        });
    }
}
