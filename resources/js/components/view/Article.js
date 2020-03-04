import React, { Component , Fragment } from 'react';

const FIELDS = [
    {titolo: 'titolo', type: ''},
    {titolo: 'tempo_cottura', type: 0},
    {titolo: 'modalita_preparazione', type: ''},
    {titolo: 'porzioni', type: 0},
    {titolo: 'ingredienti', type: [] },
    {titolo: 'calorie', type:0},
    {titolo: 'difficolta', type:0},
    {titolo: 'autore', type:''},
    {titolo: 'tipologia', type:''},
    {titolo: 'img', type:''},
    {titolo: 'data_creazione', type:'0000-00-00'}
];

export default class Article extends Component {

    constructor(props){
        super(props);

        let data = {};

        FIELDS.map((fd,id) => {
            data[fd.titolo] = fd.type;
        });

        this.state = {
            data: data,
            loader: false
        };
    }

 
    render() {
        let data = this.state.data;

        return (

            <article className="container-fluid">
                    <h1>{data.titolo}</h1>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="info">{data.autore}</div>
                            <div className="info">{data.tipologia}</div>
                        </div>
                    </div>
                    <div className="content">
                        <div className="image">
                            <img src={data.img} />
                        </div>
                        <div className="row">
                            <div className="">{data.porzioni}</div>
                            <div className="">{data.tempo_cottura}</div>
                        </div>
                        <div>
                            <ul>
                                {data.ingredienti.map((i,k) => {
                                  return <li>{i}</li>  
                                })}
                            </ul>
                        </div>
                        <div>
                            <p>
                                {data.modalita_preparazione}
                            </p>
                        </div>
                    </div>

            </article>

        );
    }
}
