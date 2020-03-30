import React, { Component , Fragment, useState, useEffect } from 'react';
import parse from 'html-react-parser';
import { EditButton, ConfirmButton, CloseButton } from '../utils/Button';
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
            checked : [],
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
                let checked = this.state.checked;

                ricetta = remoteData.data;

                ricetta.ingredienti.map((i,k) => checked[k] = false)

                //console.log(remoteData);

                this.setState({ ricetta: ricetta, checked: checked , loader:false })

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
            let msg = '';

            ricetta.fase = result.data.fase;
            switch(ricetta.fase){
                case 'idonea':
                    msg = 'Ricetta Validata!';
                    break;
                case 'approvata':
                    msg = 'Ricetta Approvata!';
                    break;
                case 'scartata':
                    msg = 'Ricetta Scartata!';
                    break;
            }

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
                                            <i className="fa fa-star-half-o" aria-hidden="true"> </i>
                                        </div>
                                        <div >
                                            <div className="title"><strong>Difficoltà</strong></div>
                                            <div>{data.difficolta}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="content">
                                    <div className="intro mb-5">{parse(data.intro)}</div>
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

                                    <div className="ingredienti mb-5">
                                        <h5><strong>Ingredienti</strong></h5>
                                        <hr/>
                                        <ul>
                                            {data.ingredienti.map((i,k) => {
                                                let checked = this.state.checked;

                                                return(
                                                    <div key={k}
                                                    //className="form-control"
                                                    >
                                                        <CheckField
                                                            name={'ingrediente_'+k }
                                                            divClassName={(checked[k]? 'checked':'') }
                                                            className='mr-3'
                                                            value=''
                                                            checked={this.state.checked[k]}
                                                            handleChange={() => {
                                                                checked[k] = !checked[k];
                                                                this.setState({checked: checked})
                                                            } }
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

                                    <div className="body mb-5">
                                        <div>
                                            <h5><strong>Modalità Preparazione</strong></h5>
                                            <hr/>
                                        </div>
                                            {
                                                parse(data.modalita_preparazione)
                                            }
                                    </div>

                                    {data.fase!='approvata' && user.ruolo!='autore' &&
                                        <div className="body mb-3">
                                            <div className="alert alert-secondary">
                                                <h5><strong>Note per il redattore</strong></h5>
                                                {data.note}
                                            </div>
                                        </div>
                                    }
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
                                <Fragment>

                                    <ValoriNutrizionali data={data} />

                                    <UltimeRicette history={history} url={this.props.url} data={data} />

                                </Fragment>
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
            <CloseButton
            //style={style}
            className={"w-100 py-2 "}
            onClick={(a) => props.onClick(props.state.ricetta.id,'scartata')
            }
            >
                Scarta
                <img className={"loader-2"+(props.state.verificationLoader==true?' d-inline-block':'')} src={props.url+"/img/loader_2.gif"}></img>
            </CloseButton>

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
        <div className="blog border border-dark p-4 mb-5">
            <h3 className="mb-3 "><strong>Valori Nutrizionali</strong></h3>
            <div className="mb-2 info" ><i className="fa fa-cutlery" aria-hidden="true"></i> {data.porzioni} porzioni</div>
            <hr style={{borderTop: '1rem solid #333'}} />
            <div className="mb-2 info" ><i className="fa fa-free-code-camp" aria-hidden="true"></i> {data.calorie} Kcal</div>
        </div>
    )
}


class UltimeRicette extends Component {


    constructor(props) {
        super(props);

        this.state = {
            data:{ricette:[]}
        }
    }

    componentDidMount(){
        this.getRemoteData();
    }

    getRemoteData() {

        let url = this.props.url+'/ricette?only=blog';

        let headers = {headers: {'Accept': 'application/json'}};

        return axios.get(url, headers )
			.then(result => {

                let remoteData = result.data;
                let data = this.state.data;

                data.ricette.push(...remoteData.data);

                console.log(data);
                this.setState({data : data})

			}).catch((error) => {
                if(error.response===undefined) return;

                if(error.response.data!==undefined)
                    console.log(error.response.data);
                else
                    console.log(error.response);

                throw error;
			});
    }

    render(){

        return(
            <div className="blog p-1 mb-3 bg-transparent ultime-ricette">
                <h3 className="mb-3 "><strong>Ricette Recenti</strong></h3>
                <div>
                    {
                        this.state.data.ricette.map((r,k) => {
                            if(this.props.data.id==r.id) return;
                            return(
                                <div className="clearfix" key={k}>
                                    <div className="image float-left mb-3 mr-3">
                                        <a href={this.props.url+'/blog/'+r.id} >
                                            <img src={r.img} />
                                        </a>
                                    </div>
                                    <div>
                                        <a href={this.props.url+'/blog/'+r.id} >{r.titolo} </a>
                                        <div>di {r.autore}</div>
                                    </div>
                                    <hr/>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}
