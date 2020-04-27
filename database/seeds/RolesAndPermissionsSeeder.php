<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Reset cached roles and permissions
        app()['cache']->forget('spatie.permission.cache');

        $this->createRoles();

        $user = \App\Models\User::first();

        $user->assignRole('ADMINISTRADOR');
    }

    protected function createRoles()
    {
        Role::create(['name' => 'ADMINISTRADOR']);

        Role::create(['name' => 'ADMIN']);

        Role::create(['name' => 'PRESTADOR']);

        Role::create(['name' => 'ENFERMERA']);

        Role::create(['name' => 'CITAS']);

        Role::create(['name' => 'FACTURACION']);

        Role::create(['name' => 'INVENTARIO']);
    }
}
