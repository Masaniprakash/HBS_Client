import axios from "axios";
import { useEffect, useState } from "react";
import React from 'react';
import GetBooking from "../GetBooking/GetBooking"

const GetAllBooking = () => {
    const [datas,setDatas]=useState([])

    let getToken=JSON.parse(localStorage.getItem("user")) || null
    let token=getToken?.token;

    useEffect(()=>{
        let fetch=async()=>{
            let res=await axios({
                method: 'get',
                url:"http://192.168.1.135:4000/api/hours/getAllBooking",
                headers: {
                    accept: 'application/json',
                    token:token
                }
            })
            setDatas(res.data)
        }
        fetch()
    },[])
    
    let currentDate=[]
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; 
    let yyyy = today.getFullYear();
    if(dd<10) dd='0'+dd; //because less 10 value add 0 in front
    if(mm<10) mm='0'+mm;
    today = yyyy+'-'+mm+'-'+dd;
    datas.map((get)=>{
        get.hourNumbers.map((item)=>(
            item.unavailableDates.filter((hour)=>{
                if (hour.date?.split("T")[0]>=today){
                    currentDate.push(hour)  
                }
            }          
        ))
    )})
            
    return (
        <GetBooking  data={currentDate} user="admin" action="Get All Current Booking"/>
    )
}

export default GetAllBooking