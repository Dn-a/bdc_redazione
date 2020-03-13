import React, { Component , Fragment } from 'react';
import { Link} from 'react-router-dom';
import {User} from './../Env';

import SearchField from '../utils/SearchField';
import { Button, AddButton } from '../utils/Button';
import InfiniteTable from '../utils/InfiniteTable';


const COLUMNS = [
    { title: 'id', field: 'id' , align:'right'},
    { title: 'Titolo', field: 'titolo',img:''},
    User().ruolo !='autore'?
        ({ title: 'Autore', field: 'autore', style: {textTransform:'capitalize'}})
    :null,
    { title: 'Tipologia', field: 'tipologia', render: (cell,row) => row.tipologia.titolo.charAt(0).toUpperCase()+row.tipologia.titolo.slice(1)},
    { title: 'Difficoltà', field: 'difficolta', style: {textTransform:'capitalize'}},
    { title: 'Tempi', field: 'tempo_cottura', render:(cell,row) => 
        {
            return(
                <Fragment>
                    <div><strong>Preparazione:</strong> {row.tempo_preparazione} min</div>
                    <div><strong>Cottura:</strong> {row.tempo_cottura} min</div>
                </Fragment>
            )
        }
    },
    { title: 'Fase', field: 'fase', style: {textTransform:'capitalize'}},
    { title: 'Creato il', field:'data_creazione', render: cell => new Date(cell).toLocaleDateString("it-IT",{year:"numeric",month:"2-digit", day:"2-digit"})},
    { title: 'Azioni', field:'actions', render:(cell,row,handle) => 
        {   
            if(row.fase=='bozza' || row.fase=='inviata')
                return(
                    <Button className='btn-light' title="Rimuovi Ricetta"
                        onClick={ (e) => {
                            e.stopPropagation();
                            if(confirm("Sicuro di volerla eliminare?")){
                                handle(row,'rimuovi')
                            }
                        }}
                    >
                        <i className="fa fa-trash-o" aria-hidden="true"></i>

                    </Button>
                )
        }
    },
  ].map((a) => { if(a!=null) return a; return false; } );;


export default  class Ricette extends Component {

    constructor(props){
        super(props);

        this.state = {
            rows: '',
            loader: false,
            show:false,
            reloadInfiniteTable:0,
            errorRegMessage:''
        };

        this.url = this.props.url+'/ricette';
        
        this._handleSearchFieldCallback = this._handleSearchFieldCallback.bind(this);   

    }

    componentDidMount(){
        //this.getRemoteData();
    }

    deleteRemoteData($id){

        let url = this.props.url+'/ricette/'+$id;

        let headers = {headers: {'Accept': 'application/json',
            'Content-Type': 'application/json'
            }
        };

        let sendData = {};

        sendData._method = 'delete';
        sendData._token = CSRF_TOKEN;        

        //console.log(sendData);return;

        return axios.post(url,sendData,headers)
        .then(result => {
            //console.log(result);

            this.setState({ reloadInfiniteTable : (++this.state.reloadInfiniteTable)});

            return result;

        }).catch((error) => {
            console.error(error.response);
            let msg = '';
            if(error.response!==undefined ){
                if(error.response.data.errors)
                    msg = error.response.data.errors;
                else if(error.response.data.msg)
                    msng = error.response.data.msg;
            } 
            this.setState({errorRegMessage: msg});
            throw error;
        });

    }
    
    
    _handleSearchFieldCallback(data,reset){

        //console.log(rows);

        let rows = this.state.rows;

        rows = data.data;
        this.setState({rows});

        if(reset){
            rows = '';
            this.setState({rows});
        }

    }


    render() {

        let user = User();
        let history = this.props.router.history;

        return (
            <div className="container-fluid pl-3 constraint">

                <div className="row mb-3 px-2">

                    <div className="col-md-6">
                        <SearchField showList={false} 
                        //patternList={{id:'id',fields:['titolo','cognome']}}
                        url={this.url+'/search'}
                        query='only=ricette'
                        callback={this._handleSearchFieldCallback}
                        />
                    </div>

                    <div className="col-md-6 text-right">
                        {user.ruolo=='autore' &&
                            <AddButton onClick={() => history.push(this.props.url+'/gestione-ricette/new')}>
                            <i className="fa fa-plus-circle" aria-hidden="true"></i>
                            &nbsp;Nuova Ricetta</AddButton>
                        }
                    </div>

                </div>
                <div className="row">
                    <div className="col-md-12">
                        <InfiniteTable
                            id='tb-ricette'
                            reload={this.state.reloadInfiniteTable}
                            url={this.url}
                            query='only=ricette'
                            columns={COLUMNS}
                            externalRows={this.state.rows}
                            onClick={(row) => {
                                    //console.log(row)
                                    if(row.fase=='bozza')
                                        history.push(this.props.url+'/gestione-ricette/'+row.id+'/edit')
                                    else
                                        history.push(this.props.url+'/gestione-ricette/'+row.id)
                                }
                            }
                            onActions={ (row,type) => this.deleteRemoteData(row.id) }
                        />
                    </div>
                </div>
            </div>
        );
    }
}