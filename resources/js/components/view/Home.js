import React, { Component , Fragment } from 'react';
import ReactBootstrapSlider from 'react-bootstrap-slider';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-slider/dist/css/bootstrap-slider.css";

import Blog from './Blog';
import SearchField from '../utils/SearchField';
import DropdownSelect from '../utils/form/DropdownSelect';
import InputField from '../utils/form/InputField';
import RangeField from '../utils/form/RangeField';

export default class Home extends Component {

    constructor(props){
        super(props);

        this.state = {
            rows: '',
            loader: false,           
        };
    }

 
    render() {
        
        let difficolta = {'facile':'facile','media':'media','difficile':'difficile'};

        return (

            <Fragment>
                <div className="slider-blog " >                        
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
                        <div className="col-md-2 pr-0">                            
                            <DropdownSelect 
                                placeholder="Tipologia"
                                defaultSelected='Tipologia'
                                values={{0:'primo'}}
                            />
                        </div>
                        <div className="col-md-2 pr-0">                            
                            <DropdownSelect 
                                placeholder="Difficoltà"
                                defaultSelected='Difficoltà'
                                values={difficolta}
                            />
                        </div>
                        <div className="col-md-2 pr-0">                            
                            <InputField 
                                className="form-control"
                                placeholder="Tempo cottura (min)"
                            />
                        </div>
                        <div className="col-md-2 pr-0">                            
                            <InputField 
                                className="form-control"
                                placeholder="Kcal"
                            />
                        </div>
                        <div className="col-md-2 pr-0">                            
                            <ReactBootstrapSlider
                            value={100}
                            //change={this.changeValue}
                            //slideStop={this.changeValue}
                            step={10}
                            max={10}
                            min={100}
                            //orientation="vertical"
                            //reversed={true}
                            //disabled="disabled" 
                            />
                        </div>
                        <div className="col-md-6 px-3 mt-3">
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
