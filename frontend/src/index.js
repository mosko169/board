import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Canvas from './Canvas'
import UserDetails from './App'
import LoginPage from './LoginPage'
import { Lessons, Video }  from './lessons'
import { Navbar, Nav} from 'react-bootstrap';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'

class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          showCanvs: false,
          showForm: true,
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
    }

    renderElement(){
        if(this.state.showForm)
           return <UserDetails onSubmitForm={this.handleSubmitForm} onChange={this.handleChange} responseData={this.state.responseData}/>;
        return (<Canvas userId={this.state.userId} responseData={this.state.responseData} />);
     }

    render(){
      return (
        <div>
        <div>
        { this.renderElement() }
        </div>
        </div>
      )
  
    }
  };


  const routing = (
    <Router>
      <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#">Smart Board</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
            <Nav.Link> <Link to="/">Bla</Link></Nav.Link>
            <Nav.Link> <Link to="/lessons">Lessons</Link></Nav.Link>
            </Nav>
        </Navbar.Collapse>
        </Navbar>
        <Route exact path="/" component={LoginPage} />
        <Route path="/lessons" component={Lessons} />
        <Route path="/video" component={Video} />
      </div>
    </Router>
  )
ReactDOM.render(routing, document.getElementById('root'))
//ReactDOM.render(<MainPage />, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
