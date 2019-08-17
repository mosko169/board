import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import Lock from "@material-ui/icons/Lock";
import People from "@material-ui/icons/People";
// core components
import Header from "./components/Header/Header.jsx";
import HeaderLinks from "./components/Header/HeaderLinks.jsx";
import Footer from "./components/Footer/Footer.jsx";
import GridContainer from "./components/Grid/GridContainer.jsx";
import GridItem from "./components/Grid/GridItem.jsx";
import Button from "./components/CustomButtons/Button.jsx";
import Card from "./components/Card/Card.jsx";
import CardBody from "./components/Card/CardBody.jsx";
import CardFooter from "./components/Card/CardFooter.jsx";
import CustomInput from "./components/CustomInput/CustomInput.jsx";


import loginPageStyle from "./assets/jss/material-kit-react/views/loginPage.jsx";

import image from "./assets/img/bg7.jpg";
import { format } from "logform";
import { ENGINE_METHOD_NONE } from "constants";



class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    // we use this to make the card to appear after the page has been rendered
    this.formData = {};
    this.state = {
      cardAnimaton: "cardHidden",
      LogIn : false      
    };
  }

  
  onChange(event) {
    this.formData[event.target.name] = event.target.value;
  }

  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    setTimeout(
      function() {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
  }

  handleSubmit(event){
    event.preventDefault();
    this.sendDataToServer();
  }

  changeLogIn(){
    this.setState({ LogIn : !(this.state.LogIn)} );
  }


  sendDataToServer() {
    return fetch('login/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: this.formData.username,
      password: this.formData.password,
    })
  }).then(function(response){
    return {};//response.json();
   }).then((data) =>{
    //this.props.onSubmitForm(data);
   })
  }
 

  render() {
    const { classes, ...rest } = this.props;
    return (
      <div>
        <Header
          absolute
          color="transparent"
          brand="Material Kit React"
        />
        <div
          className={classes.pageHeader}
          style={{
            backgroundImage: "url(" + image + ")",
            backgroundSize: "cover",
            backgroundPosition: "top center"
          }}
          >
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={4}>
              <Card className={classes[this.state.cardAnimaton]}>
              <form className={classes.form}  onSubmit={this.handleSubmit}>
          <CardBody>
          <CustomInput
            labelText="First Name..."
            id="username"
            name="username"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              onChange: this.onChange.bind(this),
              type: "text",
              name: "username",
              endAdornment: (
                <InputAdornment position="end">
                  <People className={classes.inputIconsColor} />
                </InputAdornment>
              )
            }}
            />
          <CustomInput
            labelText="Password"
            id="password"
            name="password"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              onChange: this.onChange.bind(this),
              type: "password",
              name: "password",
              endAdornment: (
                <InputAdornment position="end">
                  <Lock className={classes.inputIconsColor}/>
                </InputAdornment>
              )
            }}
            />
          </CardBody>
          <CardFooter className={classes.cardFooter}>                  
          <Button simple color="primary" size="lg" type="submit">
            Get started
          </Button>
          </CardFooter>
        </form>
        </Card>
      </GridItem>
    </GridContainer>
    </div>
    <Footer whiteFont />
    </div>
    </div>
    );
  }
}


export default withStyles(loginPageStyle)(LoginPage);
