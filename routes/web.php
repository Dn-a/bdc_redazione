<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes([
    'register' => false, // Registration Routes...
    //'reset' => false, // Password Reset Routes...
    //'verify' => false, // Email Verification Routes...
  ]);

if(request()->header('accept')=='application/json'){
  //Route::get('register', 'AutoreController@store')->name('register');
  Route::post('register', 'AutoreController@registrazione');
}

// browser request
if(request()->header('accept')!='application/json')
    Route::get('/{name}', 'HomeController@index')->name('home')
    ->where('name','(|home|clienti|dipendenti|video|magazzino|noleggi|prenotazioni|restituzioni|incassi|setting)');


// Comuni
Route::get('comuni/search/{val}', 'ComuneController@search')->name('comuni.search');