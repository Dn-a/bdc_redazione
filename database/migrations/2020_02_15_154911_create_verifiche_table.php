<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVerificheTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('verifiche', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('id_ricetta');
            $table->unsignedInteger('id_redattore');
            //$table->enum('stato',['scartata','idonea','approvata'])->default('scartata');
            $table->unsignedInteger('id_fase')->default(1);
            $table->timestamp('data_creazione')->useCurrent();
            $table->timestamp('data_approvazione');
        });

        Schema::table('verifiche', function($table) {
        	$table->foreign('id_fase')->references('id')->on('fasi')->onDelete('restrict');
        	$table->foreign('id_ricetta')->references('id')->on('ricette')->onDelete('restrict');
        	$table->foreign('id_redattore')->references('id')->on('redattori')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('verifiche');
    }
}
