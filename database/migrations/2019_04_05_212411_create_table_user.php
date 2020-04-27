<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableUser extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user', function (Blueprint $table) {
            $table->increments('ID_USUARIO');//IDENTIFICADOR DE LA TABLA
            $table->string('NO_IDENTIFICACION', 50)->unique();//NO IDENTIFICACION DEL USUARIO FINAL
            $table->string('NOMBRES', 100);//NOMBRES DEL USUARIO FINAL
            $table->string('APELLIDOS', 100);//APELLIDOS DEL USUARIO FINAL
            $table->string('USUARIO', 50)->unique();//USUARIO
            $table->string('CONTRASENA');//CONTRASEñA DEL USUARIO FINAL
            $table->string('CORREO', 100)->unique();//CORREO DEL USUARIO FINAL
            $table->string('FOTO')->nullable();//FOTO DEL USUARIO FINAL
            $table->string('TARJETA_PROFESIONAL')->nullable();//TARJETA DEL USUARIO FINAL
            $table->boolean('ACTIVO'); //INDICADOR SI ESTA ACTIVO O NO
            $table->boolean('VISIBLE'); //INDICADOR SI ESTA VISIBLE O NO
            $table->integer('ID_TIPO_IDEN')->unsigned(); //IDENTIFICADOR DEL TIPO DE IDENTIFICACION

            $table->timestamps();

            $table->foreign('ID_TIPO_IDEN')->references('ID_TIPO_IDENTIFICACION')->on('CFG_TIPO_IDENTIFICACION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user');
    }
}
