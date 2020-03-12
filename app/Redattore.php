<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Redattore extends Model
{
    protected $table = 'redattori';

    public $timestamps = false;
    
    protected $fillable = [
        'nome', 'cognome', 'matricola','id_user'
    ];

    public function email()
    {   
        $user = User::where('id',$this->id_user)->first();
        return $user->email;
    }

    public function ruolo()
    {   
        $user = User::where('id',$this->id_user)->first();
        return $user->ruolo->titolo;
    }

    public function dataCreazione()
    {   
        $user = User::where('id',$this->id_user)->first();
        return $user->created_at;
    }
}
