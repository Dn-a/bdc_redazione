@extends('layouts.app')


@section('styles')
    <!-- Material Design -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
@endsection



@section('content')

    <header>

        <button type="button" id="sidebarCollapse" class="btn btn-link">
            <i class="fa fa-align-left"></i>
        </button>

        <nav class="navbar navbar-expand-md navbar-light bg-white shadow-sm pl-5">

            <div class="container-fluid">

                <a class="navbar-brand" href="">
                    <strong>Video</strong>Noleggio
                </a>

                <div class="navbar-collapse d-table" id="navbarSupportedContent">


                    <ul class="navbar-nav mr-auto">

                    </ul>

                    <ul class="navbar-nav ml-auto">

                            <!--<li>Punto Vendita:
                                <span style="color: rgba(0, 0, 0, 0.5); ">

                                </span></li>-->

                            <li class="nav-item mr-4 dropdown" >
                                <a id="positionDropdown" class="nav-link dropdown-toggle d-inline-block" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre="false">
                                    <i class="fa fa-map-marker" aria-hidden="true"></i>
                                    {{Auth::user()}}
                                </a>
                                <div class="dropdown-menu px-3 dropdown-menu-right position-absolute" aria-labelledby="positionDropdown">
                                    Punto Vendita:
                                    <span style="color: rgba(0, 0, 0, 0.5); ">
                                    
                                    </span>
                                </div>
                            </li>

                            <li class="nav-item dropdown">
                                <span>{{ Auth::user()->ruolo->titolo }}: </span>
                                <a id="navbarDropdown" class="nav-link dropdown-toggle d-inline-block" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre="false">
                                    {{ ucfirst(Auth::user()) }} {{ ucfirst(Auth::user()) }} <span class="caret"></span>
                                </a>

                                <div class="dropdown-menu dropdown-menu-right position-absolute" aria-labelledby="navbarDropdown">
                                    <a class="dropdown-item" href=""
                                    onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                                        Logout
                                    </a>
                                    <form id="logout-form" action="{{ route('logout') }}" method="POST" style={style} >
                                        @csrf
                                    </form>
                                </div>
                            </li>
                    </ul>
                </div>

            </div>

        </nav>
    </header>

    <div id="noleggio">
    </div>

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}" defer></script>

    @php
        /*$array = array('home', 'prenotazioni', 'noleggi', 'clienti', 'magazzino');
        $user = Auth::user();
        $nome = $user->nome;// .' '. $user->cognome;
        $ruolo = $user->ruolo->titolo;
        $idPtVendita = $user->id_pt_vendita;
        if($ruolo != 'Addetto')
            $array = array_merge($array,['dipendenti','incassi']);

        echo "<script>
                let array =".json_encode($array).'; '.
                "const USER_CONFIG = {
                    nome:'".$nome."',
                    ruolo:'".$ruolo."',".
                    "menu:array,".
                    "id_pt_vendita:'".$idPtVendita."'".
                '}; //console.log(USER_CONFIG)'.
            "</script>";
            */
    @endphp

@endsection
