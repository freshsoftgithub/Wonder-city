import React, {useState} from "react";
import "./Log.css"

export default function Log() {
    const [log, setLog] = useState(false);
  
    const toggleLog = () => {
      setLog(!log);
    };
  
    if(log) {
      document.body.classList.add('active-log')
    } else {
      document.body.classList.remove('active-log')
    }
    
    const [mail, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

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
  
      const respJson = fetch('http://127.0.0.1:8000/userLogin', {
        method: form.method, body: formData
      }
      
      
      );
  
      const formJson = Object.fromEntries(formData.entries());
      console.log(formJson);
    }

    const changeHandlerEmail = (event) => {
      setEmail(event.target.value);
    };
    
    const changeHandlerPassword = (event) => {
      setPassword(event.target.value);
    };



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
            </div>
            )}
        </>
    );}


    