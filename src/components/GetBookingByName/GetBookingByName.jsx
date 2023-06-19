import {useState,useEffect} from "react";
import useFetch from "../../hooks/useFetch";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import axios from "axios"
import GetBooking from "../GetBooking/GetBooking";

const GetBookingByName = () => {
    const [user,setUser]=useState()

    const {data}=useFetch(`https://hbsserver.cyclic.app/api/hours/`)

    let getUser=JSON.parse(localStorage.getItem("user")) || null
    let token=getUser?.token;

    useEffect(()=>{
        let fetch=async()=>{
            if(!token){
                return null;
            }else{
                try {
                    let res=await axios({
                        method: 'get',
                        url:`https://hbsserver.cyclic.app/api/auth/token`,
                        headers: {
                            accept: 'application/json',
                            token:token
                        }
                    })
                    setUser(res.data)
                } catch (error) {
                    console.log(error.message);
                }
            }
        }
        fetch()
    },[token])

    let userName=`${user?.name}`
    let userDept=`${user?.department}`

    let find=[]
    data?.map((item)=>{
        item.hourNumbers.map((i)=>{
            i.unavailableDates.find((date)=>{
                if(date.name===userName &&date.department===userDept){
                    find.push(date)
                }
            })
        })
    })

    let currentDate=[]
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; 
    let yyyy = today.getFullYear();
    if(dd<10) dd='0'+dd; //because less 10 value add 0 in front
    if(mm<10) mm='0'+mm;
    today = yyyy+'-'+mm+'-'+dd;
    find.map((hour)=>{
        if (hour.date?.split("T")[0]>=today){
            currentDate.push(hour)
        }
    })

    return (
        <div>
            <Navbar />
            <GetBooking data={currentDate} user="normal" action="get booking"/>
            <Footer />
        </div>
    )
}

export default GetBookingByName