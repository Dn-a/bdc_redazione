<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class RicettaCollection extends ResourceCollection
{
    protected $withFields = [
        'id',
        'titolo',
        'tempo_preparazione',
        'tempo_cottura',
        'intro',   
        'calorie',
        'difficolta',        
        'img'   
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

        if(in_array('autore',$fields)){
            $autore = ucfirst($item->autore->nome).' '.ucfirst($item->autore->cognome);
            $item['autore'] = $autore;
        }
        if(in_array('tipologia',$fields)){
            $tipologia = $item->tipologia;
            $item['tipologia'] = $tipologia;
        }
        if(in_array('ingredienti',$fields)){
            $ingredienti = $item->ingredienti;
            for($i=0; $i < count($ingredienti); $i++)            
            {
                $ingredienti[$i]['quantita'] = $ingredienti[$i]['pivot']['quantita'];
                unset(
                    $ingredienti[$i]['pivot']
                    //,$ingredienti[$i]['img']
                );
            }
            $item['ingredienti'] = $ingredienti;
        }
        if(in_array('fase',$fields)){
            $fase = $item->fase->titolo;
            $item['fase'] = $fase;
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
