import React, { Component , Fragment } from 'react';


export default class Home extends Component {

    constructor(props){
        super(props);

        this.state = {
            rows: '',
            loader: false,
            incassi:{
                dipendenti:[],
                pt_vendita:[]
            },
            lstPtVendita:{},
            idPtVenditaSelected:-1,
            reloadInfiniteTable:0
        };
    }

 
    render() {
       
        return (

            <div className="container-fluid py-1">
                    Home
            </div>

        );
    }
}
