import "./App.css"
import React, { useEffect, useState } from "react";
import Log from "./Components/Modal/Log";
import Registration from "./Components/Modal/Registration";
import UserLog from "./Components/Modal/UserLog";
import { Route, Routes} from "react-router-dom";
import Reserv, { ReservForm} from "./Components/Modal/Reserv";
import Profile, {ButtonProfile} from "./Components/Modal/Profile";
import { Balance, TopUpButton } from "./Components/Modal/TopUp";


export function State(state){
  let log = state;
  
}



function App(){ 
  
    
    return(
      <>   
      <Routes>
        <Route path="/" element={<><Registration /><Log /></>}/>
        <Route path="/user" element={<><UserLog /> <ButtonProfile/> <Reserv/> <TopUpButton/> <Balance/></>}/>
        <Route path="/user/profile" element={<><Profile/> <UserLog/> <Reserv/> <Balance/></>}/>
        <Route path="/user/reserv" element={<><ReservForm/> <UserLog /> <Balance/></>}/>
      </Routes>    
      </>  );
  
}


export default App;
