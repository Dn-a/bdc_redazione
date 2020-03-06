import React, { Component , Fragment } from 'react';

import {User} from './../Env';

import SearchField from '../utils/SearchField';
import { Button, AddButton } from '../utils/Button';
import InfiniteTable from '../utils/InfiniteTable';
import RedattoriModal from './../modal/RedattoriModal';


const COLUMNS = [
    { title: 'id', field: 'id' , align:'right'},
    { title: 'Nome', field: 'nome', style: {textTransform:'capitalize'}  },
    { title: 'Cognome', field: 'cognome', style: {textTransform:'capitalize'} },
    { title: 'Email', field: 'email' },
    { title: 'Matricola', field: 'matricola' },
    { title: 'Creato il', field:'data_creazione', render: cell => new Date(cell).toLocaleDateString("it-IT",{year:"numeric",month:"2-digit", day:"2-digit"})},
  ];


export default class Redattori extends Component {

    constructor(props){
        super(props);

        this.state = {
            rows: '',
            loader: false,
            show:false,
            reloadInfiniteTable:0
        };

        this.url = this.props.url+'/redattori';
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


    render() {

        let user = User();

        return (
            <div className="container-fluid pl-3 constraint">

                <div className="row mb-3 px-2">

                    <div className="col-md-6">
                        <SearchField showList={false} patternList={{id:'id',fields:['nome','cognome']}}
                        url={this.url+'/search'}
                        //query={idPtVendita!=-1 ? 'id_pt_vendita='+idPtVendita : ''}
                        callback={this._handleSearchFieldCallback}
                        />
                    </div>

                    <div className="col-md-6 text-right">
                        <AddButton onClick={this._handleShowModal}>
                        <i className="fa fa-plus-circle" aria-hidden="true"></i>
                        &nbsp;Nuovo Redattore</AddButton>

                        <RedattoriModal url={this.props.url}
                        show={this.state.show} onHide={this._handleCloseModal}
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
                            id='tb-redattori'
                            reload={this.state.reloadInfiniteTable}
                            url={this.url}
                            //query={idPtVendita!=-1 ? 'id_pt_vendita='+idPtVendita : ''}
                            columns={COLUMNS}
                            externalRows={this.state.rows}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
