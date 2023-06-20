import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import CancelDateContext from '../../context/CancelDate'
import RemoveTheirBooking from '../../components/RemoveTheirBooking/RemoveTheirBooking'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import CustomSelect from '../../components/CustomSelect/CustomSelect'

const CancelTheirBooking = () => {
    const [hallName,setHallName]=useState("")
    const [hallId,setHallId]=useState("")
    const [hallList,setHallList]=useState()
    const [date,setDate]=useState("")
    const [openModal,setOpenModal]=useState(false)
    const [error,setError]=useState("")

    useEffect(()=>{
        let fetch=async()=>{
            let res=await axios.post("https://hbsserver.cyclic.app/api/hall/find",{name:hallName?.value})
            // console.log(res.data?._id)
            setHallId(res.data?._id)
        }
        fetch()
    },[hallName])
    
    useEffect(()=>{
        let fetch=async()=>{
            let res=await axios.get("https://hbsserver.cyclic.app/api/hall/")
            let arr=[]
            res.data?.map((item)=>{
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
        setTimeout(() => {
            setError("")
        }, 2000);
    }

    const disablePastDate = () => {
        const today = new Date();
        const dd = String(today.getDate() ).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        const yyyy = today.getFullYear();
        return yyyy + "-" + mm + "-" + dd;
    };
    
    return (
        <div>
        <Navbar />
        <div className='removeContainer' style={{minHeight: "calc(100vh - 190px)"}}>
            <div className="removeWrapper">
                <div className="removeForm">
                    <h1 className="removeHead">CANCEL THEIR BOOKED DATES</h1>
                    <span className="removeSpan">Select Hall Name:</span>
                    {/* {hallList&&<select className="hall" onChange={(e)=>setHallName(e.target.value)}>
                        <option ></option>
                        {console.log(hallList)}
                        {hallList.map((item,index)=><option  key={index}>{item.value}</option>)}
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
                            min={disablePastDate()}
                            style={{width:"100%"}}
                            onChange={(e)=>setDate(e.target.value)}
                        />
                    </div>
                    <button className='removeHallBtn' onClick={handleClick}>Remove Booked Date</button>
                    {error && <p style={{textAlign:"center",color:"red"}}>{error}</p>}
                    {openModal && <RemoveTheirBooking setOpen={setOpenModal} hallId={hallId} date={date} />}
                </div>
            </div>
        </div>
        <Footer />
        </div>
    )
}

export default CancelTheirBooking