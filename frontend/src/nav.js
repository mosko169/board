import React from 'react';
import { Navbar, Nav} from 'react-bootstrap';


export default class Appnav extends React.Component{
    render(){
        return (
            <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#Connect">Smart Board</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                <Nav.Link href="#connect">Curent Session</Nav.Link>
                <Nav.Link href="#cources">My Courses</Nav.Link>
                <Nav.Link href="#ScreenShots">My ScreenShots</Nav.Link>
                </Nav>
            </Navbar.Collapse>
            </Navbar>
        )

    }
};
