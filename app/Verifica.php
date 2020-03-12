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

}
