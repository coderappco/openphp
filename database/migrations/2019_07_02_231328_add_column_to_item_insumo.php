<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnToItemInsumo extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('FAC_ITEM', function (Blueprint $table) {
            $table->boolean('INSUMO')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('FAC_ITEM', function (Blueprint $table) {
            $table->dropColumn(['INSUMO']);
        });
    }
}
