<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ingrediente extends Model
{
    protected $table = 'ingredienti';

    protected $fillable = [
        'titolo', 'calorie', 'SI'
    ];

}
