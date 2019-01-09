import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
class App extends Component {
  state = {
    input_number: '',
    current_currency: [],
    input_currency: '',
    currencies: '',
    btnPressed: false,
    error: {
      status: false,
      message: ''
    },
    loading: true
  }
  deleteCurrency = (v) => {
    let deleteThis = []
    deleteThis.push(v)
    let temp = this.state.current_currency.slice(0);
    temp.forEach((element) => {
      if(deleteThis.includes(element['id'])){
        let removeIndex = this.state.current_currency.map((item) => item['id']).indexOf(element['id']);
        this.state.current_currency.splice(removeIndex, 1);
      }
    });
    this.setState({
      current_currency: this.state.current_currency
    })
  }
  componentWillMount = async () => {
    const { data } = await axios.get(`https://api.exchangeratesapi.io/latest`,{})
    // console.log(`ini data ===> ${JSON.stringify(data.rates)}`)
    this.setState({
      input_number: '1',
      currencies: data,
      loading: false
    })
  }
  changePress = () => {
    this.setState({
      btnPressed: !this.state.btnPressed
    })
  }
  addCurrency = () => {
    if (this.state.currencies.rates.hasOwnProperty(this.state.input_currency)) {
      let find = this.state.current_currency.filter(datum => datum.id === this.state.input_currency)
      if (find.length === 0) {
        let joined = this.state.current_currency.concat({
          id: this.state.input_currency,
          rates: this.state.currencies.rates[this.state.input_currency]
        });
        this.setState(prevState => ({
          current_currency: joined,
          input_currency: '',
          btnPressed: !this.state.btnPressed,
          error: {
            status: false,
            message: ''
          }
        }))
      }else{
        this.setState({
          error:
           {
             status: true,
             message: 'Already Inserted'
           }
        })
      }
      
    }else{
      // console.log('masu')
      this.setState({
        error:
         {
           status: true,
           message: 'Not Valid'
         }
      })
    }
    
  }
  onChangeHandlerCurrency = (e) => {
    this.setState({
      input_currency: e.target.value.toUpperCase()
    })
  }
  onChangeHandler = (e) => {
    e.preventDefault()
    this.setState({
      input_number: e.target.value
    })
  }
  render() {
    if (!this.state.loading) {
      return (
        <div className='container mt-5'>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Currency Exchange</h5>
              {this.state.error.status && 
                <div className="alert alert-danger" role="alert">
                  Currency {this.state.current_currency} is {this.state.error.message}.
                </div>
              }
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text">$</span>
                </div>
                <input type="number" className="form-control" value={this.state.input_number}  onChange={(e)=>this.onChangeHandler(e)}/>
                <div className="input-group-append">
                  <span className="input-group-text">.00</span>
                </div>
              </div>
            </div>
            <div className='container'>
              <ul className="list-group list-group-flush">
                {this.state.current_currency.map((element,i) => {
                  return (
                    <div className='container m-1' style={{border: '1px solid grey'}} key={i}>
                      <div className="row">
                        <div className="col-10">
                          <h4>{element.id}</h4>
                          <p>1 USD  = {element.id} {(element.rates).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</p>
                          <h5>{element.id} {(Number(element.rates) * Number(this.state.input_number)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</h5>
                        </div>
                        <div className="col-2 mt-1">
                          <button type="button" className="btn btn-outline-danger" onClick={()=>{this.deleteCurrency(element.id)}}>Delete</button>
                        </div>
                      </div>
                    </div>
                  )
                })
                }
              </ul>
            </div>
            {this.state.btnPressed ? 
              <div className="container input-group mb-3">
                <input type="text" className="form-control" value={this.state.input_currency}  onChange={(e)=>this.onChangeHandlerCurrency(e)}/>
                <div className="input-group-append">
                  <span className="input-group-text" onClick={this.addCurrency}>Submit</span>
                </div>
              </div>
                :
              <button type="button" className="btn btn-lg btn-primary m-3" onClick={this.changePress}>Add Currency</button>}
            
          </div>
        </div>
      );
    }else{
      return (
        <h1>Loading ...</h1>
      )
    }
    
  }
}

export default App;
