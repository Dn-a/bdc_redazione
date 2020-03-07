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
    'reset' => false, // Password Reset Routes...
    'verify' => false, // Email Verification Routes...
  ]);

if(request()->header('accept')=='application/json'){
  //Route::get('register', 'AutoreController@store')->name('register');
  Route::post('register', 'AutoreController@registrazione');
}



// browser request
  if(request()->header('accept')!='application/json')
   {
      Route::get('/{name}', 'HomeController@index')->name('home')
      ->where('name', '|home|autori|redattori|blog|gestione-ricette|ingredienti|validazioni|setting');

      Route::get('/{name}/{id}', 'HomeController@index')->name('home')
      ->where(
        [
          'name' =>'blog|gestione-ricette|ingredienti|validazioni',
          'id' => '[0-9]+'
        ]
      );

      Route::get('/{name}/{name2}', 'HomeController@index')->name('home')
      ->where(
        [
          'name' =>'gestione-ricette',
          'name2' =>'new'
        ]
      );

      /*Route::get('/{name}/{id}/{name2}', 'HomeController@index')->name('home')
      ->where(
        [
          'name' =>'gestione-ricette',
          'name2' =>'edit',
          'id' => '[0-9]+'
        ]
      );*/
  }
      

// Ingredienti
  Route::get('ingredienti/search/{val}', 'IngredienteController@search')->name('ingredienti.search');


// Ricette
  Route::get('ricette/{ricetta}', 'RicettaController@show');
  Route::get('ricette/search/{val}', 'RicettaController@search')->name('ricette.search');
  Route::get('ricette', 'RicettaController@index')->name('ricette');  

// Comuni
  Route::get('comuni/search/{val}', 'ComuneController@search')->name('comuni.search');



/////////////////////////////////// AUTH ///////////////////////////////////

// ADMIN | CAPOREDATTORE
//
Route::middleware(['auth','ruolo:admin|caporedattore'])->group( function () {

  // Redattori
    Route::get('redattori/search/{val}', 'RedattoreController@search')->name('redattori.search');
    Route::resource('redattori', 'RedattoreController',['as' => 'redattori']);

});

// ADMIN | CAPOREDATTORE | REDATTORE
//
Route::middleware(['auth','ruolo:admin|caporedattore|redattore'])->group( function () {

  // Autori
    Route::get('autori/search/{val}', 'AutoreController@search')->name('autori.search');
    Route::resource('autori', 'AutoreController',['as' => 'autori']);

  // Verifiche
    Route::get('verifiche/search/{val}', 'VerificaController@search')->name('verifiche.search');
    Route::resource('verifiche', 'VerificaController',['as' => 'verifiche']);

});

// ADMIN | CAPOREDATTORE | REDATTORE | AUTORE
//
Route::middleware(['auth','ruolo:admin|caporedattore|redattore|autore'])->group( function () {

  // Ingredienti    
    Route::resource('ingredienti', 'IngredienteController',['as' => 'ingredienti']);

  // Ricette
    Route::post('ricette', 'RicettaController@store');

});