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
            $table->string('modalita_preparazione');
            $table->integer('porzioni');
            $table->float('calorie');
            $table->enum('difficolta',['1','2','3','4','5'])->default('1');
            $table->enum('stato',['attesa','scartata','idonea','approvata'])->default('attesa');
            $table->unsignedInteger('id_autore');
            $table->unsignedInteger('id_tipologia');
            $table->string('note')->nullable();
            $table->string('img',2048);
            $table->timestamp('data_creazione')->useCurrent();
        });

        Schema::table('ricette', function($table) {
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
