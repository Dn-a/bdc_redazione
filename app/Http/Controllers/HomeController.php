<?php

namespace App\Http\Controllers;

use App\Tipologia;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //$this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $tipologia = Tipologia::get('titolo');
        return view('redazione')->with(['tipologia' => $tipologia]);
    }
}
