import React from 'react';
const queryString = require('query-string');



class Video extends React.Component{
    constructor(props) {
        super(props);
        this.parsed = queryString.parse(this.props.location.search);
        this.src = '/lessons/' + this.parsed.id
        this.a = 6;
      }

    render(){
        return (
            <div>
            <h1> {this.parsed.name}</h1>
            <video id="videoPlayer" controls>
            <source src={this.src} type="video/mp4"/>
            </video>
            </div>
          )
    }

}


class Lessons extends React.Component{

    constructor(props) {
        super(props);
        this.state = {showLinks: false, responseData: null}
        this.getlessons = this.getlessons.bind(this);
        this.loadLessonsData = this.loadLessonsData.bind(this);
        this.getlessons();
      }
    
    
      getlessons() {
        return fetch('lessons/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }).then(function(response){
        return response.json();
       }).then((data) =>{
        this.loadLessonsData(data);
       })
      }

    loadLessonsData(data){  
      this.setState({
        responseData: data,
        showLinks: true,
      }); 
    }

    render(){
        const items = []
        if(this.state.showLinks){
            for (const [index, value] of this.state.responseData.entries()) {
                items.push(<a key={index} href={'/video?id='+ value.lessonId + '&name=' + value.lessonName}> {value.lessonName}</a>)
              }
        }

        return (
            <div>
              {items}
            </div>
          )
    }
};


export {
    Video,
    Lessons,
  }