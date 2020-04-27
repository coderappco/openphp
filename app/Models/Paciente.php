<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Paciente extends Model
{
    protected $table = 'CFG_PACIENTE';

    protected $primaryKey = 'ID_PACIENTE';

    public $timestamps = false;

    public function municipio()
    {
        return $this->belongsTo(Municipios::class, 'ID_MUNICIPIO', 'ID_MUNICIPIO');
    }

    public function contrato()
    {
        return $this->hasOne(PacienteContrato::class, 'ID_PACIENTE', 'ID_PACIENTE');
    }

    public function autorizacion()
    {
        return $this->hasMany(Autorizacion::class, 'ID_PACIENTE', 'ID_PACIENTE');
    }

    public function estadocivil()
    {
        return $this->hasOne(EstadoCivil::class, 'ID_ESTADO_CIVIL', 'ID_ESTADO_CIVIL');
    }

    public function identificacion()
    {
        return $this->hasOne(TipoIdentificacion::class, 'ID_TIPO_IDENTIFICACION', 'ID_TIPO_DOC');
    }

    public function etnia()
    {
        return $this->hasOne(Etnia::class, 'ID_ETNIA', 'ID_ETNIA');
    }

    public function discapacidad()
    {
        return $this->hasOne(Discapacidad::class, 'ID_DISCAPACIDAD', 'ID_DISCAPACIDAD');
    }

    public function escolaridad()
    {
        return $this->hasOne(Escolaridad::class, 'ID_ESCOLARIDAD', 'ID_ESCOLARIDAD');
    }

    public function religion()
    {
        return $this->hasOne(Religion::class, 'ID_RELIGION', 'ID_RELIGION');
    }

    public function ocupacion()
    {
        return $this->hasOne(Ocupacion::class, 'ID_OCUPACION', 'ID_OCUPACION');
    }
}
