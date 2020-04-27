<?php

use Faker\Generator as Faker;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(App\Models\User::class, function (Faker $faker) {
    return [
        'NO_IDENTIFICACION' => '83111124762',
        'NOMBRES' => 'Liusvani',
        'APELLIDOS' => 'Suarez Barzaga',
        'USUARIO' => 'lsbescorion',
        'CONTRASENA' => bcrypt('lsbarzaga'),
        'CORREO' => 'liusvani@gmail.com',
        'ACTIVO' => true,
        'VISIBLE' => true,
        'ID_TIPO_IDEN' => 2
    ];
});
