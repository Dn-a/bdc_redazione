<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RicettaIngrediente extends Model
{
    protected $table = 'ricette_ingredienti';

    public $timestamps = false;

    protected $fillable = [
        'id_ricetta', 'id_ingrediente', 'quantita'
    ];
}
