import React, { useState, useEffect } from "react";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { GetBalance } from "./TopUp";


let parametr = '-';

export function UserInfo(gotEmail,gotName,gotPhone, gotId, gotCardId){
    let name = gotName;
    localStorage.setItem("userName", name);
    let email = gotEmail;
    localStorage.setItem("userEmail", email);
    let phone = gotPhone;
    localStorage.setItem("userPhone", phone);
    let id = gotId;
    localStorage.setItem("userId", id);
    let cardId = gotCardId
    localStorage.setItem("cardID", cardId);
}

function CardInfo(gotCardId){
    let cardId = gotCardId
    localStorage.setItem("cardID", cardId);
    
}

function InfoFromServer(gotEmail,gotName,gotPhone,gotId){
    let name = gotName;
    localStorage.setItem("userName", name);
    let email = gotEmail;
    localStorage.setItem("userEmail", email);
    let phone = gotPhone;
    localStorage.setItem("userPhone", phone);
    let id = gotId;
    localStorage.setItem("userId", id);
}

export function ButtonProfile(){
    const [profile, setProfile] = useState(false);
    const navigation = useNavigate();

    const showProfile = () =>{
        setProfile(!profile);
        navigation("/user/profile", {replace: true});
    }
    if(profile) {
        document.body.classList.add('active-profile')
    } else {
        document.body.classList.remove('active-profile')
    }

    return(
    <>
        <button onClick={showProfile} className="btn-profile">Профиль</button>
    
    </>)
}

export default function Profile(){
    const [mail, setMail] = useState(null);
    const [user, setUser] = useState(null);
    const [userPhone, setUserPhone] = useState(null);
    const [userId, setUserID] = useState(0);
    const [cardID, setCardID] = useState();
    const navigation = useNavigate();
    const [show, setShow] = useState(true);
    const [cardShow, setCardShow] = useState(true);

    const toggleCard = () =>{
        setCardShow(!cardShow);
    }


    const toggle = () =>{
        setShow(!show);   
    }

    const close_profile = () =>{
        navigation("/user", {replace: true});
    }

    const changeHandlerPhone = (event) => {
        setUserPhone(event.target.value);
    };

    const changeHandlerEmail = (event) => {
        setMail(event.target.value);
    };

    const changeHandlerName = (event) => {
        setUser(event.target.value);
    };

    const changeHandlerCardID = (event) => {
        setCardID(event.target.value);
        parametr = event.target.value;
    }

    useEffect(() => {
        var userName = localStorage.getItem("userName");
        setUser(userName);
        localStorage.setItem("userName", userName );
        var userEmail = localStorage.getItem("userEmail");
        setMail(userEmail);
        localStorage.setItem("userEmail", userEmail);
        var userPhone = localStorage.getItem("userPhone");
        setUserPhone(userPhone);
        localStorage.setItem("userPhone", userPhone);
        var userId = localStorage.getItem("userId");
        setUserID(userId);
        localStorage.setItem("userId", userId);
        var cardID = localStorage.getItem("cardID");
        setCardID(cardID);
        localStorage.setItem("cardID", cardID);
    }, [])

    function handleSubmit(e){
       e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        formData.append(
            'userID',
            userId
        )

        formData.append(
          'email',
          mail
        );

        formData.append(
          'name',
           user
        );

        formData.append(
           'phone',
           userPhone
        );
    
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);

        fetch('https://127.0.0.1:8443/userProfile', {method: form.method, body: formData})
        .then(res => res.json())
        .then(data => {   
                 toast.success("Все изменения сохранены.",{
                    position:"top-center"
                 })
                 InfoFromServer(data[0].email,data[0].name, data[0].phone,data[0].userID)      
        })
        toggle();
    }

    function handleSubmitCard(e){
        e.preventDefault()

        const form = e.target;
        const formData = new FormData(form);
        console.log(cardID);

        let card;

        if(cardID != ''){
            card = cardID;
        } else if(cardID === ''){
            card = '-'
        }


        formData.append(
            'userID',
            userId
        )

        formData.append(
            'cardID',
            card
        )
        
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);

        fetch('https://127.0.0.1:8443/saveCard',{method: form.method, body: formData})
        .then(res => res.json())
        .then(data => {
            if(data === "Err"){
                toast.error("Неверный номер карты",{
                    position:"top-center"}) 
                    //GetBalance(-1);
            } else if(data === "OK"){
                toast.success("Карта отвязана.",{
                    position:"top-center"
                })
                CardInfo('-');
                GetBalance(-1);
                window.location.reload();
            } else if(data === "Already used"){
                toast.warn("Карта уже используется другим человеком.",{
                    position:"top-center"
                })
            } else {
                toast.success("Все изменения сохранены.",{
                    position:"top-center"}) 
                    CardInfo(data[0].cardID);
                    GetBalance(data[0].balance);
                    window.location.reload();
            }
        })
        toggleCard();

    }

    return(
    <>

    
    <div className="Profile">
        <div className="profile_form">
            <form action=" " method="post" onSubmit={handleSubmit}>
                <h2>Профиль</h2>
                <p>Почта</p>
                <input type="email" onChange={changeHandlerEmail} value={mail} readOnly={show} style={{outline: show ? "none" : ""} && {backgroundColor: show ? "#9e9d9dcc" : ""}}></input>
                <p>Имя</p>
                <input type="text" onChange={changeHandlerName} value={user} readOnly={show} style={{outline: show ? "none" : ""} && {backgroundColor: show ? "#9e9d9dcc" : ""}}></input>
                <p>Телефон</p>
                <input type="tel" id="phone" name="phone" onChange={changeHandlerPhone} value={userPhone} pattern="[0-9]{11}" readOnly={show} style={{outline: show ? "none" : ""} && {backgroundColor: show ? "#9e9d9dcc" : ""}}></input>
                <button className="apply" style={{visibility: show ? "hidden" : "visible"}} >Принять</button> 
            </form> 
            <button className="changeInfo" onClick={toggle} style={{visibility: show ? "visible" : "hidden"}}>Редактировать</button> 
            <form action="" method="post" onSubmit={handleSubmitCard}>
                <h2>Игральная карта</h2>
                <p>Номер игральной карты</p>
                <input type="text" value={cardID} placeholder="-" onChange={changeHandlerCardID}  readOnly={cardShow} style={{outline: show ? "none" : ""} && {backgroundColor: cardShow ? "#9e9d9dcc" : ""}}></input>
                <button className="apply-card" style={{visibility: cardShow ? "hidden" : "visible"}} >Принять</button> 
            </form>
            <button className="changeCard" onClick={toggleCard} style={{visibility: cardShow ? "visible" : "hidden"}}>Редактировать</button>
            <button className="close-profile" onClick={close_profile}>&#8592;
            </button>
        </div>
        <ToastContainer 
            position="top-center"/>
    </div>
    
    
    
    
    
    </>

        
        
    
    );


};