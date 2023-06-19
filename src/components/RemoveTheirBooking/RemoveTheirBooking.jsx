import { faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {  useEffect } from "react"
import { useState } from "react"
import useFetch from '../../hooks/useFetch'
import axios from 'axios'
import { toast,ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import SkeletonHour from "../Skeleton/SkeletonHour"

const RemoveTheirBooking = ({setOpen,hallId,date}) => {
    const [success,setSuccess]=useState("")
    const [user,setUser]=useState()
    const [error,setError]=useState("")
    const [loadingRemove,setLoadingRemove]=useState(false)
    const [selectedHours,setSelectedHours]=useState([])
    const {data,loading}=useFetch(`https://hbsserver.cyclic.app/api/hall/getHallHours/${hallId}`)

    let getUser=JSON.parse(localStorage.getItem("user")) || null
    let token=getUser?.token;

    useEffect(()=>{
        let fetch=async()=>{
            if(token){
                let res=await axios({
                    method: 'get',
                    url:`https://hbsserver.cyclic.app/api/auth/token`,
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

    const handleSelect = (e) => {
        const checked = e.target.checked;
        const value = e.target.value;
        setSelectedHours(
            checked
            ? [...selectedHours, value]
            : selectedHours.filter((item) => item !== value)//its unchecked to remove the id
        );
    };
    let dates=date
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
            if(`${isFou.name}(${isFou.department})`===`${user?.name}(${user?.department})`){
                return `${isFou.name}(${isFou.department})`;
            }
        }
    };

    const handleClick = async () => {
        setLoadingRemove(true)
        console.log(loadingRemove);
        try {
            if(selectedHours.length===0){
                setLoadingRemove(false)
                return toast.error("Please Select hour", {position: "top-right",autoClose: 2500})
            }else{
                await Promise.all(
                    selectedHours.map(async(hourId) => {
                        try {
                            await axios
                            .put(`https://hbsserver.cyclic.app/api/hours/deletetheiravailability/${hourId}`,
                            {dates:dates} 
                            )
                        } catch (error) {
                            toast.error(error.responce.message, {
                                position: "top-right"
                            })
                            
                        }
                        return null
                    })
                    )
                }
                setSuccess("Cancel Their Booking Successfully!!!")
                setTimeout(()=>{
                    setLoadingRemove(false)
                    setOpen(false);
                },1500)
            } catch (err) {
                setError(err.message);
                setLoadingRemove(false)
            }
            setTimeout(()=>{
                setError("")
            },2500)
    };

    return (
        <div className="reserve">
            <div className="reserveContainer">
                <FontAwesomeIcon  icon={faCircleXmark} className="reserveClose" onClick={ ()=>setOpen(false)} />
                <span>Select the Hours to Cancel:</span>
                {loading?<SkeletonHour />:data?.map((item,index)=>(
                    <div className="reserveItem" key={index}>
                        {item?.hourNumbers?.map((hourNo,index)=>(
                            <div className="room" key={index}>
                                <label style={{marginTop:"7px"}}>{hourNo?.number}</label>
                                <input type="checkbox"  
                                    disabled={true}
                                />
                                <p>{isAvailableName(hourNo)}</p>
                                {isAvailableName(hourNo) && 
                                    <input type="checkbox"    
                                        value={hourNo?._id} 
                                        disabled={isAvailable(hourNo)} 
                                        onChange={handleSelect}
                                    />
                                }
                            </div>
                        ))}  
                    </div>
                ))}
                <button className="reserveButton" disabled={loadingRemove} onClick={handleClick}>Cancel Now!</button>
                {success && <p style={{textAlign:"center",color:"green"}}>{success}</p>}
                {error && <p style={{textAlign:"center",color:"red"}}>{error}</p>}
                <ToastContainer />
            </div>
        </div>
    )
}

export default RemoveTheirBooking