<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(\App\Models\User::class)->create([
            'NO_IDENTIFICACION' => '83111124762',
            'NOMBRES' => 'Liusvani',
            'APELLIDOS' => 'Suarez Barzaga',
            'USUARIO' => 'lsbescorpion',
            'CONTRASENA' => bcrypt('lsbarzaga'),
            'CORREO' => 'liusvani@gmail.com',
            'ACTIVO' => true,
            'VISIBLE' => true,
            'ID_TIPO_IDEN' => 2
        ]);
    }
}
