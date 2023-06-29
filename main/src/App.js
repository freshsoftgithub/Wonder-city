import "./App.css"
import React, { useEffect, useState } from "react";
import Log from "./Components/Modal/Log";
import Registration from "./Components/Modal/Registration";
import UserLog from "./Components/Modal/UserLog";
import { Route, Routes} from "react-router-dom";
import Reserv, { ReservForm} from "./Components/Modal/Reserv";
import Profile, {ButtonProfile} from "./Components/Modal/Profile";
import { Balance, TopUpButton } from "./Components/Modal/TopUp";



function App(){ 
  
    
    return(
      <>   
      <Routes>
        <Route path="/" element={<><Registration /><Log /></>}/>
        <Route path="/user" element={<><UserLog /> <ButtonProfile/> <Reserv/> <TopUpButton/> <Balance/></>}/>
        <Route path="/user/profile" element={<><UserLog/> <Profile/>  <Reserv/> <Balance/></>}/>
        <Route path="/user/reserv" element={<><UserLog /><ReservForm/>  <Balance/></>}/>
      </Routes>    
      </>  );
  
}


export default App;
