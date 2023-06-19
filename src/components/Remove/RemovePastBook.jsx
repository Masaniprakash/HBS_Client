import "./Remove.css"
import { useState } from 'react'
import axios from 'axios'
import useFetch from "../../hooks/useFetch"
import {ToastContainer,toast} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

const RemovePastBook = () => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [loading,setLoading]=useState(false)
    const {data}=useFetch("https://hbsserver.cyclic.app/api/hours/")

    let getToken=JSON.parse(localStorage.getItem("user")) || null
    let token=getToken?.token;

    const handleClick=async()=>{
        setLoading(true)
        try {
            if(!fromDate){
                setLoading(false)
                toast.error("From date is required",{position:"top-right",autoClose: 2500})
            }else if(!toDate){
                setLoading(false)
                toast.error("TO date is required",{position:"top-right",autoClose: 2500})
            }else{
                data.map(async(item)=>{
                    await axios({
                        method: 'put',
                        url:`https://hbsserver.cyclic.app/api/hours/deleteThePastBetween/${item._id}`,
                        data:{
                            fromdates:fromDate,
                            todates:toDate,
                        },
                        headers: {
                            accept: 'application/json',
                            token:token
                        }
                    })  
                })         
                
                toast.success('Remove past hours successfully!!!', {
                    className:"toast-success",
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setLoading(false)
            }
        } catch (error) {
            if(error.message==="Request failed with status code 403"){
                toast.error("You are not right person do this", {
                    position: "top-right"
                })
            }
            setLoading(false)
        }
    }
    
    return (
        <div className='removeContainer'>
            <div className="removeWrapper">
                <div className="removeForm">
                    <h1 className="removeHead">REMOVE PAST HOURS</h1>
                    <span className="removeSpan">Select Date From:</span>
                    <input type="date" style={{width:"98%",marginLeft:0}} placeholder="Enter the hall Name"
                        className="dates" value={fromDate} 
                        onChange={(e)=>setFromDate(e.target.value)}
                    />
                    <span className="removeSpan">To Date:</span>
                    <input type="date" style={{width:"98%",marginLeft:0}} placeholder="Enter the hall Name" 
                        className="dates" value={toDate} 
                        onChange={(e)=>setToDate(e.target.value)}
                    />
                    <button className='removeHallBtn' disabled={loading} onClick={handleClick}>Remove Past Hour</button>
                    <ToastContainer />
                </div>
            </div>
        </div>
    )
}

export default RemovePastBook