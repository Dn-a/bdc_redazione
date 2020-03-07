<?php

namespace App\Http\Controllers;

use App\Ingrediente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IngredienteController extends Controller
{   
    private $lmtSearch = 15;

    
    public function index(Request $request)
    {
        $page = $request->input('per-page') ?: 9;

        // view che mostra 
        $only = $request->input('only') ?: '';
        //$blog = in_array('blog', explode('-',$only));

        //$user = Auth::user();

        $ingrediente = Ingrediente::
            orderBy('id','DESC')->paginate($this->lmtSearch);

        return $ingrediente;
    }


    public function search(Request $request, $val)
    {
        $arr = explode(' ',$val);

        $only = $request->input('only') ?: '';
        //$blog = in_array('blog', explode('-',$only));
        
        $ingrediente = Ingrediente::
        where(function($query) use($arr) {
            $query->where('titolo','like', $arr[0].'%')
            ->orWhere('calorie','like', $arr[0].'%');            
        })    
        ->limit($this->lmtSearch)->get();

        return  $ingrediente;
    }
    

    public function create()
    {
        //
    }

    
    public function store(Request $request)
    {
        try{
            //return response()->json($request->all(),422);exit;
            //Validate
            $request->validate([
                'titolo' => 'required|string|min:1|max:50',
                'calorie' => 'required|regex:/^\d+(\.\d{1,6})?$/',
                'unita_misura' => 'required|string|min:1|max:5',
                'img' => 'required|string|min:1|max:2048'
            ]);


            $data = $request->all();

            $ingrediente = new Ingrediente();
            
            $ingrediente->fill($data)->save();                  

            return response()->json(['insert' =>'Ingrediente creato!'],201);

        }catch( \Illuminate\Database\QueryException $e){
            return response()->json(['msg' => $e->getMessage() ],500);
        }
    }

    
    public function show(Ingrediente $ingrediente)
    {
        //
    }

   
    public function edit(Ingrediente $ingrediente)
    {
        //
    }

    
    public function update(Request $request, Ingrediente $ingrediente)
    {
        //
    }

    
    public function destroy(Ingrediente $ingrediente)
    {
        //
    }
}
