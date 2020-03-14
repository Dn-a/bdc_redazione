@extends('layouts.app')


@section('styles')
    <!-- Material Design -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
@endsection



@section('content')

    <div id="redazione">
    </div>

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}" defer></script>

    @php
        $menu = array('home');
        $user = Auth::user();
        $ruolo = $nome = '';
        
        if(isset($user)){
            $ruolo = $user->ruolo->titolo;
            $user = $ruolo=='autore' ? $user->autore : $user->redattore;
            $nome = $user->nome;// .' '. $user->cognome;
        
            if($ruolo == 'caporedattore') $menu = array_merge($menu,['redattori','approvate']);
            if($ruolo == 'redattore') $menu = array_merge($menu,['validate']);
            if($ruolo != 'autore') $menu = array_merge($menu,['autori','ingredienti','verifiche']);
            if($ruolo == 'autore') $menu = array_merge($menu,['ricette']);

            echo "<script>
                    let menu =".json_encode($menu).'; '.
                    "const USER_CONFIG = {
                        nome:'".$nome."',
                        ruolo:'".$ruolo."',".
                        "menu: menu,".
                    '}; //console.log(USER_CONFIG)'.
                "</script>";
        
        }
            
    @endphp

@endsection
