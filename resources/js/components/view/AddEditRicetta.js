import React, { Component , Fragment } from 'react';
import parse from 'html-react-parser';
import {User} from './../Env';
import {URL_HOME} from '../Env';

import SearchField from '../utils/SearchField';
import InputField from '../utils/form/InputField';
import DataField from '../utils/form/DataField';
import DropDownSelect from '../utils/form/DropdownSelect';
import INFO_ERROR from '../utils/form/InfoError';
import FileField from '../utils/form/FileField';
import { AddButton } from '../utils/Button';

const whitespace_reg_ex = /^[^\s].*/;

const FIELDS = [
    'nome',
    'cognome',
    'email',
    'data_nascita',
    'telefono',
    'cellulare',
    'indirizzo',
    'id_comune',
    'privacy',
    'password',
    'confirm_password'
];

export default class AddEditRicetta extends Component {

    constructor(props){
        super(props);

        let data = {};

        FIELDS.map((fd,id) => {
            data[fd.titolo] = fd.type;
        });

        this.state = {
            data: data,
            error: error,
            checked: false,
            checkedLogin:false,
            loader:false,
            loaderLogin:false,
            confirmedRegMessage:'',
            errorRegMessage:'',
            errorLoginMessage:''
        };

        this.home = URL_HOME;

        this._handleChange = this._handleChange.bind(this);
        this._handleChangeLogin = this._handleChangeLogin.bind(this);
        this._handleOnRegister = this._handleOnRegister.bind(this);
        this._handleOnLogin = this._handleOnLogin.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    componentDidMount(){       
        //console.log(this.props.router.match.params.ricetta)        
    }

    getRemoteData($ricetta){

        let url = this.props.url+'/ricette/'+$ricetta;

        let headers = {headers: {'Accept': 'application/json'}};

        this.setState({loader:true})

        return axios.get(url, headers )
			.then(result => {

                let ricetta = this.state.ricetta;

                let remoteData = result.data;

                ricetta = remoteData.data; 

                //console.log(remoteData);

                this.setState({ ricetta:ricetta, loader:false })

			}).catch((error) => {
                if(error.response===undefined) return;

                let msg ='';
                if(error.response!==undefined)
                    if(error.response.data.errors!==undefined)
                        msg = error.response.data.errors;
                    else if(error.response.data.message!==undefined)
                        msg = error.response.data.message;

                
                this.setState({errorRegMessage: msg, loader:false}); 
                
                throw error;
			});
    }

 
    render() {

        let data = this.state.ricetta;
        let router = this.props.router;
        let history = router.history;
        let url = router.match.url;
        let user = User();

        
        let errorRegMessage = this.state.errorRegMessage;

        //console.log(url)

        return (
            <div className="tab-pane fade px-5 py-3" id="nav-reg" role="tabpanel" aria-labelledby="nav-reg-tab">

                <div className="form-group mb-5 text-center">    
                    <h2>
                        <strong>Registrati</strong>
                    </h2>
                    Inserisci i tuoi dati ed entra nel mondo della Cucina!
                </div>

                <form>

                    <div className="form-group">
                        <InputField name="nome" divClassName={divClassName} className="form-control" placeholder="Nome"
                        helperText={this.showError('nome')} handleChange={this._handleChange} />
                        <InputField name="cognome" divClassName={divClassName} className="form-control" placeholder="Cognome"
                        helperText={this.showError('cognome')} handleChange={this._handleChange} />
                        <DataField name="data_nascita" className="form-control" label="Data di Nascita"
                        helperText={this.showError('data_nascita')} handleChange={this._handleChange} />
                    </div>

                    <div className="form-group">
                        <InputField name="indirizzo" divClassName={divClassName} className="form-control"
                        placeholder="Indirizzo"
                        helperText={this.showError('indirizzo')} handleChange={this._handleChange} />
                        <SearchField
                            label="Comune"
                            placeholder='Cerca un Comune'
                            searchClassName='w-100'
                            showList={true}
                            url={urlComuni}
                            patternList={{id:'id', fields:{nome:[],prov:[]}} }//id di ritorno; i fields vengono usati come titolo
                            reloadOnClick={false}
                            onClick={(val) => {
                                    //console.log(val);
                                    let data = this.state.data;
                                    let error = this.state.error;
                                    data.id_comune = val.id;
                                    error.id_comune = '';
                                    this.setState({data,error},() => this.checked());
                                }
                            }
                            callback={(val) => {
                                    //console.log(val);
                                    let data = this.state.data;
                                    let error = this.state.error;
                                    data.id_comune = '';
                                    if(val.length==0){
                                        error.id_comune = INFO_ERROR['comune'];
                                    }
                                    this.setState({data,error},() => this.checked());
                                }
                            }
                        />
                        {this.showError('id_comune')}
                    </div>

                    <div className="form-group mb-5">                                    
                        <InputField name="telefono" divClassName={divClassName}className="form-control" placeholder="Telefono"
                        helperText={this.showError('telefono')} handleChange={this._handleChange} />
                        <InputField name="cellulare" className="form-control" placeholder="Cellulare"
                        helperText={this.showError('cellulare')} handleChange={this._handleChange} />
                    </div>

                    <div className="form-group mb-5">
                        <InputField name="email" autocomplete='on' divClassName={divClassName} className="form-control" placeholder="E-mail"
                        helperText={this.showError('email')} handleChange={this._handleChange} />
                        <InputField type="password" name='password' divClassName={divClassName} className="form-control"
                        helperText={this.showError('password')} handleChange={this._handleChange} placeholder="Password" />
                        <InputField type="password" name='confirm_password' divClassName={divClassName} className="form-control"
                        helperText={this.showError('confirm_password')} handleChange={this._handleChange} placeholder="Conferma Password" />
                    </div>

                    <div className="form-group mb-5">
                        <FileField name='privacy' divClassName={divClassName} className="form-control"
                        helperText={this.showError('privacy')} handleChange={this._handleChange} label="Privacy" />
                    </div>

                    <div className="form-group">
                        <AddButton
                            disabled={!this.state.checked}
                            onClick={this._handleOnRegister}
                        >
                            CONFERMA REGISTRAZIONE
                            <img className={"loader-2"+(this.state.loader==true?' d-inline-block':'')} src="../img/loader_2.gif"></img>
                        </AddButton>
                    </div> 

                    {this.state.confirmedRegMessage!='' && 
                        <div className="alert alert-success" role="alert">
                            <div>{this.state.confirmedRegMessage}</div>
                            <div>Verrai reindirizzato fra pochi secondi.</div>
                        </div>
                    }

                    { typeof errorRegMessage ==='object' && 
                        <div className="alert alert-danger" role="alert">
                            <strong>Attenzione!</strong>
                            {
                                Object.keys(errorRegMessage).map((a,k1) => <div key={k1}>{errorRegMessage[a].map((s,k2) => <span key={k2}>{s} </span>)}</div>)
                            }
                        </div>
                    }

                </form>
            </div>
        );
    }
}
