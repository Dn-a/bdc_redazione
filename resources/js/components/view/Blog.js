import React, { Component , Fragment } from 'react';

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

        let urlType = {
            ptVendita: 'punti-vendita',
            incassi: 'incassi'+(id!=null?'?id_pt_vendita='+id:'')
        }

        let url = this.props.url+'/ricette';

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
            <section className="container-fluid">
                <div className="row">
                    {data.ricette.map((rc,key) =>{
                        return(
                            <div className="col-md-4" key={key}>
                                <div className="card" >
                                    <img className="card-img-top" src={rc.img} alt="Card image cap" />
                                    <div className="card-body">
                                        <p className="card-text">{rc.modalita_preparazione}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>

        );
    }
}
