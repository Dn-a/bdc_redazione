<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Verifica extends Model
{
    protected $table = 'verifiche';

    public $timestamps = false;

    protected $fillable = [
        'id_ricetta', 'id_redattore', 'data_creazione', 'data_approvazione'
    ];

    public function ricetta()
    {
        return $this->belongsTo('App\Ricetta','id_ricetta');
    }

    public function redattore()
	{
        return $this->belongsTo('App\Redattore','id_redattore');
    }

}
