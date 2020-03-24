import React, { Component , Fragment } from 'react';

import Blog from './Blog';
import SearchField from '../utils/SearchField';
import DropdownSelect from '../utils/form/DropdownSelect';
import InputField from '../utils/form/InputField';
import RangeField from '../utils/form/RangeField';
import {User} from './../Env';

import ReactBootstrapSlider from 'react-bootstrap-slider';
import "bootstrap-slider/dist/css/bootstrap-slider.css";
//import "bootstrap/dist/css/bootstrap.css";


const TEMPO = {
    step:1,
    min:0,
    max:300
}

const CALORIE = {
    step:1,
    min:0,
    max:5000
}

export default class Home extends Component {

    constructor(props){
        super(props);

        this.state = {
            filtri: {
                tipologia: '',
                difficolta: '',
                tempo:{
                    min: TEMPO.min,
                    max: TEMPO.max,
                },
                calorie:{
                    min: CALORIE.min,
                    max: CALORIE.max,
                },
                ricetta:'',
                ingredienti:[]
            },
            loader: false,           
        };

        this.onChangeCalorie = this.onChangeCalorie.bind(this)
        this.onChangeTempo = this.onChangeTempo.bind(this)

    }

    onChangeTempo(e){
        let minMax = e.target.value;
        let filtri = this.state.filtri;

        filtri.tempo.min = minMax[0]
        filtri.tempo.max = minMax[1]

        this.setState({ filtri : filtri})
    }

    onChangeCalorie(e){
        let minMax = e.target.value;
        let filtri = this.state.filtri;

        filtri.calorie.min = minMax[0]
        filtri.calorie.max = minMax[1]

        this.setState({ filtri : filtri })
    }


    filterRemove(entry , ingr){
        
        const onClick = () => {
            let filtri = this.state.filtri;

            switch(entry){
                case 'ricetta':
                    filtri.ricetta = '';
                    break;
                case 'tipologia':
                    filtri.tipologia = 0;
                    break;
                case 'difficolta':
                    filtri.difficolta = 0;
                    break;
                case 'tempo':
                    filtri.tempo.min = TEMPO.min;
                    filtri.tempo.max = TEMPO.max;
                    break;
                case 'calorie':
                    filtri.calorie.min = CALORIE.min;
                    filtri.calorie.max = CALORIE.max;
                    break;
                case 'ingrediente':
                    filtri.ingredienti = filtri.ingredienti.filter( i => i!= ingr);
            }
            
            this.setState({ filtri : filtri });
        }

        return(
            <div onClick={() => onClick() } className="btn-clear d-inline mr-2 active"><i className="fa fa-times" aria-hidden="true"></i></div>
        )
    }

 
    render() {
        let filtri = this.state.filtri;

        let user = User();

        //let tipologia = {'primo':'Primo','secondo':'Secondo','contorno':'Contorno','dolce':'Dolce','antipasto':'Antipasto'};

        let TIPOLOGIE = JSON.parse(user.tipologie);
        let tipologia = {};
        Object.keys(TIPOLOGIE).map((k) => tipologia[TIPOLOGIE[k].toLowerCase()] = TIPOLOGIE[k] )

        let difficolta = {
            //0:'Tutte',
            'facile':'Facile','media':'Media','difficile':'Difficile'};

        let urlRicetta = this.props.url+'/ricette/search';
        let urlIngrediente = this.props.url+'/ingredienti/search';

        let tempoView = filtri.tempo.min > TEMPO.min || filtri.tempo.max < TEMPO.max;        
        let calorieView = filtri.calorie.min > CALORIE.min || filtri.calorie.max < CALORIE.max;

        let ingredienti = filtri.ingredienti;
        
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

                    <div className="row mb-2 px-3">

                        <div className="col-md-2 pr-0 mb-3">                            
                            <DropdownSelect 
                                placeholder="Tipologia"
                                selected={filtri.tipologia == ''? 'Tipologia' : filtri.tipologia}
                                //defaultSelected='Tipologia'
                                handleChange={(e) => {
                                        let el = e.target;
                                        //let value = el.options[el.selectedIndex].text.toLowerCase();
                                        //console.log(value);
                                        let filtri = this.state.filtri;
                                        filtri.tipologia = el.value;
                                        this.setState({filtri : filtri })
                                    }
                                }
                                values={tipologia}
                            />
                        </div>

                        <div className="col-md-2 pr-0 mb-3">                           
                            <DropdownSelect 
                                placeholder="Difficoltà"
                                selected={filtri.difficolta==''?'Difficoltà':filtri.difficolta}
                                //defaultSelected='Difficoltà'
                                handleChange={(e) => {
                                        //console.log(e.target)
                                        let filtri = this.state.filtri;
                                        filtri.difficolta = e.target.value;
                                        this.setState({filtri : filtri })
                                    }
                                }
                                values={difficolta}
                            />
                        </div>    

                        <div className="col-md-4 ml-2 mr-3 row mb-3">

                            <div className="col-md-5 pl-3 pr-0">Tempo Cottura</div>    

                            <div className="col-md-6 pl-4">

                                <ReactBootstrapSlider
                                value={[
                                    this.state.filtri.tempo.min,
                                    this.state.filtri.tempo.max
                                ]}                            
                                slideStop={this.onChangeTempo}
                                //slideStop={(e) => console.log(e.target)}
                                step={TEMPO.step}
                                min={TEMPO.min}
                                max={TEMPO.max}
                                ticks = {[TEMPO.min, TEMPO.max]}    
                                ticks_labels = {[TEMPO.min+" min", TEMPO.max+" min"]}                                 
                                />

                            </div>

                        </div>

                        <div className="col-md-3 ml-3 row">

                            <div className="col-md-5 pl-4 p-0">Calorie</div>   

                            <div className="col-md-7 pl-3 p-0">

                                <ReactBootstrapSlider
                                value={[
                                    this.state.filtri.calorie.min,
                                    this.state.filtri.calorie.max
                                ]}                    
                                slideStop={this.onChangeCalorie}
                                step={CALORIE.step}
                                min={CALORIE.min}
                                max={CALORIE.max}
                                ticks = {[ CALORIE.min , CALORIE.max]}    
                                ticks_labels = {[CALORIE.min+" Kcal", CALORIE.max+" Kcal"]}
                                />

                            </div>

                        </div>
                    </div>

                    <div className="row mb-5 px-3">

                        <div className="col-md-3 px-3 mt-3">
                            <SearchField 
                                url={urlRicetta}
                                query='only=blog'
                                placeholder="Cerca Ricetta"
                                searchClassName="w-100"
                                showList={true}
                                resetAfterClick={true}
                                reloadOnClick={false}
                                patternList={{id:'id', fields:{titolo:[]}} }
                                onClick={(res) => {
                                        //console.log(res)

                                        let filtri = this.state.filtri;                                    
                                        filtri.ricetta = res.titolo;

                                        this.setState({filtri: filtri});
                                    }
                                }
                            />                            
                        </div>

                        <div className="col-md-3 px-3 mt-3">
                            <SearchField 
                                url={urlIngrediente}
                                placeholder="Cerca Ingrediente"
                                searchClassName="w-100"
                                showList={true}
                                resetAfterClick={true}
                                reloadOnClick={false}
                                patternList={{id:'id', fields:{titolo:[]}} }
                                onClick={(res) => {
                                        //console.log(res)

                                        let filtri = this.state.filtri;                                    
                                        
                                        if(!filtri.ingredienti.includes(res.titolo))
                                            filtri.ingredienti.push(res.titolo);

                                        this.setState({filtri: filtri});
                                    }
                                }
                            />       
                        </div>

                    </div>
                   
                    <div className="row pb-3 mb-4 px-4">
                        <div className="col-md-12">
                            <strong className="mr-2">Filtri:</strong>    

                            {this.state.filtri.ricetta!='' && 
                                <div className=" mx-1 my-1 p-1 d-inline-block">
                                    {this.filterRemove('ricetta')}
                                    {this.state.filtri.ricetta}
                                </div>
                            }

                            {this.state.filtri.tipologia!=0 && 
                                <div className=" mx-2 p-1 d-inline-block">
                                    {this.filterRemove('tipologia')}
                                    {this.state.filtri.tipologia}
                                </div>
                            }

                            {this.state.filtri.difficolta!=0 && 
                                <div className=" mx-2 p-1 d-inline-block">
                                    {this.filterRemove('difficolta')}
                                    {this.state.filtri.difficolta}
                                </div>
                            }

                            {tempoView  && 
                                <div className=" mx-2 p-1 d-inline-block">
                                    {this.filterRemove('tempo')}
                                    Tmin: {this.state.filtri.tempo.min}&nbsp;
                                    Tmax: {this.state.filtri.tempo.max}
                                </div>
                            }

                            {calorieView  && 
                                <div className=" mx-2 p-1 d-inline-block">
                                    {this.filterRemove('calorie')}
                                    KcalMin: {this.state.filtri.calorie.min}&nbsp;
                                    KcalMax: {this.state.filtri.calorie.max}
                                </div>
                            }

                            {ingredienti.length>0  && 
                                ingredienti.map((i,k) => {
                                    return(
                                        <div key={k} className=" mx-2 p-1 d-inline-block">
                                            {this.filterRemove('ingrediente',i)}
                                            {i}
                                        </div>
                                    )
                                })
                            }

                        </div>
                        
                    </div>
                    
                    <hr className="mb-5"/>

                    <Blog url={this.props.url} filtri={this.state.filtri} />

                </div>
            </Fragment>

        );
    }
}
