import React, { Component , Fragment, useState} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route, Link, NavLink} from "react-router-dom";
import { Button } from './utils/Button';

import LoginRegister from './modal/LoginRegister';
import Home from './view/Home';
import Redattori from './view/Redattori';
import Autori from './view/Autori';

const routes = [
    {path: "/", name:"Home",title:'Home', icon:'fa-home', Component:Home},
    {path: "/redattori", name:"Redattori",title:'Gestione Redattori', icon:'fa-users', Component: Redattori},   
    {path: "/autori", name:"Autori",title:'Gestione Autori', icon:'fa-address-card-o', Component: Autori}
];

const MainTitle = ()  => {
    return(    
        <Switch>
            {
            routes.map(({path, title, icon},key) => {
                if(title=='Home') return;
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
               
        let config = typeof USER_CONFIG!== 'undefined' ? USER_CONFIG : null;
        let ruolo = config!=null? config.ruolo : null;
        let nome = config!=null? config.nome : '';
        let menu = config!=null ? USER_CONFIG.menu: [];

        return (

            <Router>
                
                <header className={config!=null?'logged':''}>

                    <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm">

                        <div className="container-fluid constraint">
                            
                            {config!=null  &&
                                <button type="button" id="sidebarCollapse" className="btn btn-link">
                                    <i className="fa fa-align-left"></i>
                                </button>
                            }
                            
                            <a className="navbar-brand" href="">
                                <div className='logo'><img src={this.url+'/img/logo.png'} /></div>                                
                            </a>

                            <div className="navbar-collapse d-table" id="navbarSupportedContent">

                                <ul className="navbar-nav mr-auto">

                                </ul>

                                <ul className="navbar-nav ml-auto">

                                    {ruolo==null || ruolo=='' ?                                                
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

                {config!=null &&
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
                
                <main id="content" className={"py-4 "+(config!=null?'logged':'')}>
                    
                    <MainTitle />

                    <Switch>
                        {
                            routes.map(({path, Component},key) => {
                                return(
                                    <Route key={key} path={path} exact
                                        component={() => <Component url={this.url} />}
                                    />
                                )
                            })
                        }
                    </Switch>

                </main>

                <footer className={"p-3 "+(config!=null?'logged':'')}>
                    <div className="container-fluid constraint"><strong>Powered by</strong> Di Natale Antonino</div>
                </footer>

            </Router>

        );
    }
}


if (document.getElementById('redazione')) {
    ReactDOM.render(<Main />, document.getElementById('redazione'));
}
