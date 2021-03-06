<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddComunHistPacOdonImage extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('HISTORIA_CFG_PACIENTE_ODONTOGRAMA', function (Blueprint $table) {
            $table->text('IMAGE')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('HISTORIA_CFG_PACIENTE_ODONTOGRAMA', function (Blueprint $table) {
            $table->dropColumn(['IMAGE']);
        });
    }
}
