import React, { Component , Fragment } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route, Link, NavLink} from "react-router-dom";

import Home from './view/Home';

import LoginRegister from './modal/LoginRegister';
import { Button } from './utils/Button';

const routes = [
    {path: "/", name:"Home",title:'Home', icon:'fa-home', Component:Home},   
];

const MainTitle = ()  => {
    return(
    <div className="px-2 ml-4 mb-4 ">
        <Switch>
            {
            routes.map(({path, title, icon},key) => {
            return(
            <Route key={key} exact path={path} >
                <h3>
                    <i className={"fa "+icon} aria-hidden="true"> </i>
                    <strong> {title}</strong>
                </h3>
            </Route>
            )
            })
            }
        </Switch>
    </div>

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
                
                <header >

                    {ruolo!=null && ruolo!='' &&
                        <button type="button" id="sidebarCollapse" className="btn btn-link">
                            <i className="fa fa-align-left"></i>
                        </button>
                    }

                    <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm pl-5">

                        <div className="container-fluid">

                            <a className="navbar-brand" href="">
                                <strong>Redazione</strong> Rivista Culinaria
                            </a>

                            <div className="navbar-collapse d-table" id="navbarSupportedContent">

                                <ul className="navbar-nav mr-auto">

                                </ul>

                                <ul className="navbar-nav ml-auto">

                                    {ruolo==null || ruolo=='' ?

                                        (
                                            <Fragment>
                                                <li className="nav-item">
                                                    <Button className="nav-link" onClick={this._handleShowLogin} >Accedi</Button>
                                                </li>
                                                
                                                <LoginRegister 
                                                url={this.url}                            
                                                show={this.state.showLogin} onHide={this._handleCloseLogin}
                                                callback={ (a) => console.log(a) }
                                                />

                                            </Fragment>
                                        )
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

                {ruolo!=null && ruolo!='' &&
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


                <main id="content" className="py-4">

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

            </Router>

        );
    }
}


if (document.getElementById('redazione')) {
    ReactDOM.render(<Main />, document.getElementById('redazione'));
}
