<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRicetteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ricette', function (Blueprint $table) {
            $table->increments('id');
            $table->string('titolo',50);
            $table->integer('tempo_preparazione');
            $table->integer('tempo_cottura');
            $table->string('intro');
            $table->string('modalita_preparazione');
            $table->integer('porzioni');
            $table->float('calorie');
            $table->enum('difficolta',['facile','media','difficile'])->default('facile');
            //$table->enum('stato',['bozza','inviata','validazione','idonea','scartata','approvazione','approvata'])->default('bozza');
            $table->unsignedInteger('id_fase')->default(1);
            $table->unsignedInteger('id_autore');
            $table->unsignedInteger('id_tipologia');
            $table->string('note')->nullable();
            $table->string('img',2048);
            $table->timestamp('data_creazione')->useCurrent();
        });

        Schema::table('ricette', function($table) {
        	$table->foreign('id_fase')->references('id')->on('fasi')->onDelete('restrict');
        	$table->foreign('id_autore')->references('id')->on('autori')->onDelete('restrict');
        	$table->foreign('id_tipologia')->references('id')->on('tipologie')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ricette');
    }
}
