<?php

namespace App\Http\Controllers;

use App\Http\Resources\VerificaCollection;
use App\Verifica;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PDF;

class VerificaController extends Controller
{
    private $lmtSearch = 15;

    public function index(Request $request)
    {
        $page = $request->input('per-page') ?: 9;

        // view
        $only = $request->input('only') ?: '';        
        $viewScartate = in_array('scartate', explode('-',$only));
        

        $user = Auth::user();

        $isCaporedattore = $user->ruolo->titolo=='caporedattore';

        $ricette = Verifica::
            where(function($query) use ($viewScartate){
                if($viewScartate)
                    $query->where('id_fase',5);
            })
            ->where(function($query) use ($user){
                if($user->ruolo=='redattore')
                    $query->where('id_redattore',$user->redattore->id);
                elseif($user->ruolo=='caporedattore')
                    $query->where('id_fase',7);
            })
            ->orderBy('data_creazione','DESC')->paginate($page);

        return new VerificaCollection(
            $ricette,
            true,
            $this->moreField($viewScartate, $isCaporedattore)
        );
    }


    public function search(Request $request, $val)
    {
        $arr = explode(' ',$val);

        $only = $request->input('only') ?: '';        
        $viewScartate = in_array('scartate', explode('-',$only));

        $user = Auth::user();

        $isCaporedattore = $user->ruolo->titolo=='caporedattore';

        $ricette = Verifica::
            where(function($query) use ($viewScartate){
                if($viewScartate)
                    $query->where('id_fase',5);
            })
            ->where(function($query) use ($user){
                if($user->ruolo=='redattore')
                    $query->where('id_redattore',$user->redattore->id);
                elseif($user->ruolo=='caporedattore')
                    $query->where('id_fase',7);
            })
            ->whereHas('ricetta', function($query) use($arr) {
                $query->where('titolo','like', $arr[0].'%')
                ->orWhere('calorie','like', $arr[0].'%')
                ->orWhere('difficolta','like', $arr[0].'%')    
                ->orWhereHas('autore',function($query) use($arr) {
                    $query->where('nome',$arr[0])
                    ->orWhere('cognome',$arr[0])
                    ->orWhere('nome','like',$arr[0].'%')
                    ->orWhere('cognome','like',$arr[0].'%')
                    ->orWhere(function($query) use($arr) {
                        if(count($arr)==2)
                            $query->where('cognome','like',$arr[0].' '.$arr[1].'%');
                    })
                    ->orWhere(function($query) use($arr) {
                        if(isset($arr[1]))
                            $query->where('cognome','like',$arr[1].'%')
                            ->where('nome','like',$arr[0].'%');
                    });
                });            
            })            
            ->limit($this->lmtSearch)->get();


        return  new VerificaCollection(
            $ricette,
            false,
            $this->moreField($viewScartate, $isCaporedattore)
        );
    }

    private function moreField($viewScartate=false, $isCaporedattore=false )
    {
        $moreFields = [         
        ];

        if($viewScartate)
            $moreFields =  array_merge($moreFields,
                ['tipologia']
            );
        if($isCaporedattore)
            $moreFields =  array_merge($moreFields,
                ['redattore','data_approvazione']
            );
        
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

    
    public function show(Verifica $verifica)
    {
        //
    }

   
    public function edit(Verifica $verifica)
    {
        //
    }

    
    public function update(Request $request, Verifica $verifica)
    {
        //
    }

    
    public function destroy(Verifica $verifica)
    {
        //
    }
    
}
