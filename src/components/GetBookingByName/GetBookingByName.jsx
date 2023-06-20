import {useState,useEffect} from "react";
import useFetch from "../../hooks/useFetch";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import axios from "axios"
import GetBooking from "../GetBooking/GetBooking";

const GetBookingByName = () => {
    const [user,setUser]=useState()
    const [dataType,setDataType]=useState("current")

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

    let mass=[]
    find.map((item)=>{
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
    find=mass

    return (
        <div>
            <Navbar />
            <GetBooking data={find} user="normal" action="get booking" setDataType={setDataType} dataType={dataType} />
            <Footer />
        </div>
    )
}

export default GetBookingByName