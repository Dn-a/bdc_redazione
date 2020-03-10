<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RicettaResource extends JsonResource
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
    

    public function __construct($items, $fields=null)
    {
        parent::__construct($items);

        if($fields!=null && is_array($fields))
            $this->withFields = array_merge($this->withFields,$fields);
    }

    public function toArray($request)
    {
        if(empty($this->withFields))
            return parent::toArray($request);

        return $this->filterFields($this);
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

        $array = [];
        foreach($this->withFields AS $value){
            $array[$value] = $item[$value];
        }
        return $array;
    }
}
