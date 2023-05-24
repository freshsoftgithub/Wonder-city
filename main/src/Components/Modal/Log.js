import React, {useState} from "react";
import "./Log.css"
import "./Registration.css"
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { User } from "./UserLog";
import { useNavigate } from "react-router-dom";
import { UserInfo } from "./Profile";
import { State } from "../../App";
import { GetBalance } from "./TopUp";


export function UserFromLog(name, email, phone, id, cardID, balance){
  User(name);
  UserInfo(email,name,phone, id,cardID);
  GetBalance(balance);
}


export default function Log() {
    const [log, setLog] = useState(false);
    const [confirm,setConfirm] = useState(false);
    const [code,setCode] = useState(0);
    const [userID, setUserID] = useState(0);
    const navigation = useNavigate();

    const toggleLog = () => {
      setLog(!log);
    };

    const toggleConfirm = () =>{
      setConfirm(!confirm)
    }
  
  
    if(log) {
      document.body.classList.add('active-log')
    } else {
      document.body.classList.remove('active-log')
    }
    
    const [mail, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const changeHandlerEmail = (event) => {
      setEmail(event.target.value);
    };
    
    const changeHandlerPassword = (event) => {
      setPassword(event.target.value);
    };

    const changeHandlerCode = (event) => {
      setCode(event.target.value)
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

      
      const formJson = Object.fromEntries(formData.entries());
      console.log(formJson);
        

      var name = fetch('https://127.0.0.1:8443/userLogin', { method: form.method, body: formData})
      .then(res => res.json())
      .then(data => {
        console.log(data[0]);
        if(data[0].approve === false){
          toast.error("Аккаунт не подтвержден, на вашу почту повторно выслан код",{
          position:"top-center"})
          UserFromLog(data[0].name,data[0].email,data[0].phone, data[0].userID, data[0].cardID, -1);
          setUserID(data[0].userID);
          toggleLog();
          toggleConfirm();
          return;
        } else if(data === "Err"){
          toast.error("Неверный логин или пароль.",{
          position:"top-center"})
        }
        else{
          toast.success("Все верно! :)",{
            position:"top-center"})
            toggleLog(); 
            gotInfo(); 
            return data;
        }

      });

      


      const gotInfo = () => {
        name.then((userName) => {
          let user = userName[0].name
          let userEmail = userName[0].email
          let userPhone = userName[0].phone
          let id = userName[0].userID
          let cardID = userName[0].cardID

          const formDataCard = new FormData();

          formDataCard.append(
           'cardID',
            userName[0].cardID
          );

          formDataCard.append(
            'userID',
            userName[0].userID
          );

          const formJson = Object.fromEntries(formDataCard.entries());
          console.log(formJson);

          console.log(user, userEmail, userPhone, id);
          if(cardID != '-'){
            let response = fetch('https://127.0.0.1:8443/cardInfo', {method: "post", body: formDataCard})
            .then(res => res.json())
            .then(data => {return data})
            response.then((data) =>{
              State(true);
              UserFromLog(user,userEmail,userPhone, id, cardID, data[0].balance);
            })
            navigation("/user", {replace: true});
          }
          else{
            State(true);
            UserFromLog(user,userEmail,userPhone, id, cardID, -1);
            navigation("/user", {replace: true});
          }
          
        })
      }
      
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
  }


    return (
        <>
        
        <button onClick={toggleLog} className="btn-log">
         Войти
        </button>
        
        
        {log && (
            <div className="log">
              <div onClick={toggleLog} className="log-overlay"></div>
                <div className="log-content">
                <h2>Вход</h2>
            <form action="" method="post" onSubmit={handleSubmit}>
                <input type="email" className="mail" placeholder="Почта" onChange={changeHandlerEmail}></input>
                <input type="password" className="password" placeholder="Пароль" onChange={changeHandlerPassword}></input>
                <button className="login">Войти</button>                                            
            </form>
                <button className="close-log" onClick={toggleLog}>&#10006;
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


    