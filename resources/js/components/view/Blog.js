import React, { Component , Fragment } from 'react';
import { Link } from 'react-router-dom'
import parse from 'html-react-parser';
import CheckField from '../utils/form/CheckField';


const FIELDS = [
    {titolo: 'ricette', type:[]}
];

export default class Blog extends Component {

    constructor(props){
        super(props);

        let ricette = [];

        FIELDS.map((fd,id) => {
            ricette[fd.titolo] = fd.type;
        });

        this.state = {
            data: {
                ricette: [],
                page : 0,
                total : 0,
                perPage : 0,
            },
            kcalSelcted:{id:[],titolo:[],kcal:[]},
            loader: false
        };

        this.handleKcalSelected = this.handleKcalSelected.bind(this)
    }

    componentDidMount(){       
        this.getRemoteData();
    }

    componentWillReceiveProps(){
        if(this.props.filtri!==undefined)
            this.recallWithFilter();
    }

    recallWithFilter(){

        let filtri = this.props.filtri;
        let query = '';

        Object.keys(filtri).forEach((f,i) => {
            if(f == 'tempo'){
                query += 'tempo=' + filtri[f].min + '-' + filtri[f].max + '&';
                //query += 'Tmax=' + filtri[f].max + '&';
            }else if(f == 'calorie'){
                query += 'calorie=' + filtri[f].min + '-' + filtri[f].max + '&';
                //query += 'Kmax=' + filtri[f].max + '&';
            }else if(f == 'ingredienti')
                query += 'ingredienti=' + JSON.stringify(filtri[f]);
            else
                query += filtri[f]!=''? f + '=' + filtri[f] + '&' : '';
        });

        //console.log(query)

        this.getRemoteData(query)
    }

    getRemoteData(query){        

        let url = this.props.url+'/ricette?only=blog&'+query;

        let headers = {headers: {'Accept': 'application/json'}};

        this.setState({loader:true})

        return axios.get(url, headers )
			.then(result => {

                let data = this.state.data;

                let remoteData = result.data;
                let pagination = remoteData.pagination;

                data.ricette = remoteData.data;
                data.page = pagination.current_page;
                data.total = pagination.total;
                data.perPage = pagination.per_page;

                //console.log(remoteData);

                this.setState({ data:data, loader:false })

			}).catch((error) => {
                if(error.response===undefined) return;
                
                if(error.response.data!==undefined)
                    console.log(error.response.data);
                else
                    console.log(error.response);

                throw error;
			});
    }

    handleKcalSelected(e){
        let checked = e.target.checked;
        let value = JSON.parse(e.target.value);

        let kcalSelcted = this.state.kcalSelcted;

        if(!checked){
            kcalSelcted.id = kcalSelcted.id.filter(id => id != value.id)  
            kcalSelcted.titolo = kcalSelcted.titolo.filter(titolo => titolo != value.titolo)  
            kcalSelcted.kcal = kcalSelcted.kcal.filter(kcal => kcal != value.kcal)  
        }
        else{
            kcalSelcted.id.push(value.id)  
            kcalSelcted.titolo.push(value.titolo)
            kcalSelcted.kcal.push(value.kcal)
        }
        
        this.setState({kcalSelcted: kcalSelcted})
    }
    

    render() {
        let data = this.state.data;
        let kcalSelcted = this.state.kcalSelcted;
        let titoloKcal = kcalSelcted.titolo;
        let totKcal = kcalSelcted.kcal.length>0 ? kcalSelcted.kcal.reduce((a,b) => a+b) : 0;
        //console.log(this.props);

        return (
            <section className="container-fluid blog">
                {this.state.loader?
                    (<div className="text-center"><div className="img-loader active"><img src={this.props.url+'/img/loader.gif'} /></div></div>)
                :
                    (
                        <Fragment>
                            
                            {kcalSelcted.id.length > 0 &&
                                <div className="row mb-5">
                                    <div className="col-md-12">
                                        <strong>Ricette selezionate: </strong>
                                        | {titoloKcal.map((t,id) => <span key={id}>{t} | </span>)}
                                        <div><strong>kcal totali: </strong>{totKcal}</div>
                                    </div>
                                </div>
                            }

                            <div className="row">
                                {data.ricette.map((rc,key) =>{
                                    return(                            
                                            <div className="col-md-4" key={key}>
                                                
                                                <div className="card mb-5 box-shadow">
                                                    
                                                    <CheckField 
                                                        style={{right:'4px'}}
                                                        divClassName="position-absolute p-2"
                                                        name={'ingrediente_'+key}
                                                        value={JSON.stringify({id:rc.id,titolo:rc.titolo,kcal:rc.calorie})}
                                                        checked={kcalSelcted.id.includes(rc.id)}
                                                        handleChange={this.handleKcalSelected}
                                                    />

                                                    <Link to={this.props.url+'/blog/'+rc.id}>                                                
                                                        <img className="card-img-top" src={rc.img} alt="Card image cap" />
                                                    </Link>
                                                    <div className="card-body">
                                                        <Link to={this.props.url+'/blog/'+rc.id}>
                                                            <h5 className="card-title">{rc.titolo}</h5>
                                                        </Link>
                                                        <p className="card-text">{parse(rc.intro)}</p>
                                                    </div>
                                                    <div className="card-footer bg-transparent">
                                                        
                                                        <div className="row">
                                                            <div className="info col-sm-3 col-md-3 text-center px-1">
                                                                <i className="fa fa-star-half-o" aria-hidden="true"></i>
                                                                &nbsp;{rc.difficolta}
                                                            </div>
                                                            <div className="info col-sm-3 col-md-4 text-center px-1">
                                                                <i className="fa fa-clock-o" aria-hidden="true"> </i>
                                                                &nbsp;{(rc.tempo_preparazione+rc.tempo_cottura)} min
                                                            </div>
                                                            <div className="info col-sm-6 col-md-5 text-center px-1">
                                                                <i className="fa fa-free-code-camp" aria-hidden="true"></i>
                                                                &nbsp;{rc.calorie} Kcal
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                                
                                            </div>
                                        
                                    )
                                })}
                            </div>
                        </Fragment>
                    )
                }
            </section>

        );
    }
}
