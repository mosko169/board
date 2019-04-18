import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Canvas from './Canvas'
import UserDetails from './App'
import Appnav  from './nav'

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          showCanvs: false,
          showForm: true,
          userId: 'koral',
          boardId: '1',
          responseData: null,
        };
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderElement = this.renderElement.bind(this);
    
    }


    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
      }

    handleSubmitForm(data){
        this.setState({
            responseData: data,
            showCanvs: true,
            showForm: false,
          });
          console.log(this.showCanvs);	  
 
    }

    renderElement(){
        if(this.state.showForm)
           return <UserDetails onSubmitForm={this.handleSubmitForm} onChange={this.handleChange} userId={this.state.userId} boardId={this.state.boardId} responseData={this.state.responseData}/>;
        return <Canvas 
        userId={this.state.userId}
        responseData={this.state.responseData} />;
     }

    render(){
      return (
        <div>
        <Appnav />
        <br/>
        <div>
        { this.renderElement() }
        </div>
        </div>
      )
  
    }
  };

ReactDOM.render(<MainPage />, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
