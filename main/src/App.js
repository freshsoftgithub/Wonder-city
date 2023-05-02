import "./App.css";
import React from 'react';
import Log from "./Components/Modal/Log";
import Registration from "./Components/Modal/Registration";

class App extends React.Component{
  render(){
    return(
      <>
      <Log/>
      <Registration/>      
      </>   
    );
  }

}

export default App;
