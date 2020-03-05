import React, { Component , Fragment } from 'react';
import {URL_HOME} from '../Env';

import AddEditModal from '../utils/AddEditModal';
import InputField from '../utils/form/InputField';
import INFO_ERROR from '../utils/form/InfoError';

const email_reg_exp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const whitespace_reg_ex = /^[^\s].*/;

const FIELDS = [
    'nome',
    'cognome',
    'matricola',
    'email',
    'password',
    'confirm_password'
];

const HIDE_FIELD = [
    'confirm_password'
]

export default class RedattoriModal extends Component {

    constructor(props){
        super(props);

        let data = {};
        let error = {};

        FIELDS.map((fd,id) => {
            data[fd] = error[fd]= '';
        });

        this.state = {
            data: data,
            error: error,
            checked: false,
            loader:false,
            errorRegMessage:''
        };

        this.home = URL_HOME;

        this._handleChange = this._handleChange.bind(this);
        this._handleOnSave = this._handleOnSave.bind(this);
    }

    _resetAfterClose () {
        let data = {};
        let error = {};

        FIELDS.map((fd,id) => {
            data[fd] = error[fd]= '';
        });

        this.state.data= data;
        this.state.error = error;
        this.state.loader = false;
        this.state.checked = false;
    }

    setRemoteStore() {

        let url = this.props.url+'/redattori';

        let headers = {headers: {'Accept': 'application/json',
            'Content-Type': 'application/json'
            }
        };

        let data = this.state.data;


        let formData = new FormData();

        Object.keys(data).map((k,id) => {
            if(!HIDE_FIELD.includes(k)){
                formData.append(k,data[k]);
            }
        });

        //console.log(FormData);return;

        formData.append('_token',CSRF_TOKEN);

        this.setState({loader:true});

        return axios.post(url,formData,headers)
        .then(result => {
            //console.log(result);

            if(this.props.callback !== undefined)
                this.props.callback(data);
            
            this.props.onHide();
            this._resetAfterClose();

            return result;

        }).catch((error) => {
          console.error(error.response);
          if(error.response!==undefined &&  error.response.status==422)
            this.setState({errorRegMessage: error.response.data.errors,loader:false}); 
          throw error;
        });
    }

    _handleOnSave(){
        console.log("save");
        this.setRemoteStore();
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
            case 'matricola':
                value = value.toUpperCase();
                if(value.length > 1 && !whitespace_reg_ex.test(value))
                    error.matricola = INFO_ERROR['caratteri'];
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
        }

        data[field] = value.trim();

        this.setState({data,error},()  => this.checked());
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

    showError(field){
        let error = this.state.error[field]!== undefined ? this.state.error[field] : '';

        if(error != '')
          return(
            <div className="error-div">{error}</div>
          );
    }

    render(){
        
        let divClassName = 'mb-3';

        let errorRegMessage = this.state.errorRegMessage;


        return(
            <AddEditModal size="md"
                show={this.props.show}
                onHide={(a) => {this.props.onHide(a);this._resetAfterClose();}}
                loader={this.state.loader}
                onConfirm={this._handleOnSave}
                disabledConfirmButton={!this.state.checked}
                error = {this.state.remoteError}
                title="Redattore" type="Nuovo"
            >

                <form>

                    <div className="form-group">
                        <InputField name="nome" divClassName={divClassName} className="form-control" label="Nome"
                        helperText={this.showError('nome')} handleChange={this._handleChange} />
                        <InputField name="cognome" divClassName={divClassName} className="form-control" label="Cognome"
                        helperText={this.showError('cognome')} handleChange={this._handleChange} />
                    </div>
                    
                    <div className="form-group">
                        <InputField name="matricola" divClassName={divClassName} className="form-control" label="Matricola"
                        helperText={this.showError('matricola')} handleChange={this._handleChange} />
                        <InputField name="email" autocomplete='on' className="form-control" label="E-mail"
                        helperText={this.showError('email')} handleChange={this._handleChange} />
                    </div>

                    <div className="form-group">
                        <InputField type="password" name='password' divClassName={divClassName} className="form-control"
                        helperText={this.showError('password')} handleChange={this._handleChange} label="Password" />
                        <InputField type="password" name='confirm_password' divClassName={divClassName} className="form-control"
                        helperText={this.showError('confirm_password')} handleChange={this._handleChange} label="Conferma Password" />
                    </div>

                    { typeof errorRegMessage ==='object' && 
                        <div className="alert alert-danger" role="alert">
                            <strong>Attenzione!</strong>
                            {
                                Object.keys(errorRegMessage).map((a,k1) => <div key={k1}>{errorRegMessage[a].map((s,k2) => <span key={k2}>{s} </span>)}</div>)
                            }
                        </div>
                    }

                </form>
            </AddEditModal>
        );
    }
}
