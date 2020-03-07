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
import { AddButton, Button } from '../utils/Button';
import TextAreaField from '../utils/form/TextAreaField';

import IngredienteModal from '../modal/IngredienteModal';

const whitespace_reg_ex = /^[^\s].*/;

const FIELDS = [
    'titolo',
    'tempo_preparazione',
    'tempo_cottura',
    'intro',
    'modalita_preparazione',
    'porzioni',
    'calorie',
    'difficolta',
    'id_tipologia',
    'id_ingredienti',
    'note',
    'img'
];

export default class AddEditRicetta extends Component {

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
            show: false,
            checked: false,
            loader:false,
            errorRegMessage:''
        };

        this.home = URL_HOME;

        this._handleChange = this._handleChange.bind(this);

        this._handleCloseModal = this._handleCloseModal.bind(this);
        this._handleShowModal = this._handleShowModal.bind(this);
    }

    componentDidMount(){       
        //console.log(this.props.router.match.params.ricetta)        
    }

    _handleCloseModal () {
        this.setState({show : false});
    }
    _handleShowModal (){
        this.setState({show : true});
    }

    setRemoteStore() {

        let url = this.props.url+'/ricette';

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
            console.log(result);

            return result;

        }).catch((error) => {
          console.error(error.response);
          if(error.response!==undefined &&  error.response.data.errors)
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

 
    render() {

        let divClassName = 'mb-3';
        
        let data = this.state.data;
        let router = this.props.router;
        let history = router.history;
        
        let user = User();

        let bread = 'gestione-ricette';
                
        let errorRegMessage = this.state.errorRegMessage;

        let objFid = {'facile':'Facile','media':'Media','difficile':'Difficile'};
        let objFid2 = {1:'Primo',2:'Secondo',3:'Contorno',4:'Dolce',5:'Antipasto'};

        let styleHR = {margin: '35px 0 20px'};
        //console.log(url)
        
        
        return (
            <article className="col-md-12 constraint">
                        
                <ul className="breadcrumbs mb-2">
                    <li><a href="" onClick={(e)=> {e.preventDefault();history.goBack()}}>{bread} <i className="fa fa-angle-right" aria-hidden="true"></i></a></li>
                    <li>nuova ricetta</li>
                </ul>

                <form className="py-5 px-4 bg-light">

                    <div className="form-group mb-0">
                        <InputField label="Titolo" name="titolo" divClassName={divClassName} className="form-control" placeholder="max 50 caratteri"
                        helperText={this.showError('titolo')} handleChange={this._handleChange} />
                        <TextAreaField label="Breve Introduzione" name="intro" divClassName={divClassName} className="form-control" placeholder="max 255 caratteri"
                        helperText={this.showError('intro')} handleChange={this._handleChange} />                        
                    </div>

                    <hr style={styleHR}/>

                    <div className="form-group row mb-0">
                        <DropDownSelect placeholder="Scegli un valore"
                        name="difficolta" className="form-control" divClassName={"col-md-5 "+divClassName} label="Difficoltà"
                        values={objFid}
                        defaultSelected='Scegli un valore'
                        handleChange={this._handleChange} />
                        <DropDownSelect placeholder="Scegli un valore"
                        name="tipologia" className="form-control" divClassName={"col-md-5 "+divClassName} label="Tipologia"
                        values={objFid2}
                        defaultSelected='Scegli un valore'
                        handleChange={this._handleChange} />
                    </div>

                    <hr style={styleHR}/>

                    <div className="form-group row mb-0">                        
                        <InputField label="Tempo Preparazione" name="tempo_preparazione" divClassName={"col-md-5 "+divClassName} className="form-control" placeholder="Tempo preparazione"
                        helperText={this.showError('tempo_preparazione')} handleChange={this._handleChange} />
                        <InputField label="Tempo Cottura" name="tempo_cottura" divClassName={"col-md-5 "+divClassName} className="form-control " placeholder="Tempo cottura"
                        helperText={this.showError('tempo_cottura')} handleChange={this._handleChange} />
                        <InputField label="Porzioni" name="porzioni" divClassName={"col-md-5 "+divClassName} className="form-control " placeholder="Porzioni"
                        helperText={this.showError('porzioni')} handleChange={this._handleChange} />
                        <InputField label="Calorie" name="calorie" divClassName={"col-md-5 "+divClassName} className="form-control " placeholder="Calorie"
                        helperText={this.showError('calorie')} handleChange={this._handleChange} />
                    </div>
                    
                    <hr style={styleHR}/>

                    <div className="form-group mb-0">                        
                        <InputField label="Link immagine" name="img" divClassName={divClassName} className="form-control " placeholder="es: https://.../image.jpg"
                        helperText={this.showError('img')} handleChange={this._handleChange} />                       
                    </div>

                    <hr style={styleHR}/>

                    <div className="form-group mb-5">                        
                        <TextAreaField label="Modalità preparazione" style={{height:'200px'}} name="modalita_preparazione" divClassName={divClassName} className="form-control" placeholder=""
                        helperText={this.showError('modalita_preparazione')} handleChange={this._handleChange} />                        
                    </div>

                    <hr style={styleHR}/>

                    <div className="form-group mb-0 row">     
                        <div className="md-col-4 pl-3 pr-2">                   
                            <SearchField
                                label="Ingredienti"
                                placeholder='Cerca un Ingrediente'
                                searchClassName='w-100'
                                showList={true}
                                url={this.props.url+'/ingredienti/search'}
                                patternList={{id:'id', fields:{titolo:[]}} }//id di ritorno; i fields vengono usati come titolo
                                reloadOnClick={false}
                                resetAfterClick={true}                                
                                onClick={(val) => {
                                        console.log(val);
                                        let data = this.state.data;
                                        let error = this.state.error;
                                        //data.id_comune = val.id;
                                        //error.id_comune = '';
                                        //this.setState({data,error},() => this.checked());
                                    }
                                }
                                callback={(val) => {
                                        //console.log(val);
                                        let data = this.state.data;
                                        let error = this.state.error;
                                        //data.id_comune = '';
                                        if(val.length==0){
                                            //error.id_comune = INFO_ERROR['comune'];
                                        }
                                        //this.setState({data,error},() => this.checked());
                                    }
                                }
                            />
                            {this.showError('id_ingredienti')}
                        </div>
                        <div className="col-md-8 " style={{paddingTop:'34px'}}>
                            <span className="mr-4">Se non trovi un ingrediente, crealo!</span>

                            <Button
                                className='btn-primary'
                                onClick={this._handleShowModal}
                            >
                                <i className="fa fa-plus-circle" aria-hidden="true"></i>
                                &nbsp;Nuovo Ingrediente
                            </Button>

                            <IngredienteModal url={this.props.url}
                                show={this.state.show} onHide={this._handleCloseModal}
                                callback={
                                    (row) => {
                                        //this.setState({reloadInfiniteTable:++(this.state.reloadInfiniteTable)});
                                    }
                                } 
                            />
                        </div>
                    </div>
                    
                    <hr style={styleHR}/>

                    <div className="form-group mb-5">                        
                        <TextAreaField label="Note" name="note" divClassName={divClassName} className="form-control" placeholder="max 255 caratteri"
                        helperText={this.showError('note')} handleChange={this._handleChange} />                        
                    </div>
                    
                    <div className="form-group mb-5 text-right">
                        <Button
                            className="btn-warning mr-3"
                            disabled={!this.state.checked}
                            //onClick={this._handleOnRegister}
                        >
                            SALVA COME BOZZA
                            <img className={"loader-2"+(this.state.loader==true?' d-inline-block':'')} src="../img/loader_2.gif"></img>
                        </Button>

                        <AddButton
                            className=""
                            disabled={!this.state.checked}
                            //onClick={this._handleOnRegister}
                        >
                            INVIA RICETTA
                            <img className={"loader-2"+(this.state.loader==true?' d-inline-block':'')} src="../img/loader_2.gif"></img>
                        </AddButton>

                    </div> 

                    {this.state.confirmedRegMessage!='' && 
                        <div className="alert alert-success" role="alert">
                            <div>{this.state.confirmedRegMessage}</div>
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

            </article>
        );
    }
}
