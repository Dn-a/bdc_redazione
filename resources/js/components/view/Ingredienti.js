import React, { Component , Fragment } from 'react';
import {User} from './../Env';

import SearchField from '../utils/SearchField';
import { Button, AddButton } from '../utils/Button';
import InfiniteTable from '../utils/InfiniteTable';
import IngredienteModal from '../modal/IngredienteModal';


const COLUMNS = [
    { title: 'id', field: 'id' , align:'right'},
    { title: 'Titolo', field: 'titolo',img:''},
    User().ruolo !='autore'?
        ({ title: 'Autore', field: 'autore', style: {textTransform:'capitalize'}})
    :null,
    { title: 'Calorie', field: 'calorie'},
    { title: 'Unità di misura', field: 'unita_misura'},
    { title: 'Fase', field: 'fase', style: {textTransform:'capitalize'}},
    { title: 'Approvazione', field:'actions', render:(cell,row,handle) =>
        {

            return(
                <Fragment>
                    {row.attivo=='0' &&
                        <Button className='btn-light mr-3' title="Approva"
                            onClick={ (e) => {
                                e.stopPropagation();
                                if(confirm("Sicuro di volerlo approvare?")){
                                    handle(row,'approva')
                                }
                            }}
                        >
                            <i className="fa fa-gavel" aria-hidden="true"> Approva</i>

                        </Button>
                    }
                        {/* {<Button className='btn-light' title="Rimuovi Ingrediente"
                                onClick={ (e) => {
                                    e.stopPropagation();
                                    if(confirm("Confermi?")){
                                        handle(row,'elimina')
                                    }
                                }}
                            >
                            <i className="fa fa-trash-o" aria-hidden="true"> Elimina</i>

                        </Button>} */}
                </Fragment>
            )
        }
    },
  ].map((a) => { if(a!=null) return a; return false; } );;


export default  class Ingredienti extends Component {

    constructor(props){
        super(props);

        this.state = {
            rows: '',
            loader: false,
            show:false,
            reloadInfiniteTable:0,
            errorRegMessage:''
        };

        this.url = this.props.url+'/ingredienti';

        this._handleCloseModal = this._handleCloseModal.bind(this);
        this._handleShowModal = this._handleShowModal.bind(this);
        this._handleSearchFieldCallback = this._handleSearchFieldCallback.bind(this);

    }

    componentDidMount(){
        //this.getRemoteData();
    }

    _handleCloseModal () {
        this.setState({show : false});
    }
    _handleShowModal (){
        this.setState({show : true});
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

    setRemoteData($id, type){

        let url = this.props.url+'/ingredienti/'+$id;

        let headers = {headers: {'Accept': 'application/json',
            'Content-Type': 'application/json'
            }
        };

        let sendData = {};

        sendData.approva = 1;
        sendData._method = type=='elimina'? 'delete' : 'put';
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

    render() {

        let user = User();
        let history = this.props.router.history;

        return (
            <div className="container-fluid pl-3 constraint">

                <div className="row mb-3 px-2">

                    <div className="col-md-6">
                        <SearchField showList={false}
                        url={this.url+'/search'}
                        callback={this._handleSearchFieldCallback}
                        />
                    </div>

                    <div className="col-md-6 text-right">
                        <AddButton onClick={this._handleShowModal}>
                        <i className="fa fa-plus-circle" aria-hidden="true"></i>
                        &nbsp;Nuovo Ingrediente</AddButton>

                        <IngredienteModal
                        url={this.props.url}
                        show={this.state.show}
                        onHide={this._handleCloseModal}
                        callback={
                            (row) => {
                                this.setState({reloadInfiniteTable:++(this.state.reloadInfiniteTable)});
                            }
                        } />
                    </div>

                </div>
                <div className="row">
                    <div className="col-md-12">
                        <InfiniteTable
                            id='tb-ingredienti'
                            reload={this.state.reloadInfiniteTable}
                            url={this.url}
                            columns={COLUMNS}
                            externalRows={this.state.rows}
                            onActions={ (row,type) => this.setRemoteData(row.id,type) }
                        />
                    </div>
                </div>
            </div>
        );
    }
}
