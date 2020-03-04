<?php

namespace App\Http\Controllers;

use App\Http\Resources\RicettaCollection;
use App\Ricetta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RicettaController extends Controller
{

    public function index(Request $request)
    {
        $page = $request->input('per-page') ?: 9;

        // view che mostra lo storico noleggi
        $only = $request->input('only') ?: '';
        $storico = in_array('storico', explode('-',$only));
        
        //$user = Auth::user();
        //$ruolo = $user->ruolo->titolo;

        $ricette = Ricetta::where('stato', 'approvata')            
            ->orderBy('data_creazione','DESC')->paginate($page);

        return new RicettaCollection(
            $ricette, 
            true
            //$this->moreField($ruolo) 
        );
    }


    private function moreField($inUscita)
    {
        $moreFields = [            
        ];

        if($inUscita)
            $moreFields =  array_merge($moreFields,['numero_prenotazioni']);
        
        return $moreFields;
    }


    public function create()
    {
        //
    }

    
    public function store(Request $request)
    {
        //
    }

    
    public function show(Ricetta $ricetta)
    {
        return new RicettaCollection(
            $ricetta, 
            false
            //$this->moreField($ruolo) 
        );
    }

   
    public function edit(Ricetta $ricetta)
    {
        //
    }

    
    public function update(Request $request, Ricetta $ricetta)
    {
        //
    }

    
    public function destroy(Ricetta $ricetta)
    {
        //
    }
}
