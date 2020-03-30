<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRedattoriTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('redattori', function (Blueprint $table) {
            $table->increments('id');
            //$table->string('nome',50); ridondate
            //$table->string('cognome',50); ridondate
            $table->string("matricola",20)->unique();
            $table->unsignedInteger('id_user');
        });

        Schema::table('redattori', function($table) {
        	$table->foreign('id_user')->references('id')->on('users')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('redattori');
    }
}
