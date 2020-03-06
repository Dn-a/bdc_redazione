<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ricetta extends Model
{
    protected $table = 'ricette';

    public $timestamps = false;

    protected $fillable = [
        'titolo', 'tempo_cottura', 'intro', 'modalita_preparazione', 'porzioni','calorie',
        'difficolta', 'stato', 'id_autore', 'id_tipologia', 'note', 'img'
    ];

    public function autore()
    {
        return $this->belongsTo('App\Autore','id_autore');
    }

    public function tipologia()
    {
        return $this->belongsTo('App\Tipologia','id_tipologia');
    }

    public function ingredienti()
	{
        return $this->belongsToMany('App\Ingrediente','ricette_ingredienti','id_ricetta','id_ingrediente');
    }

}
