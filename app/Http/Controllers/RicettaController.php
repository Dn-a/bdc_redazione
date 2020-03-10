<?php

namespace App\Http\Controllers;

use App\Http\Resources\RicettaCollection;
use App\Http\Resources\RicettaResource;
use App\Ricetta;
use App\RicettaIngrediente;
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
        $viewRicette = in_array('ricette', explode('-',$only));
        
        $user = Auth::user();

        $ricette = Ricetta::
            where(function($query) use ($blog, $user) {
                if($blog || !Auth::check())                      
                    //$query->where('stato', 'approvata');
                    $query->whereHas('fase', function($query) {
                        $query->where('titolo','approvata');
                    });
                if(Auth::check() && $user->ruolo=='autore' )
                    $query->where('id_autore', $user->autore->id);
            })
            ->orderBy('data_creazione','DESC')->paginate($page);

        return new RicettaCollection(
            $ricette, 
            true,
            $this->moreField($blog, $viewRicette) 
        );
    }

    public function search(Request $request, $val)
    {
        $arr = explode(' ',$val);

        $only = $request->input('only') ?: '';
        $blog = in_array('blog', explode('-',$only));
        $viewRicette = in_array('ricette', explode('-',$only));

        $ricette = Ricetta::
        where(function($query) use ($blog) {
            if($blog || !Auth::check())                        
                $query->whereHas('fase', function($query) {
                    $query->where('titolo','approvata');
                });
        })
        ->where(function($query) use($arr) {
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


        return  new RicettaCollection(
            $ricette,
            false,
            $this->moreField($blog, $viewRicette)
        );
    }

    private function moreField($blog=false, $viewRicette=false, $viewRicetta=false)
    {
        $moreFields = [            
        ];

        if(!$blog && !$viewRicette)
            $moreFields =  array_merge($moreFields,
                ['ingredienti', 'modalita_preparazione','porzioni','autore', 'tipologia','data_creazione','fase']
            );
        else if($viewRicette)
            $moreFields =  array_merge($moreFields,
                ['tipologia','data_creazione','fase']
            );

        if($viewRicetta)
        $moreFields =  array_merge($moreFields,
            ['note']
        );
        
        return $moreFields;
    }


    public function create()
    {
        //
    }

    
    public function store(Request $request)
    {
        try{
            //return response()->json($request->fase=='bozza',201);exit;            

            if($request->fase!='bozza')
                $request->validate([
                    'titolo' => 'required|string|min:1|max:50',
                    'intro' => 'required|string|max:255',
                    'modalita_preparazione' => 'required|string|max:1024',
                    'porzioni' => 'required|integer',
                    'calorie' => 'required|regex:/^\d+(\.\d{1,6})?$/',
                    'tempo_preparazione' => 'required|integer',
                    'tempo_cottura' => 'required|integer',
                    'difficolta' => 'required|string',
                    'id_tipologia' => 'required|integer',
                    'id_ingredienti' => 'required|array',
                    'id_ingredienti.*' => 'required|integer',
                    'quantita_ingrediente' => 'required|array',
                    'quantita_ingrediente.*' => 'required|integer',
                    'note' => 'string|max:255',
                    'img' => 'required|string|min:1|max:2048'
                ]);

            //return response()->json($request->all(),201);exit;
            
            $data = $request->all();
            
            $user = Auth::user();

            $arrayRicetta = [
                'titolo' => $data['titolo'],
                'tempo_preparazione' => $data['tempo_preparazione'],
                'tempo_cottura' => $data['tempo_cottura'],
                'intro' => $data['intro'],
                'modalita_preparazione' => $data['modalita_preparazione'],
                'porzioni' => $data['porzioni'],
                'calorie' => $data['calorie'],
                'difficolta' => isset($data['difficolta']) ? $data['difficolta'] : 'facile',
                'id_tipologia' => isset($data['id_tipologia']) ? $data['id_tipologia'] : 1,
                'note' => $data['note'],
                'img' => $data['img'],
                'id_autore' => $user->autore->id
            ];

            if($request->fase=='inviata')
                $arrayRicetta['id_fase'] = 2;

            $ricetta = Ricetta::create($arrayRicetta);
            
            $arrayIngredienti = [];
            $cnt = count($data['id_ingredienti']);
            for( $j=0 ; $j < $cnt; $j++ ){
                $arrayIngredienti[$j]['id_ricetta'] = $ricetta->id;
                $arrayIngredienti[$j]['id_ingrediente'] = $data['id_ingredienti'][$j];
                $arrayIngredienti[$j]['quantita'] = $data['quantita_ingrediente'][$j] ? : 0;
            }
            
            if( $cnt > 0 ){
                $ri = new RicettaIngrediente();
                $ri->insert($arrayIngredienti);
            }

            //$ingrediente->fill($data)->save();                  

            $msg = $request->fase=='bozza' ? 'Bozza registrata!' : 'Ricetta inviata!';

            return response()->json(['insert' => $msg],201);

        }catch( \Illuminate\Database\QueryException $e){
            return response()->json(['msg' => $e->getMessage() ],500);
        }
    }

    
    public function show(Ricetta $ricetta)
    {   
        //print_r($ricetta);exit;
        //return $ricetta;
        return new RicettaResource(
            $ricetta, 
            $this->moreField(false,false,true) 
        );
    }

   
    public function edit(Ricetta $ricetta)
    {
        //
    }

    
    public function update(Request $request, Ricetta $ricetta)
    {
        
        try{
            //return response()->json($ricetta->all(),201);exit;            

            if($request->fase!='bozza')
                $request->validate([
                    'titolo' => 'required|string|min:1|max:50',
                    'intro' => 'required|string|max:255',
                    'modalita_preparazione' => 'required|string|max:1024',
                    'porzioni' => 'required|integer',
                    'calorie' => 'required|regex:/^\d+(\.\d{1,6})?$/',
                    'tempo_preparazione' => 'required|integer',
                    'tempo_cottura' => 'required|integer',
                    'difficolta' => 'required|string',
                    'id_tipologia' => 'required|integer',
                    'id_ingredienti' => 'required|array',
                    'id_ingredienti.*' => 'required|integer',
                    'quantita_ingrediente' => 'required|array',
                    'quantita_ingrediente.*' => 'required|integer',
                    'note' => 'string|max:255',
                    'img' => 'required|string|min:1|max:2048'
                ]);

            //return response()->json($request->all(),201);exit;
            
            $data = $request->all();
            
            $arrayRicetta = [
                'titolo' => $data['titolo'],
                'tempo_preparazione' => $data['tempo_preparazione'],
                'tempo_cottura' => $data['tempo_cottura'],
                'intro' => $data['intro'],
                'modalita_preparazione' => $data['modalita_preparazione'],
                'porzioni' => $data['porzioni'],
                'calorie' => $data['calorie'],
                'difficolta' => isset($data['difficolta']) ? $data['difficolta'] : 'facile',
                'id_tipologia' => isset($data['id_tipologia']) ? $data['id_tipologia'] : 1,
                'note' => $data['note'],
                'img' => $data['img']
            ];

            if($request->fase=='inviata')
                $arrayRicetta['id_fase'] = 2;

            $ricetta->update($arrayRicetta);
            
            $arrayIngredienti = [];
            $cnt = count($data['id_ingredienti']);
            for( $j=0 ; $j < $cnt; $j++ ){
                $arrayIngredienti[$j]['id_ricetta'] = $ricetta->id;
                $arrayIngredienti[$j]['id_ingrediente'] = $data['id_ingredienti'][$j];
                $arrayIngredienti[$j]['quantita'] = $data['quantita_ingrediente'][$j] ? : 0;                
            }
            
            $ricetta->ingredienti()->detach();
            $ricetta->ingredienti()->sync($arrayIngredienti);   

            $msg = $request->fase=='bozza' ? 'Bozza aggiornata!' : 'Ricetta aggiornata!';

            return response()->json(['insert' => $msg],201);

        }catch( \Illuminate\Database\QueryException $e){
            return response()->json(['msg' => $e->getMessage() ],500);
        }
    }

    
    public function destroy(Ricetta $ricetta)
    {
        //
    }
}
