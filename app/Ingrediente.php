<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ingrediente extends Model
{
    protected $table = 'ingredienti';

    public $timestamps = false;

    protected $fillable = [
        'titolo', 'attivo', 'calorie', 'unita_misura', 'img'
    ];

}
