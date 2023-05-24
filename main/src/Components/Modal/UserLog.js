import React, { useEffect, useState } from "react";
import "./UserLog.css"
import { Link, useNavigate } from "react-router-dom";
import { State } from "../../App";

let name = " "


export function User(gotName){
    name = gotName;
    localStorage.setItem("userName", name);
    console.log(name);
    
}



export default function UserLog() {
    const [exit, setExit] = useState(false);
    const navigation = useNavigate();
    const [user, setUser] = useState(null);
    

    

    const toggleExit = () =>{
        setExit(!exit);
        State(false);
        localStorage.clear();
        navigation("/", {replace: true});
    }

    if(exit){
        document.body.classList.add('active-exit');
    } else{
        document.body.classList.remove('active-exit');
    }

    useEffect(() => {
        var name1 = localStorage.getItem("userName");
        setUser(name1);
        localStorage.setItem("userName", name1 );
    }, [])


    

    


    return(
    <>
        <button onClick={toggleExit} className="btn-exit">
        Выйти
        </button>

        
        <h1 className="user" >Здравствуйте, {user}!</h1>
        
        
        
    </>
    );

}