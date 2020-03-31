<?php

namespace App\Http\Controllers;

use App\Http\Resources\RicettaCollection;
use App\Http\Resources\RicettaResource;
use App\Ricetta;
use App\RicettaIngrediente;
use App\Verifica;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PDF;

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
        $viewVerifiche = in_array('verifiche', explode('-',$only));
        $viewValidate = in_array('validate', explode('-',$only));

        $user = Auth::user();

        $isCaporedattore =  Auth::check() && $user->ruolo->titolo == 'caporedattore';

        // FILTRI
        $ricetta = $request->input('ricetta');
        $tipologia = $request->input('tipologia');
        $difficolta = $request->input('difficolta');
        $tempo = $request->input('tempo')? explode('-',$request->input('tempo')): null;
        $calorie = $request->input('calorie') ? explode('-',$request->input('calorie')) : null;
        $ingredienti = $request->input('ingredienti') ? json_decode($request->input('ingredienti')) : null;

        $ricette = Ricetta::
            where(function($query) use ($blog, $user, $viewRicette, $viewVerifiche, $viewValidate,
                $ricetta, $tipologia, $difficolta, $tempo, $calorie, $ingredienti
            ) {
                if($ricetta)
                    $query->where('titolo',$ricetta);
                if($tipologia)
                    $query->whereHas('tipologia', function($query)  use($tipologia) {
                        $query->where('titolo',$tipologia);
                    });
                if($difficolta)
                    $query->where('difficolta',$difficolta);
                if($tempo && count($tempo) > 1){
                    $query->whereRaw("(tempo_cottura + tempo_preparazione) >= {$tempo[0]}");
                    $query->whereRaw("(tempo_cottura + tempo_preparazione) <= {$tempo[1]}");
                    //$query->where('tempo_cottura','<=', $tempo[1]);
                }
                if($calorie && count($calorie) > 1){
                    $query->where('calorie','>=', $calorie[0]);
                    $query->where('calorie','<=', $calorie[1]);
                }
                if($ingredienti && count($ingredienti) > 0 ){
                    $query->whereHas('ingredienti', function($query)  use($ingredienti) {
                        $query->whereIn('titolo', $ingredienti);
                    });
                }

                if($blog || !Auth::check())
                    //$query->where('stato', 'approvata');
                    $query->whereHas('fase', function($query) {
                        $query->where('titolo','approvata');
                    });
                elseif(Auth::check())
                    $query->whereHas('fase', function($query)  use($user, $viewVerifiche, $viewValidate ) {
                        if($viewVerifiche){
                            if($user->ruolo->titolo =='redattore' ){
                                $query->where('titolo','<>','bozza');
                                $query->where('titolo','<>','approvata');
                                $query->where('titolo','<>','idonea');
                                $query->where('titolo','<>','scartata');
                                $query->where('titolo','<>','approvazione');
                            }
                            elseif($user->ruolo->titolo =='caporedattore' ){
                                $query->where('titolo','<>','bozza');
                                $query->where('titolo','<>','inviata');
                                $query->where('titolo','<>','validazione');
                                $query->where('titolo','<>','approvata');
                                $query->where('titolo','<>','scartata');
                            }
                        }elseif($viewValidate){
                            if($user->ruolo->titolo =='redattore' ){
                                $query->where('titolo','idonea')
                                ->orWhere('titolo','approvata');
                            }
                            elseif($user->ruolo->titolo =='caporedattore' ){
                                $query->where('titolo','approvata');
                            }
                        }
                    });

                if(Auth::check() && $viewRicette && $user->ruolo->titolo =='autore' )
                    $query->where('id_autore', $user->autore->id);
            })
            ->orderBy('data_creazione','DESC')->paginate($page);

        return new RicettaCollection(
            $ricette,
            true,
            $this->moreField($blog, $viewRicette, $viewVerifiche, $isCaporedattore)
        );
    }

    public function search(Request $request, $val)
    {
        $arr = explode(' ',$val);

        $only = $request->input('only') ?: '';
        $blog = in_array('blog', explode('-',$only));
        $viewRicette = in_array('ricette', explode('-',$only));
        $viewVerifiche = in_array('verifiche', explode('-',$only));

        $user = Auth::user();

        $isCaporedattore = Auth::check() && $user->ruolo->titolo=='caporedattore';

        $ricette = Ricetta::
        where(function($query) use ($blog, $user, $viewRicette, $viewVerifiche) {
            if($blog || !Auth::check())
                $query->whereHas('fase', function($query) {
                    $query->where('titolo','approvata');
                });
            elseif($viewVerifiche && Auth::check())
                $query->whereHas('fase', function($query)  use($user) {
                    if($user->ruolo->titolo =='redattore' ){
                        $query->where('titolo','<>','bozza');
                        $query->where('titolo','<>','approvata');
                        $query->where('titolo','<>','idonea');
                        $query->where('titolo','<>','scartata');
                        $query->where('titolo','<>','approvazione');
                    }elseif($user->ruolo->titolo =='caporedattore' ){
                        $query->where('titolo','<>','bozza');
                        $query->where('titolo','<>','inviata');
                        $query->where('titolo','<>','validazione');
                        $query->where('titolo','<>','approvata');
                        $query->where('titolo','<>','scartata');
                    }
                });

            if(Auth::check() && $viewRicette && $user->ruolo->titolo =='autore' )
                $query->where('id_autore', $user->autore->id);
        })
        ->where(function($query) use($arr) {
            $query->where('titolo','like', $arr[0].'%')
            ->orWhere('calorie','like', $arr[0].'%')
            ->orWhere('difficolta','like', $arr[0].'%')
            ->orWhereHas('autore',function($query) use($arr) {
                $query->whereHas('user', function($query) use($arr) {
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
            });
        })
        ->limit($this->lmtSearch)->get();


        return  new RicettaCollection(
            $ricette,
            false,
            $this->moreField($blog, $viewRicette, $viewVerifiche, $isCaporedattore)
        );
    }

    private function moreField($blog=false, $viewRicette=false, $viewRicetta=false, $viewVerifiche=false, $isCaporedattore=false)
    {
        $moreFields = [
        ];

        if(!$blog && !$viewRicette && !$viewVerifiche)
            $moreFields =  array_merge($moreFields,
                ['ingredienti', 'modalita_preparazione','porzioni','autore', 'tipologia','data_creazione','fase']
            );
        else if($blog)
            $moreFields =  array_merge($moreFields,
                ['autore']
            );
        else if($viewRicette || $viewVerifiche)
            $moreFields =  array_merge($moreFields,
                ['tipologia','data_creazione','fase']
            );

        if($viewRicetta)
        $moreFields =  array_merge($moreFields,
            ['note']
        );

        if($isCaporedattore)
        $moreFields =  array_merge($moreFields,
            ['redattore']
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
                    'modalita_preparazione' => 'required|string|max:3096',
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

        $user = Auth::user();

        if( $ricetta->id_fase=='2' && Auth::check() && $user->ruolo->titolo =='redattore' )
            $ricetta->update(['id_fase' => 3]);

        else if( $ricetta->id_fase=='4' && Auth::check() && $user->ruolo->titolo =='caporedattore' ){

            $idFase = 6;

            // ridondante
            // $verifica = Verifica::where('id_ricetta',$ricetta->id);
            // $check = $verifica->exists();
            // if($check)
            //     $verifica->update([
            //         'id_fase' => $idFase
            //     ]);

            $ricetta->update(['id_fase' => $idFase]);
        }

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
                    'modalita_preparazione' => 'required|string|max:3096',
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

    public function verifica(Request $request, Ricetta $ricetta)
    {

        try{
            //return response()->json($ricetta->all(),201);exit;

            $request->validate([
                'fase' => 'required|string'
            ]);

            //return response()->json(['fase' => $request->fase],201);exit;

            $arrayRicetta = [
            ];

            if($request->fase == 'idonea')
                $arrayRicetta['id_fase'] = 4;
            elseif($request->fase == 'approvata')
                $arrayRicetta['id_fase'] = 7;
            elseif($request->fase == 'scartata')
                $arrayRicetta['id_fase'] = 5;

            $ricetta->update($arrayRicetta);

            $user = Auth::user();

            $verifica = Verifica::where('id_ricetta',$ricetta->id);

            $check = $verifica->exists();

            if(!$check)
                $verifica->insert([
                    'id_ricetta' => $ricetta->id,
                    'id_redattore' => $user->redattore->id
                    //'id_fase' => $arrayRicetta['id_fase'] ridondante
                ]);
            else{
                //$update = [ 'id_fase' => $arrayRicetta['id_fase'] ]; ridondante
                $update = [];
                date_default_timezone_set("Europe/Rome");
                if($arrayRicetta['id_fase'] == 7)
                   $update = array_merge($update, ['data_approvazione' => Carbon::now()] );
                $verifica->update($update);
            }

            return response()->json(['fase' => $request->fase],201);

        }catch( \Illuminate\Database\QueryException $e){
            return response()->json(['msg' => $e->getMessage() ],500);
        }
    }


    public function destroy(Ricetta $ricetta)
    {
        try{
            $ricetta->ingredienti()->detach();
            $ricetta->delete();

            return response()->json(['delete' => 'Ricetta eliminata!'],201);

        }catch( \Illuminate\Database\QueryException $e){
            return response()->json(['msg' => $e->getMessage() ],500);
        }

    }

    public function pdfGenerate(Request $request, Ricetta $ricetta)
    {
        //return $request->fields;
        $default = [
            'id',
            'titolo',
            'autore',
            'tipologia',
            'intro',
            'modalita_preparazione',// => 'Modalità preparazione',
            'tempo_preparazione',// => 'Tempo preparazione',
            'tempo_cottura',// => 'tempo cottura',
            'porzioni',
            'calorie',
            'ingredienti',
            'data_creazione',// => 'data creazione',
            'note'
        ];

        $fields = [];
        foreach($default as $df)
            if(in_array($df,$request->fields))
                $fields[] = $df;

        // $fields = isset($request->fields)? $request->fields : [
        //     'id',
        //     'titolo',
        //     'autore',
        //     'tipologia',
        //     'intro',
        //     'modalita_preparazione',// => 'Modalità preparazione',
        //     'tempo_preparazione',// => 'Tempo preparazione',
        //     'tempo_cottura',// => 'tempo cottura',
        //     'porzioni',
        //     'calorie',
        //     'ingredienti',
        //     'data_creazione',// => 'data creazione',
        //     'note'
        // ];

        /*if($id!=null){
            $ricetta = Ricetta::where('id',$id)->first();
            //$resource = new RicettaResource($ricetta);
        }*/

        $array = [
            'rows' => [$ricetta],
            'columns' =>  $fields,
            'fase' => $ricetta->fase->titolo,
        ];

        //return view('pdf.ricetta', $array);
        //PDF::setOptions(['dpi' => 96, 'fontHeightRatio' => '0.5']);
        //$pdf = PDF::loadView('pdf.ricevuta_pagamento', $array);
        $pdf = PDF::loadView('pdf.ricetta', $array)->setPaper('a4', 'landscape');
        $file = $pdf->download('ricetta.pdf');
        $blob = base64_encode($file);

        return $blob;
    }
}
