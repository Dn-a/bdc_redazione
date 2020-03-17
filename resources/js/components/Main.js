import React, { Component , Fragment, useState} from 'react';
import ReactDOM from 'react-dom';

import {Router, Switch, Route, Link, NavLink} from "react-router-dom";
import history from './history';

import { Button } from './utils/Button';

import {User} from './Env';

import LoginRegister from './modal/LoginRegister';
import Home from './view/Home';
import Redattori from './view/Redattori';
import Autori from './view/Autori';
import AddEditRicetta from './view/AddEditRicetta';
import Ricetta from './view/Ricetta';
import Ricette from './view/Ricette';
import Ingredienti from './view/Ingredienti';
import Verifiche from './view/Verifiche';

const routes = [
    {path: "/", name:"Home",title:'Home', icon:'fa-home', Component:Home},
    {path: "/verifiche", name:"Verifiche", title:'Validazione Ricette', icon:'fa-gavel', Component: Verifiche},
    {path: "/verifiche/:ricetta", name:"Verifica", title:'Validazione Ricetta', icon:'fa-gavel', Component: Ricetta},
    {path: "/blog/:ricetta", name:"Ricetta", title:'Ricetta', icon:'fa-home', Component:Ricetta},

    //{path: "/validate", name:"Validate", title:'Ricette Validate', icon:'fa-thumbs-up', Component: Validate},
    //{path: "/approvate", name:"Approvate", title:'Ricette Approvate', icon:'fa-thumbs-up', Component: Validate},

    {path: "/gestione-ricette/new", name:"Nuova-Ricetta", title:'Nuova Ricetta', icon:'fa-list-ol', Component: AddEditRicetta},   
    {path: "/gestione-ricette/:ricetta/edit", name:"Modifica-Ricetta", title:'Modifica Ricetta', icon:'fa-list-ol', Component: AddEditRicetta},   

    {path: "/gestione-ricette", name:"Ricette", title:'Gestione Ricette', icon:'fa-list-ol', Component: Ricette},   
    {path: "/gestione-ricette/:ricetta", name:"Gestione-Ricetta", title:'Gestione Ricetta', icon:'fa-list-ol', Component: Ricetta},   

    {path: "/redattori", name:"Redattori", title:'Gestione Redattori', icon:'fa-users', Component: Redattori},   
    {path: "/autori", name:"Autori", title:'Gestione Autori', icon:'fa-address-card-o', Component: Autori},    
    {path: "/ingredienti", name:"Ingredienti", title:'Gestione Ingredienti', icon:'fa-list-ul', Component: Ingredienti},    
];

const MainTitle = ()  => {
    return(    
        <Switch>
            {
            routes.map(({path, title, icon},key) => {
                if(title=='Home' || title=='Ricetta' || title=='Verifica') return;
            return(
            <Route key={key} exact path={path} >
                <div className="px-2 pl-4 mt-2 mb-5 constraint">
                    <h3>
                        <i className={"fa "+icon} aria-hidden="true"> </i>
                        <strong> {title}</strong>
                    </h3>
                </div>
            </Route>
            )
            })
            }
        </Switch>
    );
}

const Breadcrumb = ({ children }) => {
    return <div>{children}</div>
}

const LoginButton = (props) =>{

    const [show, setValue] = useState(false);

    const _handleShow = () => setValue(true);

    const _handleHide = () => setValue(false);

    return (
        <Fragment>
            <li className="nav-item">
            <Button className="nav-link" onClick={_handleShow} >Accedi</Button>
            </li>

            <LoginRegister 
                url={props.url}                            
                show={show} onHide={_handleHide}
                callback={ (a) => console.log(a) }
            />
        </Fragment>     
    );
}

export default class Main extends Component {

    constructor(props){
        super(props);

        this.state = {            
            showLogin: false
        };

        const host = window.location.hostname;
        this.home = host=='www.dn-a.it'? '/noleggio':'';
        this.url = this.home;

        this._handleShowLogin = this._handleShowLogin.bind(this);
        this._handleCloseLogin = this._handleCloseLogin.bind(this);
    }

    _handleShowLogin () {
        this.setState({showLogin : true});
    }
    _handleCloseLogin (){
        this.setState({showLogin : false});
    }

    render() {
               
        let user = User();

        let ruolo = user.ruolo;
        let nome = user.nome;
        let menu = user.menu;
        
        return (
            
            <Router history={history} >
                
                <header className={ruolo!=''?'logged':''}>

                    <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm">

                        <div className="container-fluid constraint">
                            
                            {ruolo!=''  &&
                                <button type="button" id="sidebarCollapse" className="btn btn-link">
                                    <i className="fa fa-align-left"></i>
                                </button>
                            }
                            
                            <a className="navbar-brand" href={'/'+this.url}>
                                <div className='logo'><img src={this.url+'/img/logo.png'} /></div>                                
                            </a>

                            <div className="navbar-collapse d-table" id="navbarSupportedContent">

                                <ul className="navbar-nav mr-auto">

                                </ul>

                                <ul className="navbar-nav ml-auto">

                                    {ruolo=='' ?                                                
                                        <LoginButton url={this.url} />
                                        :
                                        (
                                            <li className="nav-item dropdown">
                                                <span>{ruolo.charAt(0).toUpperCase() + ruolo.slice(1)}: </span>
                                                <a id="navbarDropdown" className="nav-link dropdown-toggle d-inline-block" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre="false">
                                                    {nome.charAt(0).toUpperCase() + nome.slice(1)} <span className="caret"></span>
                                                </a>

                                                <div className="dropdown-menu dropdown-menu-right position-absolute" aria-labelledby="navbarDropdown">
                                                    <a className="dropdown-item" href=""
                                                    onClick={() => {event.preventDefault(); document.getElementById('logout-form').submit();}}>
                                                        Logout
                                                    </a>
                                                    <form id="logout-form" action={this.url+'/logout'} method="POST" >
                                                        <input type="hidden" name="_token" value={CSRF_TOKEN} />
                                                    </form>
                                                </div>
                                            </li>
                                        )
                                    }

                                </ul>
                            </div>

                        </div>
                    </nav>

                </header>

                {ruolo!='' &&
                    <aside id="sidebar" className="shadow">
                        <nav className="menu py-3" >
                            <ul>
                                {
                                    routes.map(({path, name, icon},key) => {
                                        if(menu.indexOf(name.toLowerCase())==-1) return;
                                        return(
                                            <li key={key} >
                                                <NavLink exact to={path} title={name}>
                                                    <i className={"fa "+icon} aria-hidden="true"></i>
                                                    <span>{name}</span>
                                                </NavLink>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        </nav>
                    </aside>
                }
                
                <main id="content" className={"py-4 pb-5 "+(ruolo!=''?'logged':'')}>
                    
                    <MainTitle />

                    <Switch>
                        {
                            routes.map(({path, Component},key) => {
                                return(
                                    <Route key={key} path={path} exact
                                        component={(router) => <Component router={router} url={this.url} />}
                                    />
                                )
                            })
                        }
                    </Switch>

                </main>

                <footer className={"p-3 "+(ruolo!=''?'logged':'')}>
                    <div className="container-fluid constraint"><strong>Powered by</strong> Di Natale Antonino</div>
                </footer>

            </Router>

        );
    }
}


if (document.getElementById('redazione')) {
    ReactDOM.render(<Main />, document.getElementById('redazione'));
}
