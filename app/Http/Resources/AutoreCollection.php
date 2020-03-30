<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class AutoreCollection extends ResourceCollection
{
    protected $withFields = [
        'id',
        'nome',
        'cognome',
        'data_nascita',
        'email',
        'recapiti',
        'residenza',
        'data_creazione',
        'privacy'
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

        if(in_array('nome',$fields)){
            $nome = $item->user->nome;
            $item['nome'] = $nome;
        }
        if(in_array('cognome',$fields)){
            $cognome = $item->user->cognome;
            $item['cognome'] = $cognome;
        }
        if(in_array('recapiti',$fields)){
            $recapiti = 'tel: '.(string) $item->telefono . ' - cell: '.(string) $item->cellulare;
            $item['recapiti'] = $recapiti;
        }
        if(in_array('residenza',$fields)){
            $comune = (string) $item->indirizzo .' - '. (string) $item->comune->nome.' ('.(string) $item->comune->prov.')';
            $item['residenza'] = $comune;
        }
        if(in_array('email',$fields)){
            $email = $item->email();
            $item['email'] = $email;
        }
        if(in_array('data_creazione',$fields)){
            $dataC = $item->dataCreazione();
            $item['data_creazione'] = $dataC;
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
