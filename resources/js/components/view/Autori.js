import React, { Component , Fragment } from 'react';

import SearchField from '../utils/SearchField';
import DropDownSelect from '../utils/form/DropdownSelect';
import { Button, AddButton } from '../utils/Button';
import InfiniteTable from '../utils/InfiniteTable';
import RedattoriModal from './../modal/RedattoriModal';


const COLUMNS = [
    { title: 'id', field: 'id' , align:'right'},
    { title: 'Nome', field: 'nome', style: {textTransform:'capitalize'}  },
    { title: 'Cognome', field: 'cognome', style: {textTransform:'capitalize'} },
    { title: 'Data di Nascita', field:'data_nascita',
        render: cell  =>  new Date(cell).toLocaleDateString("it-IT",{year:"numeric",month:"2-digit", day:"2-digit"})
    },
    { title: 'Email', field: 'email' },
    { title: 'Recapiti', field: 'recapiti' },
    { title: 'Residenza', field: 'Residenza', style: {textTransform:'capitalize'} },
    { title: 'Privacy', field: 'privacy', render:
        (cell,row) => {

            if(cell==null ) return;

            let linkSource = 'data:application/pdf;base64,'+cell;
            //let downloadLink = document.createElement("a");
            let fileName = 'privacy_'+row.nome+'_'+row.cognome+'.pdf';

            return(
                <a className="privacy-file" href={linkSource} download={fileName}>
                    <i className="fa fa-file-pdf-o" aria-hidden="true"></i>
                </a>
            );
            //downloadLink.href = linkSource;
            //downloadLink.download = fileName;
            //downloadLink.click();
        }
    },
    { title: 'Creato il', field:'data_creazione', render: cell => new Date(cell).toLocaleDateString("it-IT",{year:"numeric",month:"2-digit", day:"2-digit"})},
  ];


export default class Autori extends Component {

    constructor(props){
        super(props);

        this.state = {
            rows: '',
            loader: false,
            show:false,
            reloadInfiniteTable:0
        };

        this.url = this.props.url+'/autori';
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

        let user = USER_CONFIG;
        let ruolo = user.ruolo;

        return (
            <div className="container-fluid pl-3 constraint">

                <div className="row mb-3 px-2">

                    <div className="col-md-6">
                        <SearchField showList={false} patternList={{id:'id',fields:['nome','cognome']}}
                        url={this.url+'/search'}
                        callback={this._handleSearchFieldCallback}
                        />
                    </div>

                </div>
                <div className="row">
                    <div className="col-md-12">
                        <InfiniteTable
                            id='tb-autori'
                            reload={this.state.reloadInfiniteTable}
                            url={this.url}
                            columns={COLUMNS}
                            externalRows={this.state.rows}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
