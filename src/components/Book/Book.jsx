import { faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useEffect } from "react"
import { useState } from "react"
import HallContext from "../../context/HallContext"
import useFetch from '../../hooks/useFetch'
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import "./Book.css"
import {toast , ToastContainer} from "react-toastify" 
import 'react-toastify/dist/ReactToastify.css';
import SkeletonHour from "../Skeleton/SkeletonHour"
import ReasonContext from "../../context/ReasonContext"

const Reserve = ({setOpen,hallId}) => {
    const [hallName,setHallName]=useState("")
    const [loadingBook,setLoadingBook]=useState(false)
    const [success,setSuccess]=useState("")
    const [user,setUser]=useState()
    const [error,setError]=useState("")
    const [selectedHours,setSelectedHours]=useState([])
    const {data,loading}=useFetch(`http://192.168.1.135:4000/api/hall/getHallHours/${hallId}`)

    let getUser=JSON.parse(localStorage.getItem("user")) || null
    let token=getUser?.token;

    useEffect(()=>{
        let fetch=async()=>{
            if(token){
                let res=await axios({
                    method: 'get',
                    url:`http://192.168.1.135:4000/api/auth/token`,
                    headers: {
                        accept: 'application/json',
                        token:token
                    }
                })
                setUser(res.data)
            }            
        }
        fetch()
    },[token])
    
    
    useEffect(()=>{
        const fetch=async()=>{
            let res=await axios.get(`http://192.168.1.135:4000/api/hall/find/${hallId}`) 
            let data=res.data
            setHallName(data.name)
        }
        fetch()
    },[hallId])//remove

    const handleSelect = (e) => {
        const checked = e.target.checked;
        const value = e.target.value;
        // console.log(checked);//if checket it true uncheck false
        // console.log(value);
        setSelectedHours(
            checked
            ? [...selectedHours, value]
            : selectedHours.filter((item) => item !== value)//its unchecked to remove the id
        );
    };
    // console.log(selectedHours);

    let context=useContext(HallContext)
    let reasonContext=useContext(ReasonContext)
    let reason=reasonContext.search.reason
    //to get date
    
    let dates=context.search.date
    let dateArray=[]
    let getTimeDate=new Date(dates).getTime()
    dateArray.push(getTimeDate)
    const isAvailable = (hoursNumber) => {
        const isFound = hoursNumber.unavailableDates
        .some((item)=>dateArray.includes(new Date(item.date)?.getTime()))
        return !isFound;
    };
    const isAvailableName = (hoursNumber) => {
        const isFound = hoursNumber.unavailableDates.some((item)=>dateArray.includes(new Date(item.date)?.getTime()))
        const isFou = hoursNumber.unavailableDates.find((item)=>dateArray.includes(new Date(item.date)?.getTime()))
        if(isFound){
            return `${isFou.name}(${isFou.department})`;
        }
    };

    const navigate = useNavigate();
    const handleClick = async () => {
        setLoadingBook(true)
        try {
            if(getUser===null){
                return navigate("/login")
            }else if(selectedHours.length===0){
                setLoadingBook(false)
                return toast.error("Please Select hour", {position: "top-right"})
            }else{
                let userName=`${user?.name}`
                let dept=`${user?.department}`
                await Promise.all(
                    selectedHours.map(async(hourId) => {
                        const res = axios.put(`http://192.168.1.135:4000/api/hours/availability/${hourId}`, {
                            date:getTimeDate,name:userName,hallName:hallName,department:dept,reason:reason
                        })
                        return res.data;
                    })
                )
            }
            setSuccess("Booking Successfully!!!")
            setTimeout(()=>{
                setLoadingBook(false)
                setOpen(false);
            },1500)
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="reserve">
            <div className="reserveContainer">
                <FontAwesomeIcon  icon={faCircleXmark} className="reserveClose" onClick={ ()=>setOpen(false)} />
                <span>Select the Hours:</span>
                {loading?<SkeletonHour />:data?.map((item,index)=>(
                    <div className="reserveItem" key={index}>
                        {item?.hourNumbers?.map((hourNo,index)=>(
                            <div className="room" key={index}>
                                <label style={{marginTop:"7px"}}>{hourNo?.number}</label>
                                <input type="checkbox" 
                                    value={hourNo?._id} 
                                    disabled={!isAvailable(hourNo)} 
                                    onChange={handleSelect}
                                />
                                <p>{isAvailableName(hourNo)}</p>
                            </div>
                        ))}
                        
                    </div>
                ))}
                <button className="reserveButton"  disabled={loadingBook} onClick={handleClick}>Reserve Now!</button>
                {success && <h3 style={{color:"green",textAlign:"center"}}>{success}</h3>}
                {error && <h3 style={{color:"red",textAlign:"center"}}>{error}</h3>}
                <ToastContainer />
            </div>
        </div>
    )
}

export default Reserve