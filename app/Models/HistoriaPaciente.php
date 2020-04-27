<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistoriaPaciente extends Model
{
    protected $table = 'HISTORIA_CFG_PACIENTE';

    protected $primaryKey = 'ID_HISTORIA_PACIENTE';

    public $timestamps = false;

    public function usuario()
    {
        return $this->belongsTo(User::class, 'ID_USUARIO', 'ID_USUARIO');
    }

    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'ID_PACIENTE', 'ID_PACIENTE');
    }

    public function parentesco()
    {
        return $this->belongsTo(Parentesco::class, 'ID_PARENTESCO', 'ID_PARENTESCO');
    }

    public function historia()
    {
        return $this->belongsTo(Historia::class, 'ID_HISTORIA', 'ID_HISTORIA');
    }

    public function campos()
    {
        return $this->hasMany(HistoriapPacienteCampos::class, 'ID_HISTORIA_PACIENTE', 'ID_HISTORIA_PACIENTE');
    }

    public function familiares()
    {
        return $this->hasMany(HistoriaPacienteFamilia::class, 'ID_HISTORIA_PACIENTE', 'ID_HISTORIA_PACIENTE');
    }

    public function laboratorio()
    {
        return $this->hasMany(HistoriaPacienteExamenl::class, 'ID_HISTORIA_PACIENTE', 'ID_HISTORIA_PACIENTE');
    }

    public function examenurg()
    {
        return $this->hasMany(HistoriaPacienteExamUrg::class, 'ID_HISTORIA_PACIENTE', 'ID_HISTORIA_PACIENTE');
    }

    public function medicamento()
    {
        return $this->hasMany(HistoriaPacienteMedicamento::class, 'ID_HISTORIA_PACIENTE', 'ID_HISTORIA_PACIENTE');
    }

    public function diagnosticos()
    {
        return $this->hasMany(HistoriaPacienteDiag::class, 'ID_HISTORIA_PACIENTE', 'ID_HISTORIA_PACIENTE');
    }

    public function odontologia()
    {
        return $this->hasMany(HistoriaPacienteOdontograma::class, 'ID_HISTORIA_PACIENTE', 'ID_HISTORIA_PACIENTE');
    }

    public function odontrat()
    {
        return $this->hasMany(HistoriaPacienteOdonTrat::class, 'ID_HISTORIA_PACIENTE', 'ID_HISTORIA_PACIENTE');
    }

    public function indice()
    {
        return $this->hasMany(HistoriaPacienteIndice::class, 'ID_HISTORIA_PACIENTE', 'ID_HISTORIA_PACIENTE');
    }

    public function servicio()
    {
        return $this->hasMany(HistoriaPacienteServicios::class, 'ID_HISTORIA_PACIENTE', 'ID_HISTORIA_PACIENTE');
    }

    public function consentimientos()
    {
        return $this->hasMany(HistoriaPacienteOdonCons::class, 'ID_HISTORIA_PACIENTE', 'ID_HISTORIA_PACIENTE');
    }
}
