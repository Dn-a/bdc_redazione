import React, { Component , Fragment } from 'react';

import Blog from './Blog';
import SearchField from '../utils/SearchField';
import DropdownSelect from '../utils/form/DropdownSelect';

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

            <Fragment>
                <div className="slider " >                        
                    <img src={this.props.url+'/img/home.jpg'} />                        
                </div>
                <div className="container-fluid constraint">
                        
                    <div className='slider-text'>
                        <div className="text">
                            <h1>
                                <strong>Redazione</strong> Rivista culinaria
                            </h1>
                        </div>
                    </div>

                    <div className="row pb-3 mb-4 px-3">
                        <div className="col-md-2 pr-1">                            
                            <DropdownSelect 
                                placeholder="Categorie"
                                defaultSelected='Categorie'
                                values={{0:'primo'}}
                            />
                        </div>
                        <div className="col-md-8 px-1">
                            <SearchField 
                                searchClassName="w-100"
                            />                            
                        </div>
                    </div>

                    <Blog url={this.props.url} />
                </div>
            </Fragment>

        );
    }
}
