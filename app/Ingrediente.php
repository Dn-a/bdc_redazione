<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ingrediente extends Model
{
    protected $table = 'ingredienti';

    public $timestamps = false;

    protected $fillable = [
        'titolo', 'calorie', 'unita_misura', 'img'
    ];

}
