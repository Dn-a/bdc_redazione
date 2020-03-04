import React, { Component , Fragment } from 'react';

const FIELDS = [
    {titolo: 'ricette', type:[]}
];

export default class Blog extends Component {

    constructor(props){
        super(props);

        let data = {};

        FIELDS.map((fd,id) => {
            data[fd.titolo] = fd.type;
        });

        this.state = {
            data: data,
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
			.then(res => {

                console.log(res.data);

                this.setState({loader:false})

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
                {data.ricette.map((rc,key) =>{
                    return(
                        <div className="card" key={key}>
                            <img className="card-img-top" src={rc.img} alt="Card image cap" />
                            <div className="card-body">
                                <p className="card-text">{rc.difficolta}</p>
                            </div>
                        </div>
                    )
                })}
            </section>

        );
    }
}
