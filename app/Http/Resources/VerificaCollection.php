<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class VerificaCollection extends ResourceCollection
{
    protected $withFields = [
        'id',
        'titolo',
        'autore',
        'intro',
        'img',
        'data_creazione',
        'fase'
    ];
    protected $withPagination;


    public function __construct($items, $withPagination=false, $fields=null)
    {
        parent::__construct($items);

        if($fields!=null && is_array($fields))
            $this->withFields = array_merge($this->withFields,$fields);

        $this->withPagination = $withPagination;
    }

    // Pagination
    // return array
    public function toArray($request)
    {
        $collection = $this->collection->transform(function($items){
                return $this->filterFields($items);
            });

        if($this->withPagination )
            return [
                'data' => $collection,
                'pagination' => [
                    'total' => $this->total(),
                    'count' => $this->count(),
                    'per_page' => $this->perPage(),
                    'current_page' => $this->currentPage(),
                    'total_pages' => $this->lastPage()
                ]
            ];

        return $collection;
    }

    protected function filterFields($item)
    {
        $fields = $this->withFields;

        if(in_array('id',$fields)){
            $id = $item->ricetta->id;
            $item['id'] = $id;
        }
        if(in_array('titolo',$fields)){
            $titolo = $item->ricetta->titolo;
            $item['titolo'] = $titolo;
        }
        if(in_array('autore',$fields)){
            $autore = ucfirst($item->ricetta->autore->user->nome).' '.ucfirst($item->ricetta->autore->user->cognome);
            $item['autore'] = $autore;
        }
        if(in_array('redattore',$fields)){
            $redattore = ucfirst($item->redattore->user->nome).' '.ucfirst($item->redattore->user->cognome);
            $item['redattore'] = $redattore;
        }
        if(in_array('fase',$fields)){
            $fase = $item->ricetta->fase->titolo;
            $item['fase'] = $fase;
        }
        if(in_array('img',$fields)){
            $img = $item->ricetta->img;
            $item['img'] = $img;
        }
        if(in_array('tipologia',$fields)){
            $tipologia = $item->ricetta->tipologia;
            $item['tipologia'] = $tipologia;
        }

        if(empty($this->withFields)) return $item;

        $array = [];
        foreach($this->withFields AS $value){
            $array[$value] = $item[$value];
        }
        return $array;
    }


    // rimuove campi non necessari: 'links', 'meta'
    public function withResponse($request, $response)
    {
        $jsonResponse = json_decode($response->getContent(), true);
        unset($jsonResponse['links'],$jsonResponse['meta']);
        $response->setContent(json_encode($jsonResponse));
    }
}
