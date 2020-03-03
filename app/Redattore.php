<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Redattore extends Model
{
    protected $table = 'redattori';

    public $timestamps = false;
    
    protected $fillable = [
        'nome', 'cognome', 'cf', 'matricola','id_users'
    ];
}
