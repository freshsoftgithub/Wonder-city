import React, { useState, useEffect } from "react";
import "./Reserv.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export function ReservForm(){
    const [user,setUser] = useState(null);
    const [email, setEmail] = useState(null);
    const [id, setId] = useState(null);
    const [phone, setPhone] = useState(null);
    const [count, setCount] = useState(5);
    const [date, setDate] = useState();
    const [price, setPrice] = useState(1500);
    const [time, setTime] = useState("10:00");
    const [hours, setHours] = useState(1);
    const navigation = useNavigate();

    const current = new Date();
    const day = current.getDate() + 1;
    const month = current.getDay();
    const year = current.getFullYear();
    let data = year + "-" + month + "-" + day;
    
    console.log(data);



    useEffect(() => {
        var userName = localStorage.getItem("userName");
        setUser(userName);
        localStorage.setItem("userName", userName );
        var userEmail = localStorage.getItem("userEmail");
        setEmail(userEmail);
        localStorage.setItem("userEmail", userEmail);
        var userPhone = localStorage.getItem("userPhone");
        setPhone(userPhone);
        localStorage.setItem("userPhone", userPhone);
        var userId = localStorage.getItem("userId");
        setId(userId);
        localStorage.setItem("userId", userId);
    }, [])

    const changeHandlerPhone = (event) => {
        setPhone(event.options.value);
    };

    const changeHandlerName = (event) => {
        setUser(event.target.value);
        
    };

    const changeHandlerDate = (event) => {
        let parametr = event.target.value;
        setDate(parametr) 
    }

   
    const changeHandlerCount = (event) => {
        let a = Number(event.target.value)
        console.log(a);
        setCount(a);
        console.log(count);
    };


    const changeHandlerTime = (event) =>{
        setTime(event.target.value);
        console.log(time);
    }

    const changeHandlerHours = (event) =>{
        let parametr = event.target.value;
        let price_for_hour = 1500;
        if(parametr > hours){
            let different = parametr - hours
            setPrice(price + price_for_hour*different)
        } else if(hours > parametr){
            let different = hours - parametr
            setPrice(price - price_for_hour* different)
        }
        setHours(event.target.value)
    }

    const toggle = () =>{
        navigation("/user", {replace: true});
    }

    function handleSubmit(e){
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        formData.append(
            'userID',
            id
        );

        formData.append(
            'name',
            user
        );

        formData.append(
            'email',
            email
        );

        formData.append(
            'phone',
            phone
        )

        formData.append(
            'people',
            count
        )

        formData.append(
            'time',
            time
        )

        formData.append(
            'hours',
            hours
        )

        formData.append(
            'date',
            date
        )

        formData.append(
            'price',
            price
        )

        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);

       var response = fetch('https://127.0.0.1:8443/reserv', { method: form.method, body: formData})
       .then(res => res.json())
       .then(data => {
           toast.success("Заявка создана, ожидайте звонка администратора.",{
            position:"top-center"})
        })
  
    }

    

    return(
    <>
    <div className="reserv-form">
        <div className="request">
        <div className="info">
            <h2><button className="back" onClick={toggle}>Назад</button>Информация</h2>
            <ul className="list">Вас ожидает:
                <li>Больше 15 батутов,</li>
                <li>Стена скалолаза,</li>
                <li>Поролоновая яма,</li>
                <li>Надувная подушка,</li>
                <li>Комната для праздника,</li>
                <li>Бесплатные напитки из бара</li>
            </ul>

        </div>
            <form action="" method="post" onSubmit={handleSubmit}>
                <h2>Бронь</h2>
                <p>Ваше имя</p>
                <input value={user} onChange={changeHandlerName} readOnly="true" style={{backgroundColor: "#9e9d9dcc"}}></input>
                <p>Телефон</p>
                <input value={phone} onChange={changeHandlerPhone}></input>
                <p>Дата посещения</p>
                <input type="date" min="2023-05-31" onChange={changeHandlerDate}></input>
                <p>Выберите время</p>
                <select value={time} onChange={changeHandlerTime}>
                    <option value={"10:00"}>10:00</option>
                    <option value={"11:00"}>11:00</option>
                    <option value={"12:00"}>12:00</option>
                    <option value={"13:00"}>13:00</option>
                    <option value={"14:00"}>14:00</option>
                    <option value={"15:00"}>15:00</option>
                    <option value={"16:00"}>16:00</option>
                    <option value={"17:00"}>17:00</option>
                </select>
                <p>Количество часов брони</p>
                <select value={hours} onChange={changeHandlerHours}>
                    <option value={1}>1 час</option>
                    <option value={2}>2 часа</option>
                    <option value={3}>3 часа</option>
                    <option value={4}>4 часа</option>
                    <option value={5}>5 часов</option>
                </select>
                <p>Количество человек</p>
                <select value={count} onChange={changeHandlerCount}>
                    <option value={5}>5</option>
                    <option value={6}>6</option>
                    <option value={7}>7</option>
                    <option value={8}>8</option>
                    <option value={9}>9</option>
                    <option value={10}>10</option>
                    <option value={11}>11</option>
                    <option value={12}>12</option>
                    <option value={13}>13</option>
                    <option value={14}>14</option>
                    <option value={15}>15</option>
                </select>
                <p className="price">Стоимость: {price}₽</p>       
                <button className="request-apply">Забронировать</button>
            </form>
        </div>
        <ToastContainer 
            position="top-center"/>
    </div>
    
    
    </>)


}



export default function Reserv(){
    const [reserv, setReserv] = useState(false);
    const navigation = useNavigate();

    const toggleReserv = () => {
        setReserv(!reserv);
        navigation("/user/reserv", {replace: true});
        window.location.reload();
    };

    if(reserv) {
        document.body.classList.add('active-reserv')
    } else {
        document.body.classList.remove('active-reserv')
    }



    return(
        <>
        <button onClick={toggleReserv} className="btn-reserv">Бронь мероприятий</button>
        </>)
}