import React, { Component } from 'react';
import  {Form, Button} from 'react-bootstrap';


export default class UserDetails extends Component {
  
  constructor(props) {
    super(props);
    this.responseData = null;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendDataToServer = this.sendDataToServer.bind(this);
    
  }

  handleSubmit(event){
    event.preventDefault();
    this.sendDataToServer();
  }

  handleSaveUserData(){
    alert('need to insert that');
  }


  sendDataToServer() {
    return fetch('login/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: this.props.userId,
      boardId: this.props.boardId,
    })
  }).then(function(response){
    return response.json();
   }).then((data) =>{
    this.props.onSubmitForm(data);
   })
  }
 
  render() {
    return (
      <div>
    <Form onSubmit={this.handleSubmit}>
      <Form.Group controlId="UserName">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="text" name="userId" defaultValue={this.props.userId} placeholder="Enter User Name" onChange={this.props.onChange}/>
      </Form.Group>
      <Form.Group controlId="boardId">
        <Form.Label>boardId</Form.Label>
        <Form.Control type="number" name="boardId" defaultValue={this.props.boardId} placeholder="board Id" onChange={this.props.onChange}/>
       </Form.Group>
      <Form.Group controlId="formBasicChecbox">
        <Form.Check type="checkbox" label="Remmember me" onClick={this.handleSaveUserData}/>
      </Form.Group>
      <Button variant="primary" type="submit">
        Connect
      </Button>
    </Form>
    </div>
  );  
  }
}