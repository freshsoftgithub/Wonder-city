import React, { useState } from "react";
import "./Registration.css"
import { User } from "./UserLog";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserInfo } from "./Profile";
import { State } from "../../App";
import { GetBalance } from "./TopUp";


export function UserFromReg(userID,email,name,phone,cardID){
  User(name);
  UserInfo(email,name,phone,userID,cardID);
}


export default function Registration()  { 
  const [registr, setregist] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [userID, setUserID] = useState(0);
  const [code, setCode] = useState(0);
  const navigation = useNavigate();

  const toggleConfirm = () =>{
    setConfirm(!confirm);
  }

  const toggleModal = () => {
    setregist(!registr);
  };


  if(registr) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }

  if(confirm){
    document.body.classList.add('actove-confirm')
  } else {
    document.body.classList.remove('actove-confirm')
  }
  
  const [mail, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [name, setName] = useState(null);
  const cardID = '-'

  const changeHandlerEmail = (event) => {
    setEmail(event.target.value);
  };
  
  const changeHandlerPassword = (event) => {
    setPassword(event.target.value);
  };

  const changeHandlerName = (event) => {
    setName(event.target.value);
  };

  const changeHandlerCode = (event) =>{
    setCode(event.target.value);
  }



  function handleSubmit(e){
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    formData.append(
      'email',
      mail
    );

    formData.append(
      'password',
      password
    );

    formData.append(
      'name',
      name
    )

    formData.append(
      'cardID',
      cardID
    )
    
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    

    var response = fetch('https://127.0.0.1:8443/userRegistration', {method: form.method, body: formData})
    .then(res => res.json())
    .then(data => {
      if(data === "Err"){
      toast.error("Аккаунт с данной почтой уже существует.",{
        position:"top-center"})
        
      }
      else{
        UserFromReg(data[0].userID, data[0].email,data[0].name, data[0].phone,data[0].cardID);
        GetBalance(-1);
        setUserID(data[0].userID)
        toggleModal();
        toggleConfirm();
        
      }
    })
  }

  function handleSubmitCode(e){
    e.preventDefault()

    const form = e.target;
    const formData = new FormData(form);

    formData.append(
      'userID',
      userID
    )

    formData.append(
      'approveCode',
      code
    )

    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);

    fetch('https://127.0.0.1:8443/confirm', {method: form.method, body: formData})
    .then(res => res.json())
    .then(data => {
      if(data === 'Wrong code'){
        toast.error("Неверный код",{
          position:"top-center"
        })
      } else{
        navigation("/user", {replace: true});
      }
    })


  }

  return (
    <>
      <button onClick={toggleModal} className="btn-modal">
        Зарегистрироваться
      </button>
      
      {registr && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h2>Регистрация</h2>
            <form action="" method="post" onSubmit={handleSubmit}>
                <input type="email" id="mail" placeholder="Почта" onChange={changeHandlerEmail}></input>
                <input type="password"id="password" placeholder="Пароль" onChange={changeHandlerPassword}></input>
                <input type="text" id="name" placeholder="Имя" onChange={changeHandlerName}></input>
                <button className="registration">Зарегистрироваться</button>                                          
            </form>   
            <button className="close-modal" onClick={toggleModal}>&#10006;
            </button>             
          </div> 
          <ToastContainer 
            position="top-center"/>
        </div>
      )}

      {confirm && (
        <div className="confirm">
          <div className="overlay"/>
          <div className="confirm-content">
            <h2>Подтвердите Аккаунт</h2>
            <form action="" method="post" onSubmit={handleSubmitCode}>
              <p>На вашу почту был отправлен код.</p>
              <input placeholder="Код" onChange={changeHandlerCode}></input>
              <button className="confirm-code">Подтвердить</button>
            </form>
          </div>
          <ToastContainer 
            position="top-center"/>
        </div>
      )}
    </>
  );
}


