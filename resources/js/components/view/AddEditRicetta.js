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
const url_reg_ex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

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
    'ingredienti',
    'note',
    'img'
];

const LOWER_CASE = [
    'difficolta'
]

export default class AddEditRicetta extends Component {

    constructor(props){
        super(props);

        let data = {};
        let error = {};

        FIELDS.map((fd,id) => {
            if(fd=='ingredienti'){
                data[fd] = {
                    titolo:[],
                    unita_misura:[],
                    id:[],
                    quantita:[]
                };
                error[fd]= {};
            }else{
                data[fd] = '';
                error[fd]= '';
            }
        });

        this.state = {
            data: data,
            error: error,
            fase:'bozza',
            show: false,
            checked: false,
            loader:false,
            errorRegMessage:'',
            confirmMessage:''
        };

        this.home = URL_HOME;

        this._handleChange = this._handleChange.bind(this);

        this.isEdit = false;
        this.idRicettaEdit = -1;

        this._handleCloseModal = this._handleCloseModal.bind(this);
        this._handleShowModal = this._handleShowModal.bind(this);
        this._handleOnSubmit = this._handleOnSubmit.bind(this);
    }

    componentDidMount(){
        let match = this.props.router.match;
        let id = match.params.ricetta;
        let isEdit = match.url.includes('edit');
        this.isEdit = isEdit;
        this.idRicettaEdit = id;
        //console.log(id); console.log(edit);

        if(isEdit && !isNaN(id) && id!=0 ) this.getRemoteData(id);

    }

    _handleCloseModal () {
        this.setState({show : false});
    }
    _handleShowModal (){
        this.setState({show : true});
    }

    getRemoteData($id){

        let url = this.props.url+'/ricette/'+$id;

        let headers = {headers: {'Accept': 'application/json'}};

        //this.setState({loader:true})

        return axios.get(url, headers )
			.then(res => {
                
                let data = this.state.data;              
                let error = this.state.error;              
                let remoteData = res.data.data;
                
                //console.log(remoteData);

                FIELDS.map((f,key) => {
                    if(f=='ingredienti'){
                        //console.log(remoteData[f]);return;
                        remoteData[f].map((i,k) => {
                            error.ingredienti['ingrediente_'+k] = '';
                            data[f].id[k] = i.id;
                            data[f].titolo[k] = i.titolo;
                            data[f].quantita[k] = i.quantita;
                            data[f].unita_misura[k] = i.unita_misura;
                        })
                    }
                    else if(f=='id_tipologia')
                        data[f] = remoteData['tipologia'].id;
                    else
                        data[f] = remoteData[f]==null?'':remoteData[f];
                });
                                
                //console.log(remoteData); 
                //console.log(data);
                
                this.setState({data: data, fase: remoteData.fase}, () => this.checked());

                return res;
			}).catch((error) => {
                if(error.response===undefined) return;
                if(error.response.data!==undefined)
                    console.log(error.response.data);
                else
                    console.log(error.response);
                throw error;
			});
    }

    setRemoteData(type) {
        
        let url = this.props.url+'/ricette';

        let headers = {headers: {'Accept': 'application/json',
            'Content-Type': 'application/json'
            }
        };


        let data = this.state.data;
        let sendData = {};

        FIELDS.map((f,k) => {
            if(f=='ingredienti')
                sendData[f] = data[f]
            else 
                if(typeof data[f] === 'string')
                    sendData[f] = LOWER_CASE.includes(f) ?  data[f].trim().toLowerCase() : data[f].trim();                
                else
                    sendData[f] = data[f]
        });

        //let sendData = JSON.parse(JSON.stringify(data));

        sendData._token = CSRF_TOKEN;        
        sendData.fase = type=='inviata'? 'inviata':'bozza';        
        sendData.id_ingredienti = data.ingredienti.id;
        sendData.quantita_ingrediente = data.ingredienti.quantita;

        delete sendData.ingredienti;


        if(this.isEdit){
            url += '/'+ this.idRicettaEdit;
            sendData._method = 'put';
        }

        //console.log(sendData);return;

        this.setState({loader:true});

        return axios.post(url,sendData,headers)
        .then(result => {
            //console.log(result);

            let msg = result.data.insert;
            this.setState({ confirmMessage:msg, loader:false});
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

    _handleOnSubmit(type){
        console.log("save");
        this.setRemoteData(type);
    }

    _handleChange(e,id){
        let value = e.target.value;
        let field = e.target.name;


        let error = this.state.error;
        let data = this.state.data;

        if(value==''){
            if(id!=null) 
                error.ingredienti['ingrediente_'+id]= INFO_ERROR['vuoto'];
            else
                error[field] = INFO_ERROR['vuoto'];
        }else{
            if(id!=null) 
                error.ingredienti['ingrediente_'+id]= '';            
            else
                error[field] = '';
        }

        switch(field){
            case 'titolo':
                if( value.length > 0 && !whitespace_reg_ex.test(value))
                    error.titolo = INFO_ERROR['caratteri'];
                else if(value.length > 50)
                    error.titolo = INFO_ERROR['limite_caratteri'];
                break;
            case 'intro':
                if(value.length > 0 && !whitespace_reg_ex.test(value))
                    error.intro = INFO_ERROR['caratteri'];
                else if(value.length > 255)
                    error.intro = INFO_ERROR['limite_caratteri'];
                break;
            case 'tempo_preparazione':
                if(isNaN(value) || (value.length > 0 && !whitespace_reg_ex.test(value)))
                   error.tempo_preparazione = INFO_ERROR['numero'];
                break;
            case 'tempo_cottura':
                if(isNaN(value) || (value.length > 0 && !whitespace_reg_ex.test(value)))
                    error.tempo_cottura = INFO_ERROR['numero'];
                break;
            case 'porzioni':
                if(isNaN(value) || (value.length > 0 && !whitespace_reg_ex.test(value)))
                    error.porzioni = INFO_ERROR['numero'];
                break;
            case 'calorie':
                if(isNaN(value) || (value.length > 0 && !whitespace_reg_ex.test(value)))
                    error.calorie = INFO_ERROR['numero'];
                break;
            case 'img':
                if(value.length > 0 && !whitespace_reg_ex.test(value))
                    error.img = INFO_ERROR['caratteri'];
                else if(value.length > 2048)
                    error.img = INFO_ERROR['limite_caratteri'];
                else if(!url_reg_ex.test(value))
                    error.img = INFO_ERROR['img'];                
                break;
            case 'modalita_preparazione':
                if(value.length > 0 && !whitespace_reg_ex.test(value))
                    error.modalita_preparazione = INFO_ERROR['caratteri'];
                else if(value.length > 1024)
                    error.modalita_preparazione = INFO_ERROR['limite_caratteri'];
                break;
            case 'ingrediente_'+id:
                if(isNaN(value) || (value.length > 0 && !whitespace_reg_ex.test(value)))
                    error.ingredienti['ingrediente_'+id] = INFO_ERROR['numero'];
                break;
            case 'note':
                if(value.length > 0 && !whitespace_reg_ex.test(value))
                    error.note = INFO_ERROR['caratteri'];
                else if(value.length > 255)
                    error.note = INFO_ERROR['limite_caratteri'];
                break;
        }
        
        if(id!=null) 
            data.ingredienti.quantita[id] = value;
        else
            data[field] = value;

        this.state.data = data;
        this.state.error = error;
        
        this.checked()

        //this.setState({data,error},()  => this.checked());
    }

    checked(){
        let data = this.state.data;
        let error = this.state.error;

        let checked = true;
        Object.keys(error).map((key,id) => {
            //console.log(key)
            //console.log(data[key])
            if(key=='ingredienti'){
                if(typeof error[key] === 'object'){
                    let obj = Object.keys(error[key]);
                    if(obj.length==0)
                        checked = false;
                    else                
                        Object.keys(error[key]).some((k2,id2) => {                        
                            if(error[key][k2]!='' || data.ingredienti.quantita[id2]==0 
                            || data.ingredienti.quantita[id2]=='' || data.ingredienti.quantita[id2]==null ){                                
                                checked = false;
                                return true;
                            }
                        });
                }
            }else if(error[key]!='' || data[key]=='' || data[key]==null)
                checked = false;
        });

        //console.log(checked);
        this.setState({checked});
    }

    showError(field,id){
        let error = this.state.error[field]!== undefined ? this.state.error[field] : '';
        
        if(id===undefined && field=='ingredienti' && Object.keys(error).length == 0)
            error = INFO_ERROR['ingredienti'];
        else if(typeof error ==='object' && Object.keys(error).length > 0)
            error = error['ingrediente_'+id];

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

        let breadcrumbs = 'gestione-ricette';
                
        let errorRegMessage = this.state.errorRegMessage;

        let objFid = {'facile':'Facile','media':'Media','difficile':'Difficile'};
        let objFid2 = {1:'Primo',2:'Secondo',3:'Contorno',4:'Dolce',5:'Antipasto'};

        let styleHR = {margin: '35px 0 20px'};
        
        //console.log(data.ingredienti)        
        
        return (
            <article className="col-md-12 constraint">
                        
                <ul className="breadcrumbs mb-2">
                    <li><a href="" onClick={(e)=> {e.preventDefault();history.push(this.props.url+'/gestione-ricette')}}>{breadcrumbs} <i className="fa fa-angle-right" aria-hidden="true"></i></a></li>
                    <li>{this.isEdit? 'modifica ricetta' : 'nuova ricetta'}</li>
                </ul>

                <form className="py-5 px-4 bg-light">

                    <div className="form-group mb-0">
                        <InputField label="Titolo" name="titolo" divClassName={divClassName} className="form-control" placeholder="max 50 caratteri"
                        value={data.titolo} helperText={this.showError('titolo')} handleChange={this._handleChange} />
                        <TextAreaField label="Breve Introduzione" name="intro" divClassName={divClassName} className="form-control" placeholder="max 255 caratteri"
                        value={data.intro} helperText={this.showError('intro')} handleChange={this._handleChange} />                        
                    </div>

                    <hr style={styleHR}/>

                    <div className="form-group row mb-0">
                        <DropDownSelect placeholder="Scegli un valore"
                        name="difficolta" className="form-control" divClassName={"col-md-5 "+divClassName} label="Difficoltà"
                        values={objFid}
                        selected={data.difficolta!='' ? data.difficolta:'Scegli un valore'}
                        //defaultSelected='Scegli un valore'
                        handleChange={this._handleChange} />
                        <DropDownSelect placeholder="Scegli un valore"
                        name="id_tipologia" className="form-control" divClassName={"col-md-5 "+divClassName} label="Tipologia"
                        values={objFid2}
                        selected={data.id_tipologia!='' ? data.id_tipologia:'Scegli un valore'}
                        //defaultSelected='Scegli un valore'
                        handleChange={this._handleChange} />
                    </div>

                    <hr style={styleHR}/>

                    <div className="form-group row mb-0">                        
                        <InputField label="Tempo Preparazione" name="tempo_preparazione" divClassName={"col-md-5 "+divClassName} className="form-control" placeholder="Tempo preparazione (min)"
                        value={data.tempo_preparazione} helperText={this.showError('tempo_preparazione')} handleChange={this._handleChange} />
                        <InputField label="Tempo Cottura" name="tempo_cottura" divClassName={"col-md-5 "+divClassName} className="form-control " placeholder="Tempo cottura (min)"
                        value={data.tempo_cottura} helperText={this.showError('tempo_cottura')} handleChange={this._handleChange} />
                        <InputField label="Porzioni" name="porzioni" divClassName={"col-md-5 "+divClassName} className="form-control " placeholder="Porzioni"
                        value={data.porzioni} helperText={this.showError('porzioni')} handleChange={this._handleChange} />
                        <InputField label="Calorie" name="calorie" divClassName={"col-md-5 "+divClassName} className="form-control " placeholder="Kcal"
                        value={data.calorie} helperText={this.showError('calorie')} handleChange={this._handleChange} />
                    </div>
                    
                    <hr style={styleHR}/>

                    <div className="form-group mb-0">                        
                        <InputField label="Link immagine" name="img" divClassName={divClassName} className="form-control " placeholder="es: https://www.images.com/image.jpg"
                        value={data.img} helperText={this.showError('img')} handleChange={this._handleChange} />                       
                    </div>

                    <hr style={styleHR}/>

                    <div className="form-group mb-5">                        
                        <TextAreaField label="Modalità preparazione" style={{height:'200px'}} name="modalita_preparazione" divClassName={divClassName} className="form-control" placeholder=""
                        value={data.modalita_preparazione} helperText={this.showError('modalita_preparazione')} handleChange={this._handleChange} />                        
                    </div>

                    <hr style={styleHR}/>

                    <div className="form-group mb-0 row">

                        <div className="md-col-4 pl-3 pr-2">                   
                            <SearchField
                                label="Ingredienti"
                                placeholder='Cerca e aggiungi un Ingrediente'
                                searchClassName='w-100'
                                showList={true}
                                url={this.props.url+'/ingredienti/search'}
                                patternList={{id:'id', fields:{titolo:[],calorie:[]}} }//id di ritorno; i fields vengono usati come titolo
                                reloadOnClick={false}
                                resetAfterClick={true}                                
                                onClick={(val) => {

                                        let data = this.state.data;
                                        let error = this.state.error;

                                        data.ingredienti.id.push(val.id)
                                        data.ingredienti.titolo.push(val.titolo)
                                        data.ingredienti.unita_misura.push(val.unita_misura)
                                        data.ingredienti.quantita.push(0)
                                        
                                        let id = Object.keys(error.ingredienti).length;                                        
                                        error.ingredienti['ingrediente_'+id] = '';                                        

                                        this.state.data = data;
                                        this.state.error = error;
                                        
                                        this.checked();

                                        //this.setState({data,error},() => this.checked());
                                    }
                                }
                            />
                            {this.showError('ingredienti')}
                        </div>

                        <div className="col-md-8 mb-5" style={{paddingTop:'34px'}}>
                            <span className="mr-4">Se non trovi un ingrediente, crealo!</span>

                            <Button
                                className='btn-light'
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

                        <div className="ml-3">
                            <ul>
                                {
                                    data.ingredienti.id.map((id,key) => {
                                        //console.log(key); return;
                                        let titolo = data.ingredienti.titolo[key];
                                        let unita = data.ingredienti.unita_misura[key];
                                        let quantita = data.ingredienti.quantita[key];
                                        let cnt = key+1;
                                        //console.log(cnt); return;
                                        return(
                                            <li key={key} className="mb-3">
                                                <span>{cnt}.</span>
                                                <InputField  
                                                name={"ingrediente_"+key}
                                                value={quantita}
                                                placeholder='quantità'
                                                divClassName="d-inline-block ml-3 mr-1 px-1 col-sm-3"
                                                className=" form-control d-inline"
                                                helperText={this.showError("ingredienti",key)} 
                                                handleChange={(e) => this._handleChange(e,key)}
                                                />
                                                <span style={{color:'#aaa'}} className="mr-3">{unita}</span>&nbsp;  
                                                <span>{titolo.charAt(0).toUpperCase()+titolo.slice(1)}</span>
                                                <div 
                                                className="btn-clear d-inline-block ml-3 p-1"
                                                onClick={(a) => {

                                                    let data = this.state.data;
                                                    let error = this.state.error;
                                                    
                                                    data.ingredienti.id.splice(key,1);
                                                    data.ingredienti.titolo.splice(key,1);
                                                    data.ingredienti.unita_misura.splice(key,1);
                                                    data.ingredienti.quantita.splice(key,1);
                                                    
                                                    delete error.ingredienti['ingrediente_'+key];

                                                    //console.log(error.ingredienti)
                                                    this.state.data = data;
                                                    this.state.error = error;
                                                    
                                                    this.checked();

                                                }}   
                                                ><i className="fa fa-times" aria-hidden="true"></i></div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>

                    </div>
                    
                    <hr style={styleHR}/>

                    <div className="form-group mb-5">                        
                        <TextAreaField label="Note" name="note" divClassName={divClassName} className="form-control" placeholder="max 255 caratteri"
                        value={data.note} helperText={this.showError('note')} handleChange={this._handleChange} />                        
                    </div>
                    
                    <div className="form-group mb-5 text-right">

                        <Button 
                            className="btn-light mr-3"
                            onClick={(e) => history.goBack()}
                        >
                            INDIETRO            
                        </Button>

                        {this.state.fase=='bozza' && 
                            <Button
                            className="btn-warning mr-3"
                            disabled={this.state.data.titolo=='' || this.state.error.titolo!=''}
                            onClick={(e) => this._handleOnSubmit('bozza')}
                            >
                                {this.isEdit?'AGGIORNA BOZZA':'SALVA COME BOZZA'}
                                <img className={"loader-2"+(this.state.loader==true?' d-inline-block':'')} src={this.props.url+"/img/loader_2.gif"}></img>
                            </Button>
                        }

                        <AddButton
                            className=""
                            disabled={!this.state.checked}
                            onClick={() => this._handleOnSubmit('inviata')}
                        >
                            {this.isEdit && this.state.fase!='bozza'?'AGGIORNA RICETTA':'INVIA RICETTA'}
                            <img className={"loader-2"+(this.state.loader==true?' d-inline-block':'')} src={this.props.url+"/img/loader_2.gif"}></img>
                        </AddButton>

                    </div> 

                    {this.state.confirmMessage!='' && 
                        <div className="alert alert-success" role="alert">
                            <div>{this.state.confirmMessage}</div>
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
