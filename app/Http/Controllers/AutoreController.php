<?php

namespace App\Http\Controllers;

use App\Autore;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AutoreController extends Controller
{
    
    public function index()
    {
        //
    }

    
    public function create()
    {
        //
    }

    
    public function registrazione(Request $request)
    {   
        try{
            
            //return response()->json($request->all(),201);exit;

            $request->validate([
                'nome' => 'required|string|max:50',
                'cognome' => 'required|string|max:50',            
                'data_nascita' => 'required|date',
                'telefono' => 'required|string|max:12',
                'cellulare' => 'required|string|max:12',
                'indirizzo' => 'required|string|max:50',
                'id_comune' => 'required|integer',
                'privacy' => 'required|mimes:jpeg,bmp,png,pdf',
                'email' => 'required|string|email|max:50|unique:users',
                'password' => 'required|string|min:8',
            ]);
            
            //return response()->json($request->all(),201);exit;

            $data = $request->all();

            $temp = file_get_contents($request->privacy);
            $blob = base64_encode($temp);
            $data['privacy'] = $blob;

            $user = User::create([            
                'email' => $data['email'],
                'password' => Hash::make($data['password'])
            ]);
                
            Autore::create(
                [
                    'nome' => $data['nome'],
                    'cognome' => $data['cognome'],
                    'data_nascita' => $data['data_nascita'],
                    'telefono' => $data['telefono'],
                    'cellulare' => $data['cellulare'],
                    'indirizzo' => $data['indirizzo'],
                    'id_comune' => $data['id_comune'],
                    'privacy' => $data['privacy'],
                    'id_users' => $user->id
                ]
            );

            Auth::login($user,true);
            
            return response()->json(['registration' =>'Registrazione avvenuta con Successo!'],201);
        
        }catch( \Illuminate\Database\QueryException $e){
            return response()->json(['msg' => $e->getMessage() ],500);
        }   
    }

    
    public function show(Autore $autore)
    {
        //
    }

   
    public function edit(Autore $autore)
    {
        //
    }

    
    public function update(Request $request, Autore $autore)
    {
        //
    }

    
    public function destroy(Autore $autore)
    {
        //
    }
}
