import axios from "axios";
import { useEffect, useState } from "react";
import React from 'react'
import GetBooking from "../GetBooking/GetBooking"

const GetAllPastBooking = () => {
    const [data,setData]=useState([])
    
    let getToken=JSON.parse(localStorage.getItem("user")) || null
    let token=getToken?.token;

    useEffect(()=>{
        let fetch=async()=>{
            let res=await axios({
                method: 'get',
                url:"https://hbsserver.cyclic.app/api/hours/getAllBooking",
                headers: {
                    accept: 'application/json',
                    token:token
                }
            })
            setData(res.data)
        }
        fetch()
    },[])
    
    let currentDate=[]
    let pastDate=[]
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; 
    let yyyy = today.getFullYear();
    if(dd<10) dd='0'+dd; //because less 10 value add 0 in front
    if(mm<10) mm='0'+mm;
    today = yyyy+'-'+mm+'-'+dd;
    data.map((get)=>{
        get.hourNumbers.map((item)=>(
            item.unavailableDates.filter((hour)=>{
                if (hour.date?.split("T")[0]>=today){
                    currentDate.push(hour)  
                }else{
                    pastDate.push(hour)  
                }
            }          
        ))
    )})
    let mass=[]
    pastDate.map((item)=>{
        let f=false
        mass.map((item2,index)=>{
            if(item.date?.split("T")[0] ===item2.date?.split("T")[0] && item.hallName === item2.hallName && item.name === item2.name){
                f=true
                // if(item2.hourNo?.toString()?.includes(",")){
                //     if(item2.hourNo?.toString()?.split(",").includes(item2.hourNo)){
                        item2.hourNo = item2.hourNo +","+ item.hourNo
                //     } 
                // }
            }
        })
        if(!f) mass.push(item)
    })
    mass.map((item)=>{
        item.hourNo = item.hourNo?.toString()?.split(",")
        if (item.hourNo?.length > 1) item.hourNo = item.hourNo?.sort((a,b)=>a-b)
        item.hourNo = new Set(item.hourNo);
        item.hourNo = [...item.hourNo].join(",");
    })
    pastDate=mass

    
    return (
        <GetBooking data={pastDate} le={pastDate.length} user="admin" action="Get All Past Booking"/>
    )
}

export default GetAllPastBooking