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
  if(request()->header('accept')!='application/json'){

    Route::get('/{name1}', 'HomeController@index')->name('home')
    ->where('name1', '|home');      

    Route::get('/{name2}/{id}', 'HomeController@index')->name('home_2')
    ->where(
      [
        'name2' =>'blog',
        'id' => '[0-9]+'
      ]
    );


    // ADMIN | CAPOREDATTORE | REDATTORE
    //
    Route::middleware(['auth','ruolo:admin|caporedattore|redattore'])->group( function () {

      Route::get('/{name3}/{id}', 'HomeController@index')
      ->where(
        [
          'name3' =>'verifiche',
          'id' => '[0-9]+'
        ]
      );

      Route::get('/{name4}', 'HomeController@index')
        ->where('name4', 'autori|redattori|verifiche|approvate|validate')->name('home_3');

    });
    
    // ADMIN | CAPOREDATTORE | REDATTORE | AUTORE
    //
    Route::middleware(['auth'])->group( function () {

      Route::get('/{name5}', 'HomeController@index')
      ->where('name5', 'gestione-ricette|ingredienti|')->name('home_4');
      
        // View
        Route::get('/{name6}/{id}', 'HomeController@index')
        ->where(
          [
            'name6' =>'gestione-ricette|ingredienti',
            'id' => '[0-9]+'
          ]
        );

        // New
        Route::get('/{name7}/{name8}', 'HomeController@index')
        ->where(
          [
            'name7' =>'gestione-ricette',
            'name8' =>'new'
          ]
        );        

        // Edit
        Route::get('/{name9}/{id}/{name10}', 'HomeController@index')
        ->where(
          [
            'name9' => 'gestione-ricette',
            'id' => '[0-9]+',
            'name10' => 'edit'
          ]
        );
      
    });

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

  // Ricette
    Route::post('print-ricetta/{ricetta}', 'RicettaController@pdfGenerate');
    Route::put('ricette/verifica/{ricetta}', 'RicettaController@verifica');
    
});

// ADMIN | CAPOREDATTORE | REDATTORE | AUTORE
//
Route::middleware(['auth','ruolo:admin|caporedattore|redattore|autore'])->group( function () {

  // Ingredienti    
    Route::resource('ingredienti', 'IngredienteController',['as' => 'ingredienti']);

  // Ricette
    Route::post('ricette', 'RicettaController@store');
    Route::put('ricette/{ricetta}', 'RicettaController@update');    
    Route::delete('ricette/{ricetta}', 'RicettaController@destroy');

});