<?php

namespace App\Http\Controllers\Auth;

use App\Autore;
use App\User;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Auth\RegistersUsers;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = '/home';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'nome' => ['required', 'string', 'max:50'],
            'cognome' => ['required', 'string', 'max:50'],            
            'data_nascita' => ['required', 'date'],
            'telefono' => ['required', 'string','max:12'],
            'cellulare' => ['required', 'string','max:12'],
            'indirizzo' => ['required', 'string','max:50'],
            'id_comune' => ['required', 'integer'],
            'privacy' => ['required', 'mimes:jpeg,bmp,png,pdf'],
            'email' => ['required', 'string', 'email', 'max:50', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\User
     */
    protected function create(array $data)
    {
        $user = User::create([            
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
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

        return $user;
    }
}
