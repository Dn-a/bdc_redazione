import React, { Component , Fragment } from 'react';
import {URL_HOME} from '../Env';

import AddEditModal from '../utils/AddEditModal';
import InputField from '../utils/form/InputField';
import INFO_ERROR from '../utils/form/InfoError';

const email_reg_exp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const whitespace_reg_ex = /^[^\s].*/;

const FIELDS = [
    'titolo',
    'calorie',
    'unita_misura',
    'img'
];

const HIDE_FIELD = [    
]

export default class IngredienteModal extends Component {

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

        let url = this.props.url+'/ingredienti';

        let headers = {headers: {'Accept': 'application/json',
            'Content-Type': 'application/json'
            }
        };

        let data = this.state.data;

        data['_token'] = CSRF_TOKEN;
        
        //console.log(data);return;
        
        this.setState({loader:true});

        return axios.post(url,data,headers)
        .then(result => {
            //console.log(result);

            if(this.props.callback !== undefined)
                this.props.callback(data);
            
            this.props.onHide();
            this._resetAfterClose();

            return result;

        }).catch((error) => {
            console.error(error.response);

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

    _handleOnSave(){
        console.log("save");
        this.setRemoteStore();
    }

    _handleChange(e){
        let value = e.target.value;
        let field = e.target.name;


        let error = this.state.error;
        let data = this.state.data;

        if(value=='')
            error[field] = INFO_ERROR['vuoto'];
        else
            error[field] = '';

        switch(field){
            case 'titolo':
                if( value.length > 0 && !whitespace_reg_ex.test(value))
                    error.titolo = INFO_ERROR['caratteri'];
                break;
            case 'calorie':
                if(isNaN(value) ||  !whitespace_reg_ex.test(value))
                   error.calorie = INFO_ERROR['numero'];
                break;
            case 'unita_misura':
                value = value.toLowerCase();
                if( value.length > 0 && !whitespace_reg_ex.test(value))
                    error.unita_misura = INFO_ERROR['caratteri'];
                break;
            case 'img':
                if( value.length > 0 && !whitespace_reg_ex.test(value))
                    error.img = INFO_ERROR['caratteri'];                
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
                url={this.props.url}
                onHide={(a) => {this.props.onHide(a);this._resetAfterClose();}}
                loader={this.state.loader}
                onConfirm={this._handleOnSave}
                disabledConfirmButton={!this.state.checked}
                error = {this.state.remoteError}
                title="Ingrediente" type="Nuovo"
            >

                <form>

                    <div className="form-group">
                        <InputField name="titolo" divClassName={divClassName} className="form-control" label="Titolo"
                        placeholder="max 50 caratteri"
                        helperText={this.showError('titolo')} handleChange={this._handleChange} />
                        <InputField name="calorie" divClassName={divClassName} className="form-control" label="Calorie (kcal) - x 100 grammi"
                        helperText={this.showError('calorie')} handleChange={this._handleChange} />
                    </div>
                    
                    <div className="form-group">
                        <InputField name="unita_misura" divClassName={divClassName} className="form-control" label="Unità di misura"
                        helperText={this.showError('unita_misura')} handleChange={this._handleChange} />                        
                    </div>

                    <div className="form-group">
                        <InputField name="img" autocomplete='on' className="form-control" label="Link Immagine"
                        helperText={this.showError('img')} handleChange={this._handleChange} />
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
