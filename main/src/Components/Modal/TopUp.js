import React, {useState} from "react";
import "./TopUp.css";
import { redirect, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";



export function GetBalance(gotBalance){
    console.log(gotBalance)
    let balance = gotBalance;
    localStorage.setItem("balance", balance);
}


export function Balance(){
    const [balance, setBalance] = useState(0);
    

    useEffect(() =>{
        var balance = localStorage.getItem("balance");
        setBalance(balance)
        localStorage.setItem("balance", balance);
    },[])

    if(balance === "-1"){
        return(
        <>
            <h1 className="balance">Карта не привязана</h1>
        </>)
    }
    else{
        
        return(
         <>
            <h1 className="balance" >Баланс карты: {balance}</h1>
        </>)
    }
    

}

export function TopUpButton(){
    const [topUp, setTopUp] = useState(false);
    const [cardID, setCardID] = useState(null);
    const [sum, setSum] = useState(0);
    const [user, setUser] = useState(0);
    const navigation = useNavigate();
    const [bonus, setBonus] = useState(0);

    const toggleTopUp = () => {
        setTopUp(!topUp);
        setCardID(localStorage.getItem('cardID'));
        setUser(localStorage.getItem('userId'));
    };

    if(topUp) {
        document.body.classList.add('active-topup')
    } else {
        document.body.classList.remove('active-topup')
    }

    const changeHandlerSum = (event) =>{
        setSum(event.target.value);

        if(event.target.value < 600){
            setBonus(0);
        }

        if(event.target.value >= 600 && event.target.value < 1000){
            setBonus(80);
        } else if(event.target.value >= 1000 && event.target.value < 1500){
            setBonus(200);
        } else if(event.target.value >= 1500 && event.target.value < 2000){
            setBonus(400);
        } else if(event.target.value >= 2000 && event.target.value < 3000){
            setBonus(600);
        } else if(event.target.value >= 3000){
            setBonus(1000);
        }
    }

    function handleSubmit(e){
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        formData.append(
            'userID',
            user 
        );

        formData.append(
            'cardID',
            cardID
        )

        formData.append(
            'topUP',
            sum
        )

        formData.append(
            'bonus',
            bonus
        )

        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);

        fetch('https://127.0.0.1:8443/TopUp',{method: form.method, body:formData , mode: "cors"})
        .then(res => {
            if(res.redirected){
                document.location = res.url;
            }
            fetch('https://127.0.0.1:8443/cardInfo',{method: form.method, body: formData})
            .then(res => res.json())
            .then(data => {
                GetBalance(data[0].balance)
            })
        })
        
        
    }



    return(
        <>
        <button onClick={toggleTopUp} className="btn-topup">Пополнить карту</button>
        {topUp && (
            <div className="pay">
                <div className="pay-overlay"></div>
                <div className="pay-content">
                    <h2>Пополнить игральную карту</h2>
                    <form action="" method="post" onSubmit={handleSubmit}>
                        <p>Номер игральной карты</p>
                        <input className="pay-cardID" placeholder="Номер карты" value={cardID} readOnly="true" style={{backgroundColor: "#9e9d9dcc"}}></input>
                        <p>Cумма пополнения</p>
                        <input type="number" placeholder="Сумма" onChange={changeHandlerSum}></input>
                        <p>Итог: {sum} + бонус {bonus} </p>
                        <button className="payment">Пополнить</button>
                    </form>
                    <button className="close-pay" onClick={toggleTopUp}>&#10006;</button>
                </div>
            </div>     
        )}
        <ToastContainer
            position="top-center"/>
        </>)
}


export default function TopUp(){

}