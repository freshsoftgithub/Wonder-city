import React, { useEffect, useState } from "react";
import "./UserLog.css"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

let name = " "

export function Notification(){
    toast.success("Заявка создана, ожидайте звонка администратора.",{
    position:"top-center"})
}


export function User(gotName){
    name = gotName;
    localStorage.setItem("userName", name);
    console.log(name);
    
}



export default function UserLog() {
    const navigation = useNavigate();
    const [user, setUser] = useState(null);

    const toggleExit = () =>{
        //localStorage.clear();
        navigation("/", {replace: true});
    }

    useEffect(() => {
        var userName = localStorage.getItem("userName");
        //if(userName === null || userName === 'null'){
            //navigation("/", {replace: true});
        //}
        setUser(userName);
        localStorage.setItem("userName", userName);
    }, [])


    return(
    <>
        <button onClick={toggleExit} className="btn-exit">
        Выйти
        </button>
              
        <h1 className="user" >Здравствуйте, {user}!</h1>      
        <ToastContainer 
            position="top-center"/>
    </>
    );

}