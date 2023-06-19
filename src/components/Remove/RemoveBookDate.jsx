import './Remove.css'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
// import useFetch from "../../hooks/useFetch"
import Cancel from './Remove'
import CancelDateContext from '../../context/CancelDate'
import CustomSelect from '../CustomSelect/CustomSelect'

const RemoveBookDate = () => {
    const [hallName,setHallName]=useState("")
    const [hallId,setHallId]=useState("")
    const [hallList,setHallList]=useState()
    const [date,setDate]=useState("")
    const [openModal,setOpenModal]=useState(false)
    const [error,setError]=useState("")

    useEffect(()=>{
        let fetch=async()=>{
            let res=await axios.post("https://hbsserver.cyclic.app/api/hall/find",{name:hallName?.value})
            setHallId(res.data?._id)
        }
        fetch()
    },[hallName])

    // const {data}=useFetch("https://hbsserver.cyclic.app/api/hall/")

    
    useEffect(()=>{
        let fetch=async()=>{
            let res=await axios.get("https://hbsserver.cyclic.app/api/hall/")
            let arr=[]
            res.data?.map((item,index)=>{
                arr.push({value:item.name,label:item.name}) 
            })
            setHallList(arr)
        }
        fetch()
    },[])
    

    let context=useContext(CancelDateContext)
    const handleClick=async()=>{
        if(!date || !hallName){
            setError("Please select the hall name or date")
        }else{
            context.search.date=date
            setOpenModal(true)
        }
    }
    
    return (
        <div className='removeContainer'>
            <div className="removeWrapper">
                <div className="removeForm">
                    <h1 className="removeHead">REMOVE BOOKED DATES</h1>
                    <span className="removeSpan">Select Hall Name:</span>
                    {/* {data&&<select className="hall" onChange={(e)=>setHallName(e.target.value)}>
                        <option ></option>
                        {data.map((item,index)=><option  key={index}>{item.name}</option>)}
                    </select>}   */}
                    <CustomSelect
                        option={hallList}
                        selectedOptions={hallName}
                        setSelectedOptions={setHallName}
                        isSearchable={true}
                        isMulti={false}
                        style={{ marginButtom: "0.5rem" }}
                    />
                    <span className="removeSpan">Select Date</span>
                    <div className="select">
                        <input type="date" 
                            className='date' 
                            // min={disablePastDate()}
                            style={{width:"100%"}}
                            onChange={(e)=>setDate(e.target.value)}
                        />
                    </div>
                    <button className='removeHallBtn' onClick={handleClick}>Remove Booked Date</button>
                    {error && <p style={{textAlign:"center",color:"red"}}>{error}</p>}
                    {openModal && <Cancel setOpen={setOpenModal} hallId={hallId}/>}
                </div>
            </div>
        </div>
    )
}

export default RemoveBookDate