<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Autore extends Model
{
    protected $table = 'autori';

    protected $fillable = [
        'nome', 'cognome', 'cf', 'data_nascita','email','telefono',
        'cellulare', 'indirizzo', 'id_comune','privacy'
    ];
   
}
