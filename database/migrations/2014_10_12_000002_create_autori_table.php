<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAutoriTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('autori', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nome',50);
            $table->string('cognome',50);
            $table->date('data_nascita');
            $table->unsignedInteger('id_users');
            $table->string('telefono',12);
            $table->string('cellulare',12);
            $table->string('indirizzo',50);
            $table->unsignedInteger('id_comune');
            $table->binary('privacy');
        });

        Schema::table('autori', function($table) {
        	$table->foreign('id_users')->references('id')->on('users')->onDelete('restrict');
        	$table->foreign('id_comune')->references('id')->on('comuni')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('autori');
    }
}
