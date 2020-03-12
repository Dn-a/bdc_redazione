import React, { Component , Fragment } from 'react';
import parse from 'html-react-parser';
import { EditButton, ConfirmButton } from '../utils/Button';
import CheckField from './../utils/form/CheckField';
import {User} from './../Env';

const FIELDS = [
    {titolo: 'titolo', type: ''},
    {titolo: 'tempo_cottura', type: 0},
    {titolo: 'tempo_preparazione', type: 0},
    {titolo: 'intro', type: ''},
    {titolo: 'modalita_preparazione', type: ''},
    {titolo: 'porzioni', type: 0},
    {titolo: 'ingredienti', type: [] },
    {titolo: 'calorie', type:0},
    {titolo: 'difficolta', type:0},
    {titolo: 'fase', type:''},
    {titolo: 'autore', type:''},
    {titolo: 'tipologia', type:{}},
    {titolo: 'img', type:''},
    {titolo: 'data_creazione', type:'0000-00-00'}
];

export default class Ricetta extends Component {

    constructor(props){
        super(props);

        let data = {};

        FIELDS.map((fd,id) => {
            data[fd.titolo] = fd.type;
        });

        this.state = {
            ricetta: data,
            loader: false,
            verificationLoader: false,
            errorRegMessage:'',
            validationMessage:''
        };

        this.setRemoteData = this.setRemoteData.bind(this);
    }

    componentDidMount(){       
        //console.log(this.props.router.match.params.ricetta)
        let ricetta = this.props.router.match.params.ricetta;
        this.getRemoteData(ricetta);
    }

    getRemoteData(id){

        let url = this.props.url+'/ricette/'+id;

        let headers = {headers: {'Accept': 'application/json'}};

        this.setState({loader:true})

        return axios.get(url, headers )
			.then(result => {

                let ricetta = this.state.ricetta;
                let remoteData = result.data;

                ricetta = remoteData.data; 

                //console.log(remoteData);

                this.setState({ ricetta: ricetta, loader:false })

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

    setRemoteData(id,verifica) {
        
        let url = this.props.url+'/ricette/verifica/'+id;

        let headers = {headers: {'Accept': 'application/json',
            'Content-Type': 'application/json'
            }
        };

        let sendData = {};

        sendData.fase = verifica;
        sendData._method = 'put';
        sendData._token = CSRF_TOKEN;

        this.setState({verificationLoader:true});

        //console.log(sendData);return;

        return axios.post(url,sendData,headers)
        .then(result => {
            //console.log(result);

            let ricetta = this.state.ricetta;

            ricetta.fase = result.data.fase;
            let msg = ricetta.fase=='idonea' ? 'Ricetta Validata!' : 'Ricetta Approvata!';
            this.setState({ ricetta : ricetta , validationMessage:msg , verificationLoader : false});
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

 
    render() {

        let data = this.state.ricetta;
        let router = this.props.router;
        let history = router.history;
        let url = router.match.url;
        let user = User();

        let bread = 'home';
        if(url.includes('blog'))
            bread = 'blog';
        else if(url.includes('gestione-ricette'))
            bread = 'gestione ricette';
        else if(url.includes('verifiche'))
            bread = 'verifiche';
        
        let errorRegMessage = this.state.errorRegMessage;
        
        return (
            <Fragment>
                {errorRegMessage!=''? 
                    <p>{errorRegMessage}</p>
                :
                    <div className="row constraint article">

                        {this.state.loader?
                            (<div className="col-md-8 text-center"><div className="img-loader active"><img src={this.props.url+'/img/loader.gif'} /></div></div>)
                        :
                            (<article className="col-md-8 pr-4">
                        
                                <ul className="breadcrumbs">
                                    <li>
                                        <a href="" onClick={
                                                (e) => {
                                                    e.preventDefault();
                                                    let dir = '';
                                                    if(bread=='gestione ricette')
                                                        dir = '/gestione-ricette';
                                                    else if(bread=='verifiche')
                                                        dir = '/verifiche';
                                                    history.push(this.props.url + dir)
                                                    //history.goBack()}
                                                }
                                            }
                                        >
                                            {bread} <i className="fa fa-angle-right" aria-hidden="true"></i>
                                        </a>
                                    </li>
                                    <li>Ricetta</li>
                                </ul>

                                <h1 className="font-weight-bold mb-4">{data.titolo}</h1>

                                <div className="row mb-3 content">
                                    <div className="col-sm-4 info">
                                        <div className="pl-2">
                                            <i className="fa fa-user-circle" aria-hidden="true"></i>
                                        </div>
                                        <div >
                                            <div className="title"><strong>Autore</strong></div>
                                            <div>{data.autore}</div>
                                        </div>                                        
                                    </div>
                                    <div className="col-sm-4 info">
                                        <div className="pl-2">
                                        <i className="fa fa-folder-open-o" aria-hidden="true"></i>
                                        </div>
                                        <div >
                                            <div className="title"><strong>Tipologia</strong></div>
                                            <div>{data.tipologia.titolo}</div>
                                        </div>                                        
                                    </div>
                                    <div className="col-sm-4 info">
                                        <div className="pl-2">
                                            <i className="fa fa-thumbs-o-up" aria-hidden="true"> </i>
                                        </div>
                                        <div >
                                            <div className="title"><strong>Difficoltà</strong></div>
                                            <div>{data.difficolta}</div>
                                        </div>                                        
                                    </div>                                
                                </div>

                                <div className="content">
                                    <div className="intro mb-3">{parse(data.intro)}</div>
                                    <div className="image mb-4">
                                        <img src={data.img} />
                                    </div>
                                    <div className="row mb-3 " >
                                        <div className="col-sm-4 info px-4 pl-5">
                                            <div className="">
                                                <i className="fa fa-cutlery" aria-hidden="true"></i>
                                            </div>
                                            <div >
                                                <div className="title"><strong>porzioni</strong></div>
                                                <div>{data.porzioni}</div>
                                            </div>                                        
                                        </div>
                                        <div className="col-sm-4 info px-3">
                                            <div className="">
                                                <i className="fa fa-clock-o" aria-hidden="true"></i>
                                            </div>
                                            <div >
                                                <div className="title"><strong>preparazione</strong></div>
                                                <div>{data.tempo_preparazione} min</div>
                                            </div>                                        
                                        </div>
                                        <div className="col-sm-4 info px-4">
                                            <div className="">
                                            <i className="fa fa-clock-o" aria-hidden="true"></i>
                                            </div>
                                            <div >
                                                <div className="title"><strong>cottura</strong></div>
                                                <div>{data.tempo_cottura} min</div>
                                            </div>                                        
                                        </div>
                                    </div>
                                    <div>
                                        <ul>
                                            {data.ingredienti.map((i,k) => {
                                                return(
                                                    <div key={k} 
                                                    //className="form-control"
                                                    >
                                                        <CheckField 
                                                            name={'ingrediente_'+k}
                                                            //className="custom-control custom-checkbox"
                                                            label={
                                                                <Fragment>
                                                                    {i.quantita+ '  ' + i.unita_misura + ' di '}
                                                                    <strong> &nbsp;{i.titolo}</strong>
                                                                </Fragment>
                                                            }
                                                        />
                                                    </div>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                    <div>
                                        <p>
                                            {
                                                parse(data.modalita_preparazione)
                                            }
                                        </p>
                                    </div>
                                </div>
                                
                                {(
                                    user.ruolo=='redattore' && data.fase=='validazione' || 
                                    user.ruolo=='caporedattore' && data.fase=='approvazione'
                                ) 
                                &&
                                    <Validazione state={this.state} onClick={this.setRemoteData} user={user} url={this.props.url} className="my-3"/>
                                }

                                {this.state.validationMessage!='' && 
                                    <div className="alert alert-success" role="alert">
                                        <div>{this.state.validationMessage}</div>
                                    </div>
                                }

                            </article>)
                        }   
                        
                        <aside className="col-md-4 ">
                            {bread=='gestione ricette' || bread=='verifiche'?
                                <Impostazioni user={user} data={data} url={this.props.url} router={this.props.router} />
                            :
                                <ValoriNutrizionali data={data} />
                            }
                        </aside>
                    </div>
                }
            </Fragment>
        );
    }
}

const Validazione = (props) => {

    let style = {backgroundColor:'#67de25 !important'};

    let fase = props.user.ruolo=='redattore' ? 'idonea' : 'approvata';
    let classValid = props.user.ruolo=='redattore' ? 'validazione ': '';
    return(
        <div >
            <ConfirmButton 
            //style={style}
            className={"w-100 "+ classValid + props.className}
            onClick={(a) => props.onClick(props.state.ricetta.id,fase)
            }
            >
                { props.user.ruolo=='redattore' ? 'Valida' : 'Approva'}
                <img className={"loader-2"+(props.state.verificationLoader==true?' d-inline-block':'')} src={props.url+"/img/loader_2.gif"}></img>
            </ConfirmButton>
        </div>
    )
}

const Impostazioni = (props) => {
    let data = props.data;
    let user = props.user;
    
    let history = props.router.history;
    let idRicetta = props.router.match.params.ricetta;

    let stati = ['inviata','validazione','idonea','scartata','approvazione','approvata'];
    
    return(
        <div className="gestione p-4">
            <h3 className="mb-3"><strong>Impostazioni</strong></h3>
            
            {user.ruolo=='autore' &&
                <Fragment>
                    <EditButton className="w-100"
                    onClick={(a) => history.push(props.url+'/gestione-ricette/'+idRicetta+'/edit')}
                    disabled={data.fase!='bozza' && data.fase!='inviata'}
                    >
                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                    &nbsp;Modifica</EditButton>

                    {(data.fase!='bozza' && data.fase!='inviata') && <div className="error-div">non puoi effettuare modifiche</div>}
                </Fragment>
            }
            
            <div className="my-4" >
                <div><strong>Fase</strong></div>
                <hr className="mt-1 mb-4" />
                <div className="row">
                    {
                        stati.map((st,key) => {
                            return(
                                <div key={key} 
                                    className={st+" stato col-md-6 mb-2 text-center "+(st==data.fase?'active':'')}
                                >
                                    <div className=" p-2">{st}</div>
                                </div>
                            )        
                        })

                    }                                            
                </div>
            </div>      

        </div>
    )
}

const ValoriNutrizionali = (props) => {
    let data = props.data;
    return(
        <div className="blog border border-dark p-4">                                
            <h3 className="mb-3 "><strong>Valori Nutrizionali</strong></h3>        
            <div className="mb-2 info" ><i className="fa fa-cutlery" aria-hidden="true"></i> {data.porzioni} porzioni</div>
            <hr style={{borderTop: '1rem solid #333'}} />
            <div className="mb-2 info" ><i className="fa fa-free-code-camp" aria-hidden="true"></i> {data.calorie} Kcal</div>
        </div>
    )
}
