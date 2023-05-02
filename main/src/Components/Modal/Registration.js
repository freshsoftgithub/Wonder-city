import React, { useState } from "react";
import "./Registration.css"



export default function Registration()  { 
  const [registr, setregist] = useState(false);

  const toggleModal = () => {
    setregist(!registr);
  };

  if(registr) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }
  
  const [mail, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [name, setName] = useState(null);

  const changeHandlerEmail = (event) => {
    setEmail(event.target.value);
  };
  
  const changeHandlerPassword = (event) => {
    setPassword(event.target.value);
  };

  const changeHandlerName = (event) => {
    setName(event.target.value);
  };

  const [id, setId] = useState(null);

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

    fetch('http://127.0.0.1:8000/user/',
    {
      method: form.method, body: formData
    })
    

    

    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    console.log(id);
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
        </div>
      )}
    </>
  );
}
