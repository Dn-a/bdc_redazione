<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRicetteIngredientiTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ricette_ingredienti', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('id_ricetta');
            $table->unsignedInteger('id_ingrediente');
            $table->integer('quantita');
        });

        Schema::table('ricette_ingredienti', function($table) {
        	$table->foreign('id_ricetta')->references('id')->on('ricette')->onDelete('restrict');
        	$table->foreign('id_ingrediente')->references('id')->on('ingredienti')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ricette_ingredienti');
    }
}
