<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateIngredientiTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ingredienti', function (Blueprint $table) {
            $table->increments('id');
            $table->string('titolo',50);
            $table->float('calorie');
            $table->string('unita_misura',10);
            $table->string('img',2048);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ingredienti');
    }
}
