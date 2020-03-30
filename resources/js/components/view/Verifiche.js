import React, { Component , Fragment } from 'react';
import { Link} from 'react-router-dom';
import {User} from './../Env';

import SearchField from '../utils/SearchField';
import { Button, AddButton } from '../utils/Button';
import InfiniteTable from '../utils/InfiniteTable';
import CheckField from '../utils/form/CheckField';


const COLUMNS = [
    { title: 'id', field: 'id' , align:'right'},
    { title: 'Titolo', field: 'titolo',img:''},
    User().ruolo !='autore'?
        ({ title: 'Autore', field: 'autore', style: {textTransform:'capitalize'}})
    :null,
    User().ruolo =='caporedattore'?
        ({ title: 'Redattore', field: 'redattore', style: {textTransform:'capitalize'}})
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
  ].map((a) => { if(a!=null) return a; return false; } );


const COLUMNS_VALIDATE = [
{ title: 'id', field: 'id' , align:'right'},
{ title: 'Titolo', field: 'titolo',img:'', render: (cell,row) =>
    {
        let style = {fontSize:'0.8em'}
        return(
            <div style={{display: 'inline-block'}}>
                <span style={{textTransform:'capitalize',fontWeight:'600'}}>{row['titolo']}</span>
                <div>
                    <div>di: {row['autore']}</div>
                    <div style={style}>Data creazione: {new Date(row['data_creazione']).toLocaleDateString("it-IT",{year:"numeric",month:"2-digit", day:"2-digit"})}</div>
                    {User().ruolo=='caporedattore' &&
                        <div style={style}>Data approvazione: {new Date(row['data_approvazione']).toLocaleDateString("it-IT",{year:"numeric",month:"2-digit", day:"2-digit"})}</div>
                    }
                </div>
            </div>
        );
    }
},
{ title: 'Azioni', field:'actions', render: (cell,row,handle) =>
    {
        return(
            <div style={{display: 'inline-block'}}>
                <CheckField
                divClassName="d-inline mr-3"
                name={"id_"+row.id}
                label="ID"
                onChange={(e) => handle(e,'check')}
                />
                <CheckField
                divClassName="d-inline mr-3"
                name={"titolo_"+row.id}
                label="Titolo"
                onChange={(e) => handle(e,'check')}
                />
                <CheckField
                divClassName="d-inline mr-3"
                name={"tempo_preparazione_"+row.id}
                label="Tempo preparazione"
                onChange={(e) => handle(e,'check')}
                />
                <CheckField
                divClassName="d-inline mr-3"
                name={"tempo_cottura_"+row.id}
                label="Tempo cottura"
                onChange={(e) => handle(e,'check')}
                />
                <CheckField
                divClassName="d-inline mr-3"
                name={"intro_"+row.id}
                label="Intro"
                onChange={(e) => handle(e,'check')}
                />
                <CheckField
                divClassName="d-inline mr-3"
                name={"modalita_preparazione_"+row.id}
                label="Modalità preparazione"
                onChange={(e) => handle(e,'check')}
                />
                <CheckField
                divClassName="d-inline mr-3"
                name={"porzioni_"+row.id}
                label="Porzioni"
                onChange={(e) => handle(e,'check')}
                />
                <CheckField
                divClassName="d-inline mr-3"
                name={"calorie_"+row.id}
                label="Calorie"
                onChange={(e) => handle(e,'check')}
                />
                <CheckField
                divClassName="d-inline mr-3"
                name={"difficolta_"+row.id}
                label="Difficoltà"
                onChange={(e) => handle(e,'check')}
                />
                <CheckField
                divClassName="d-inline mr-3"
                name={"tipologia_"+row.id}
                label="Tipologia"
                onChange={(e) => handle(e,'check')}
                />
                <CheckField
                divClassName="d-inline mr-3"
                name={"note_"+row.id}
                label="Note"
                onChange={(e) => handle(e,'check')}
                />
                <CheckField
                divClassName="d-inline mr-3"
                name={"ingredienti_"+row.id}
                label="Ingredienti"
                onChange={(e) => handle(e,'check')}
                />
                <CheckField
                divClassName="d-inline"
                name={"data_creazione_"+row.id}
                label="Data Creazione"
                onChange={(e) => handle(e,'check')}
                />
                <hr/>
                <Button
                className="btn-light"
                onClick={(a) => handle({id:row.id,el:a},'stampa')}
                >
                    Stampa
                </Button>
            </div>
        )
    }
},
].map((a) => { if(a!=null) return a; return false; } );


export default  class Verifiche extends Component {

    constructor(props){
        super(props);

        this.state = {
            rows: '',
            rowsValidate: '',
            rowsScartate: '',
            loader: false,
            show:false,
            reloadInfiniteTable:0,
            fieldPrint:{}
        };

        this.url = this.props.url+'/ricette';
        this._handleSearchFieldCallback = this._handleSearchFieldCallback.bind(this);
        this._handleSearchFieldValidateCallback = this._handleSearchFieldValidateCallback.bind(this);
        this._handleSearchFieldScartateCallback = this._handleSearchFieldScartateCallback.bind(this);

    }

    componentDidMount(){
        //this.getRemoteData();
    }

    getRemoteData(id) {

        let url = this.props.url+'/print-ricetta/'+id;

        let headers = {headers: {'Accept': 'application/json',
            'Content-Type': 'application/json'
            }
        };

        let sendData = {};

        sendData.fields = this.state.fieldPrint[id];
        sendData._token = CSRF_TOKEN;

        //this.setState({loader : true});

        //console.log(sendData);return;

        return axios.post(url,sendData,headers)
        .then(result => {
            let base64 = result.data;
            console.log(base64);

            let linkSource = 'data:application/pdf;base64,'+base64;
            let downloadLink = document.createElement("a");
            let fileName = 'ricetta.pdf';

            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();

            //this.setState({ loader : false});
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
            this.setState({errorRegMessage: msg, loader:false});
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

    _handleSearchFieldValidateCallback(data,reset){

        //console.log(rows);

        let rowsValidate = this.state.rowsValidate;

        rowsValidate = data.data;
        this.setState({rowsValidate});

        if(reset){
            rowsValidate = '';
            this.setState({rowsValidate});
        }

    }

    _handleSearchFieldScartateCallback(data,reset){

        //console.log(rows);

        let rowsScartate = this.state.rowsScartate;

        rowsScartate = data.data;
        this.setState({rowsScartate});

        if(reset){
            rowsScartate = '';
            this.setState({rowsScartate});
        }

    }


    render() {

        let user = User();
        let history = this.props.router.history;

        return (
            <div className="container-fluid pl-3 constraint">

                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <a className="nav-item nav-link active" id="nav-verifiche-tab" data-toggle="tab" href="#nav-verifiche" role="tab" aria-controls="nav-verifiche" aria-selected="true">Verifiche</a>
                        <a className="nav-item nav-link" id="nav-validati-tab" data-toggle="tab" href="#nav-validati" role="tab" aria-controls="nav-validati" aria-selected="false">{(user.ruolo=='caporedattore'?'Approvate':'Validate')}</a>
                        <a className="nav-item nav-link" id="nav-scartate-tab" data-toggle="tab" href="#nav-scartate" role="tab" aria-controls="nav-scartate" aria-selected="false">Scartate</a>
                    </div>
                </nav>

                <div className="tab-content pt-4" id="nav-tabContent">

                    <div className="tab-pane fade show active" id="nav-verifiche" role="tabpanel" aria-labelledby="nav-verifiche-tab">

                        <div className="row mb-3 px-2">

                            <div className="col-md-6">
                                <SearchField showList={false}
                                //patternList={{id:'id',fields:['titolo','cognome']}}
                                url={this.url+'/search'}
                                query='only=verifiche'
                                callback={this._handleSearchFieldCallback}
                                />
                            </div>

                            <div className="col-md-6 text-right">

                            </div>

                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <InfiniteTable
                                    id='tb-ricette'
                                    reload={this.state.reloadInfiniteTable}
                                    url={this.url}
                                    query='only=verifiche'
                                    columns={COLUMNS}
                                    externalRows={this.state.rows}
                                    onClick={(row) =>
                                            history.push(this.props.url+'/verifiche/'+row.id)
                                    }
                                />
                            </div>
                        </div>

                    </div>

                    <div className="tab-pane fade" id="nav-validati" role="tabpanel" aria-labelledby="nav-validati-tab">

                        <div className="row mb-3 px-2">

                            <div className="col-md-6">
                                <SearchField showList={false}
                                url={this.props.url+'/verifiche/search'}
                                callback={this._handleSearchFieldValidateCallback}
                                />
                            </div>

                            <div className="col-md-6 text-right">

                            </div>

                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <InfiniteTable
                                    id='tb-ricette-validate'
                                    reload={this.state.reloadInfiniteTable}
                                    url={this.props.url+'/verifiche'}
                                    query='only=validate'
                                    columns={COLUMNS_VALIDATE}
                                    externalRows={this.state.rowsValidate}
                                    onActions={(element,type) => {

                                        if(type=='stampa'){
                                            let fieldPrint = this.state.fieldPrint;
                                            if(fieldPrint[element.id]!==undefined && fieldPrint[element.id].length>0)
                                                this.getRemoteData(element.id)
                                            //console.log(this.state.fieldPrint[element.id])
                                        }else{
                                            let el = element.target;
                                            let array =  el.name.split('_')
                                            let id = el.name.split('_').slice(-1)[0];
                                            array.pop()
                                            let name = array.join('_')

                                            let fieldPrint = this.state.fieldPrint;

                                            if(!el.checked)
                                                fieldPrint[id] = fieldPrint[id].filter(f => f != name)
                                            else{
                                                if(fieldPrint[id]===undefined) fieldPrint[id] = []
                                                fieldPrint[id].push(name)
                                            }

                                            this.setState({ fieldPrint: fieldPrint})

                                            //console.log(name)

                                        }

                                    }}
                                    //onClick={(row) => history.push(this.props.url+'/verifiche/'+row.id) }
                                />
                            </div>
                        </div>

                    </div>

                    <div className="tab-pane fade" id="nav-scartate" role="tabpanel" aria-labelledby="nav-scartate-tab">

                        <div className="row mb-3 px-2">

                            <div className="col-md-6">
                                <SearchField showList={false}
                                url={this.props.url+'/verifiche/search'}
                                query='only=scartate'
                                callback={this._handleSearchFieldScartateCallback}
                                />
                            </div>

                            <div className="col-md-6 text-right">

                            </div>

                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <InfiniteTable
                                    id='tb-ricette-scartate'
                                    reload={this.state.reloadInfiniteTable}
                                    url={this.props.url+'/verifiche'}
                                    query='only=scartate'
                                    columns={COLUMNS}
                                    externalRows={this.state.rowsScartate}
                                    onClick={(row) =>
                                            history.push(this.props.url+'/verifiche/'+row.id)
                                    }
                                />
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        );
    }
}
