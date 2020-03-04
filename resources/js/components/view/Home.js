import React, { Component , Fragment } from 'react';

import Blog from './Blog';

export default class Home extends Component {

    constructor(props){
        super(props);

        this.state = {
            rows: '',
            loader: false,           
        };
    }

 
    render() {
       
        return (

            <div className="container-fluid ">
                    <div className="slider " >                        
                        <img src={this.props.url+'/img/home.jpg'} />
                        <div className='constraint '>
                            <div className="text">
                                <h1>
                                    <strong>Redazione</strong> Rivista culinaria
                                </h1>
                            </div>
                        </div>
                    </div>
                    <Blog url={this.props.url} />
            </div>

        );
    }
}
