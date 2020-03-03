import React, { Component , Fragment } from 'react';
import cx from "classnames";
import {URL_HOME} from '../Env';
import Modal from 'react-bootstrap/Modal';

import AddEditModal from '../utils/AddEditModal';
import SearchField from '../utils/SearchField';
import InputField from '../utils/form/InputField';
import DataField from '../utils/form/DataField';
import DropDownSelect from '../utils/form/DropdownSelect';
import INFO_ERROR from '../utils/form/InfoError';
import FileField from '../utils/form/FileField';
import { AddButton } from '../utils/Button';

const email_reg_exp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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

const HIDE_FIELD = [
    'confirm_password'
]

export default class LoginRegister extends Component {

    constructor(props){
        super(props);

        let data = {};
        let error = {};

        FIELDS.map((fd,id) => {
            data[fd] = error[fd]= '';
        });

        this.state = {
            data: data,
            dataLogin:{email:'',password:''},
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
    }


    _resetAfterClose () {
        let data = {};
        let error = {};

        FIELDS.map((fd,id) => {
            data[fd] = error[fd]= '';
        });
        this.state.data=data;
        this.state.error =error;
        this.state.loader = false;
        this.state.loaderLogin = false;
        this.state.checked = false;
        this.state.checkedLogin = false;
        this.state.confirmedRegMessage = '';
        this.state.errorRegMessage = '';
        this.state.errorLoginMessage = '';
    }

    componentDidUpdate (){       
        if(this.props.externalRow!==undefined)
            this._onOpenModal();
    }

    _onOpenModal(){
        let data = this.state.data;
        let row = this.props.externalRow;

        FIELDS.map((fd,k) => {
            //console.log(data[fd])
            data[fd] = row[fd];
            //row[fd]
        });
    }

    remoteStore() {

        let url = this.props.url+'/register';

        let headers = {headers: {'Accept': 'application/json',
            //'Content-Type': 'application/json'
            //'Content-Type': 'multipart/form-data'
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        let data = this.state.data;

        let formData = new FormData();

        Object.keys(data).map((k,id) => {
            formData.append(k,data[k]);
        });

        formData.append('_token',CSRF_TOKEN);

        this.setState({loader:true});

        return axios.post(url,formData,headers)
        .then(result => {
            
            this.setState({confirmedRegMessage : result.data.registration, loader:false},()=> this._reloadPage());
            
            //console.log(result);return;           
            return result;
        }).catch((error) => {
          if(error===undefined) return;
          
          if(error.response.status==422)
            this.setState({errorRegMessage:error.response.data.errors,loader:false});

          console.error(error.response);
          
          throw error;
        });
    }

    remoteLogin() {

        let url = this.props.url+'/login';

        let headers = {headers: {'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

        let dataLogin = this.state.dataLogin;

        dataLogin._token = CSRF_TOKEN;

        this.setState({loaderLogin:true});

        return axios.post(url,dataLogin,headers)
        .then(result => {
            
            //console.log(result.status);return;
            if(result.status==200)
                location.reload();
            
            return result;
        }).catch((error) => {
          if(error===undefined) return;
          
          if(error.response.status==422)
            this.setState({errorLoginMessage :error.response.data.errors,loaderLogin:false});

          //console.error(error.response);          
          throw error;
        });
    }

    _handleChange(e){
        let value = e.target.value.toLowerCase();
        let field = e.target.name;

        let error = this.state.error;
        let data = this.state.data;

        if(value=='')
            error[field] = INFO_ERROR['vuoto'];
        else
            error[field] = '';

        switch(field){
            case 'nome':
                if( value.length > 1 && !whitespace_reg_ex.test(value))
                    error.nome = INFO_ERROR['caratteri'];
                break;
            case 'cognome':
                if(value.length > 1 && !whitespace_reg_ex.test(value))
                    error.cognome = INFO_ERROR['caratteri'];
                break;            
            case 'indirizzo':
                if(value.length > 1 && !whitespace_reg_ex.test(value))
                    error.indirizzo = INFO_ERROR['caratteri'];
                break;
            case 'telefono':
                if(isNaN(value))
                   error.telefono = INFO_ERROR['numero'];
                break;
            case 'cellulare':
                if(isNaN(value))
                   error.cellulare = INFO_ERROR['numero'];
                break;
            case 'email':
                if(value.length < 8 )
                    error.email = INFO_ERROR['email_1'];
                else if(!email_reg_exp.test(value))
                    error.email = INFO_ERROR['email_2'];
                break;
            case 'password':
                if(value.length > 1 && !whitespace_reg_ex.test(value))
                    error.password = INFO_ERROR['caratteri'];
                else if(value.length > 0 && value.length < 8)
                    error.password = INFO_ERROR['password'];
                else if(this.state.data.confirm_password!='' && value != this.state.data.confirm_password)
                    error.confirm_password = INFO_ERROR['confirm_password'];
                else
                    error.confirm_password = '';
                break;
            case 'confirm_password':
                if(value.length > 1 && !whitespace_reg_ex.test(value))
                    error.confirm_password = INFO_ERROR['caratteri'];
                else if( value.length > 0 && value.length < 8 || value != this.state.data.password)
                    error.confirm_password = INFO_ERROR['confirm_password'];
                break;
            case 'data_nascita':
                let today = new Date();
                today = new Date(today.toDateString()).getTime();
                let date = new Date(value);
                date = new Date(date.toDateString()).getTime();
                if(date > today)
                    error.data_nascita = INFO_ERROR['data'];
                break;
            case 'privacy':
                value = e.target.files[0];
                if(e.target.files.length== 0)
                   error.privacy = INFO_ERROR['file'];
        }

        data[field] = field!='privacy'? value.trim() : value;

        this.setState({data,error},()  => this.checked());
    }

    _handleChangeLogin(e){
        let value = e.target.value
        let field = e.target.name;

        let dataLogin = this.state.dataLogin;
        let checkedLogin = true;

        dataLogin[field] = value;

        if(dataLogin.email=='' || dataLogin.password=='')
            checkedLogin = false;

        this.setState({dataLogin,checkedLogin});        
    }

    checked(){
        let data = this.state.data;
        let error = this.state.error;

        let checked = true;
        Object.keys(error).map((k,id) => {
            if(error[k]!='' || data[k]=='')
                checked = false;
        });

        this.setState({checked});
    }

    _handleOnRegister(){
        console.log("save");
        this.remoteStore();
    }

    _handleOnLogin(){
        this.remoteLogin();
    }

    showError(field){
        let error = this.state.error[field]!== undefined ? this.state.error[field] : '';

        if(error != '')
          return(
            <div className="error-div">{error}</div>
          );
    }

    _reloadPage(){

        setTimeout(function(){
            location.reload();
        },2000);

    }

    render(){

        //let objFid = {'1':'Start - 0%','2':'Plus - 10%','3':'Revolution - 20%'};
        let objFid = {'1':'Start - 0%'};

        let divClassName = 'mb-3';

        let urlComuni = this.props.url+'/comuni/search';
        
        let errorRegMessage = this.state.errorRegMessage;
        let errorLoginMessage = this.state.errorLoginMessage;

        return(
            
            <Modal show={this.props.show} onHide={this.props.onHide} aria-labelledby="contained-modal-title-vcenter"
            size='md' className='login-modal'
            >
                <Modal.Body className='p-0'>

                    <nav>
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                            <a className="nav-item nav-link " id="nav-reg-tab" data-toggle="tab" href="#nav-reg" role="tab" aria-controls="nav-reg" aria-selected="true">Registrati</a>
                            <a className="nav-item nav-link active" id="nav-login-tab" data-toggle="tab" href="#nav-login" role="tab" aria-controls="nav-login" aria-selected="false">Login</a>
                        </div>
                    </nav>

                    <div className="tab-content pt-4" id="nav-tabContent">
                    
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

                        <div className="tab-pane fade show active px-5 py-3" id="nav-login" role="tabpanel" aria-labelledby="nav-login-tab">
                            
                            <div className="form-group mb-5 text-center">    
                                <h2>
                                    <strong>Hai già un profilo?</strong>
                                </h2>
                                Entra nel mondo della Cucina
                            </div>

                            <form>
                                <div className="form-group mb-5">
                                    <InputField name="email" divClassName={divClassName} className="form-control" placeholder="Email"
                                    helperText={this.showError('email')} handleChange={this._handleChangeLogin} />
                                    <InputField name="password" type='password' divClassName={divClassName} className="form-control" placeholder="Password"
                                    helperText={this.showError('password')} handleChange={this._handleChangeLogin} />
                                </div> 

                                <div className="form-group">
                                    <AddButton 
                                        disabled={!this.state.checkedLogin}
                                        onClick={this._handleOnLogin}
                                    >
                                        ACCEDI
                                        <img className={"loader-2"+(this.state.loaderLogin==true?' d-inline-block':'')} src="../img/loader_2.gif"></img>
                                    </AddButton>
                                    {/*&nbsp; <a target='_blank' href={this.props.url+'/password/reset'}>Password dimenticata?</a>*/}
                                </div> 

                                { typeof errorLoginMessage ==='object' && 
                                    <div className="alert alert-danger" role="alert">
                                        <strong>Attenzione!</strong>
                                        {
                                            Object.keys(errorLoginMessage).map((a,k1) => <div key={k1}>{errorLoginMessage[a].map((s,k2) => <span key={k2}>{s} </span>)}</div>)
                                        }
                                    </div>
                                }

                            </form>       

                        </div>

                    </div>
                
                </Modal.Body>

            </Modal>
        );
    }
}
