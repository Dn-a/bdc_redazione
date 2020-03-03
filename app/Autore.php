<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Autore extends Model
{
    protected $table = 'autori';

    public $timestamps = false;
    
    protected $fillable = [
        'nome', 'cognome', 'data_nascita','id_users','telefono',
        'cellulare', 'indirizzo', 'id_comune','privacy'
    ];
   
}
