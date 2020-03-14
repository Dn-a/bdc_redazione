import React, { Component , Fragment } from 'react';
import { Link } from 'react-router-dom'
import parse from 'html-react-parser';


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
            loader: false
        };
    }

    componentDidMount(){       
        this.getRemoteData();
    }

    getRemoteData(type,id){

        let url = this.props.url+'/ricette?only=blog';

        let headers = {headers: {'Accept': 'application/json'}};

        this.setState({loader:true})

        return axios.get(url, headers )
			.then(result => {

                let data = this.state.data;

                let remoteData = result.data;
                let pagination = remoteData.pagination;

                data.ricette.push(...remoteData.data);
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

    render() {
        let data = this.state.data;
        
        //console.log(this.props);

        return (
            <section className="container-fluid blog">
                {this.state.loader?
                    (<div className="text-center"><div className="img-loader active"><img src={this.props.url+'/img/loader.gif'} /></div></div>)
                :
                    (<div className="row">
                        {data.ricette.map((rc,key) =>{
                            return(                            
                                    <div className="col-md-4" key={key}>
                                        
                                        <div className="card mb-4 box-shadow">
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
                    </div>)
                }
            </section>

        );
    }
}
