<?php

namespace App\Http\Controllers;

use App\Http\Resources\RedattoreCollection;
use App\Redattore;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class RedattoreController extends Controller
{
    private $lmtSearch = 15;

    public function index(Request $request)
    {
        $page = $request->input('per-page') ?: 10;

        // view che mostra lo storico noleggi
        $only = $request->input('only') ?: '';

        $user = Auth::user();
        $ruolo = $user->ruolo->titolo;

        if($ruolo!='caporedattore') return response()->json([],404);

        $redattore = Redattore::orderBy('id','DESC')->paginate($page);

        return new RedattoreCollection(
            $redattore,
            true
            //$this->moreField($ruolo)
        );
    }


    public function search(Request $request, $val)
    {
        $arr = explode(' ',$val);

        $only = $request->input('only') ?: '';
        //$noleggi = in_array('noleggi', explode('-',$only));

        $user = Auth::user(); $ruolo = $user->ruolo->titolo;

        if($ruolo!='caporedattore') return response()->json([],404);

        $redattore = Redattore::
        whereHas('user', function($query) use($arr) {
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
            })
            //->orWhereHas('email','like',"$arr[0]%")
            ->orWhere('matricola','like',"$arr[0]%");
        })
        ->limit($this->lmtSearch)->get();


        return  new RedattoreCollection(
            $redattore,
            false
        );
    }


    public function create()
    {
        //
    }


    public function store(Request $request)
    {
        $user = Auth::user();
        $ruolo = $user->ruolo->titolo;

        if($ruolo!='caporedattore')
            return response()->json([],404);

        try{
            //return response()->json($request->all(),201);exit;
            //Validate
            $request->validate([
                'nome' => 'required|string|min:1|max:50',
                'cognome' => 'required|string|min:1|max:50',
                'matricola' => 'required|string|min:1|max:20',
                'email' => 'required|string|email|max:50|unique:users',
                'password' => 'required|string|min:8'
            ]);


            $data = $request->all();
            $data['matricola'] = strtoupper($request->matricola);

            $user = User::create([
                'nome' => $data['nome'],
                'cognome' => $data['cognome'],
                'email' => $data['email'],
                'id_ruolo' => 2,
                'password' => Hash::make($data['password'])
            ]);

            Redattore::create(
                [
                    'matricola' => $data['matricola'],
                    'id_user' => $user->id
                ]
            );

            return response()->json(['registration' =>'Registrazione redattore completata!'],201);

        }catch( \Illuminate\Database\QueryException $e){
            return response()->json(['msg' => $e->getMessage() ],500);
        }
    }


    public function show(Redattore $redattore)
    {
        //
    }


    public function edit(Redattore $redattore)
    {
        //
    }


    public function update(Request $request, Redattore $redattore)
    {
        //
    }


    public function destroy(Redattore $redattore)
    {
        //
    }
}
