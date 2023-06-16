import "./Remove.css"
import { useEffect, useState } from 'react'
import axios from 'axios'
import useFetch from "../../hooks/useFetch"
import {ToastContainer,toast} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import CustomSelect from "../CustomSelect/CustomSelect"

const RemoveHall = () => {
    const [hall,setHall]=useState("")
    const [hallList,setHallList]=useState()
    const [loading,setLoading]=useState(false)

    const {data}=useFetch("http://192.168.1.135:4000/api/hall/",hall)

    let getToken=JSON.parse(localStorage.getItem("user")) || null
    let token=getToken?.token;

    
    useEffect(()=>{
        let fetch=async()=>{
            let res=await axios.get("http://192.168.1.135:4000/api/hall/")
            let arr=[]
            res.data?.map((item,index)=>{
                arr.push({value:item.name,label:item.name}) 
            })
            setHallList(arr)
        }
        fetch()
    },[hall])

    const handleClick=async()=>{
        setLoading(true)
        try {
            if(!hall){
                setLoading(false)
                toast.error("hall name required",{position:"top-right",autoClose: 2500})
            }else{
                let getHall =data.find((item)=>item.name===hall?.value)
                let id = getHall._id 
                await axios({
                    method: 'delete',
                    url:`http://192.168.1.135:4000/api/hall/${id}`,
                    headers: {
                        accept: 'application/json',
                        token:token
                    }
                })           
                .then(response=>{
                    toast.success('Hall Removed successfully!!!', {
                        className:"toast-success",
                        position: "top-right",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                })
                setHall("")
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
                    <h1 className="removeHead">REMOVE HALL</h1>
                    <span className="removeSpan">Select Hall Name:</span>
                    {/* {data&&<select className="hall" onChange={(e)=>setHall(e.target.value)}>
                        <option ></option>
                        {data.map((item,index)=><option  key={index}>{item.name}</option>)}
                    </select>} */}
                    <CustomSelect
                        option={hallList}
                        selectedOptions={hall}
                        setSelectedOptions={setHall}
                        isSearchable={true}
                        isMulti={false}
                        style={{ marginButtom: "0.5rem" }}
                    />
                    <button className='removeHallBtn' disabled={loading} onClick={handleClick}>Remove Hall</button>
                    <ToastContainer />
                </div>
            </div>
        </div>
    )
}

export default RemoveHall