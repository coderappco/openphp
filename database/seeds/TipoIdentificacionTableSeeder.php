<?php

use Illuminate\Database\Seeder;

class TipoIdentificacionTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(\App\Models\TipoIdentificacion::class)->create([
            'COD_TIPO_IDENTIFICACION' => 'CC',
            'NOM_TIPO_IDENTIFICACION' => 'CEDULA DE CIUDADANIA',
            'ACTIVO' => true,
        ]);
        factory(\App\Models\TipoIdentificacion::class)->create([
            'COD_TIPO_IDENTIFICACION' => 'CE',
            'NOM_TIPO_IDENTIFICACION' => 'CEDULA DE EXTRANJERIA',
            'ACTIVO' => true,
        ]);
        factory(\App\Models\TipoIdentificacion::class)->create([
            'COD_TIPO_IDENTIFICACION' => 'PA',
            'NOM_TIPO_IDENTIFICACION' => 'PASAPORTE',
            'ACTIVO' => true,
        ]);
        factory(\App\Models\TipoIdentificacion::class)->create([
            'COD_TIPO_IDENTIFICACION' => 'RC',
            'NOM_TIPO_IDENTIFICACION' => 'REGISTRO CIVIL',
            'ACTIVO' => true,
        ]);
        factory(\App\Models\TipoIdentificacion::class)->create([
            'COD_TIPO_IDENTIFICACION' => 'TI',
            'NOM_TIPO_IDENTIFICACION' => 'TARJETA DE IDENTIDAD',
            'ACTIVO' => true,
        ]);
        factory(\App\Models\TipoIdentificacion::class)->create([
            'COD_TIPO_IDENTIFICACION' => 'AS',
            'NOM_TIPO_IDENTIFICACION' => 'ADULTO SIN IDENTIFICACION',
            'ACTIVO' => true,
        ]);
        factory(\App\Models\TipoIdentificacion::class)->create([
            'COD_TIPO_IDENTIFICACION' => 'MS',
            'NOM_TIPO_IDENTIFICACION' => 'MENOR SIN IDENTIFICACION',
            'ACTIVO' => true,
        ]);
        factory(\App\Models\TipoIdentificacion::class)->create([
            'COD_TIPO_IDENTIFICACION' => 'NU',
            'NOM_TIPO_IDENTIFICACION' => 'NUMERO UNICO',
            'ACTIVO' => true,
        ]);
        factory(\App\Models\TipoIdentificacion::class)->create([
            'COD_TIPO_IDENTIFICACION' => 'SD',
            'NOM_TIPO_IDENTIFICACION' => 'SIN DETERMINAR',
            'ACTIVO' => true,
        ]);
        factory(\App\Models\TipoIdentificacion::class)->create([
            'COD_TIPO_IDENTIFICACION' => 'NIT',
            'NOM_TIPO_IDENTIFICACION' => 'NIT',
            'ACTIVO' => true,
        ]);
    }
}
