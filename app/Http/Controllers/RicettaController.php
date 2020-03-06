<?php

namespace App\Http\Controllers;

use App\Http\Resources\RicettaCollection;
use App\Http\Resources\RicettaResource;
use App\Ricetta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RicettaController extends Controller
{
    private $lmtSearch = 15;

    public function index(Request $request)
    {
        $page = $request->input('per-page') ?: 9;

        // view che mostra lo storico noleggi
        $only = $request->input('only') ?: '';
        $blog = in_array('blog', explode('-',$only));

        $user = Auth::user();

        $ricette = Ricetta::
            where(function($query) use ($blog,$user) {
                if($blog || !Auth::check())                      
                    $query->where('stato', 'approvata');
                if(Auth::check() && $user->ruolo=='autore' )
                    $query->where('id_autore', $user->autore->id);
            })
            ->orderBy('data_creazione','DESC')->paginate($page);

        return new RicettaCollection(
            $ricette, 
            true,
            $this->moreField($blog) 
        );
    }

    public function search(Request $request, $val)
    {
        $arr = explode(' ',$val);

        $only = $request->input('only') ?: '';
        $blog = in_array('blog', explode('-',$only));
        
        $ricette = Ricetta::
        where(function($query) use ($blog) {
            if($blog || !Auth::check())                        
                $query->where('stato', 'approvata');
        })
        ->where(function($query) use($arr) {
            $query->where('titolo','like', $arr[0].'%')
            ->orWhere('calorie','like', $arr[0].'%')
            ->orWhere('difficolta','like', $arr[0].'%')            
            ->orWhere('stato','like', $arr[0].'%')            
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


        return  new RicettaCollection(
            $ricette,
            false,
            $this->moreField($blog)
        );
    }

    private function moreField($blog=false)
    {
        $moreFields = [            
        ];

        if(!$blog)
            $moreFields =  array_merge($moreFields,
                ['ingredienti', 'modalita_preparazione','porzioni','autore', 'tipologia','data_creazione','stato']
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

    
    public function show(Ricetta $ricetta)
    {   
        //print_r($ricetta);exit;
        //return $ricetta;
        return new RicettaResource(
            $ricetta, 
            $this->moreField() 
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
