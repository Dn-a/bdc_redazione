<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Autore extends Model
{
    protected $table = 'autori';

    public $timestamps = false;

    protected $fillable = [
        'nome', 'cognome', 'data_nascita','id_user','telefono',
        'cellulare', 'indirizzo', 'id_comune','privacy'
    ];

    public function comune()
    {
        return $this->belongsTo('App\Comune','id_comune');
    }

    public function email()
    {
        $user = User::where('id',$this->id_user)->first();
        return $user->email;
    }

    public function dataCreazione()
    {
        $user = User::where('id',$this->id_user)->first();
        return $user->created_at;
    }

    public function user()
    {
        return $this->belongsTo('App\User','id_user');
    }
}
