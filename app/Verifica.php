<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Verifica extends Model
{
    protected $table = 'verifiche';

    public $timestamps = false;

    protected $fillable = [
        'id_ricetta', 'id_redattore', 'id_fase', 'data_creazione', 'data_approvazione'
    ];

    public function ricetta()
    {
        return $this->belongsTo('App\Ricetta','id_ricetta');
    }

    public function fase()
	{
        return $this->belongsTo('App\Fase','id_fase');
    }

    public function redattore()
	{
        return $this->belongsTo('App\Redattore','id_redattore');
    }

}
