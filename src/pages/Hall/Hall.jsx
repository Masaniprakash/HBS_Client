import './Hall.css'
import { useState ,useContext} from 'react'
import Footer from '../../components/Footer/Footer'
import Navbar from '../../components/Navbar/Navbar'
import { useLocation } from 'react-router-dom'
import useFetch from '../../hooks/useFetch'
import Book from '../../components/Book/Book'
import HallContext from "../../context/HallContext"
import {ToastContainer,toast} from "react-toastify"
// import axios from 'axios'
import ReasonContext from '../../context/ReasonContext'

const Hall = () => {
    const [openModal,setOpenModal]=useState(false)
    const [date,setDate]=useState(undefined)
    const [reason,setReason]=useState(undefined)
    // const [hallHourId,setHallHourId]=useState([])
    let photo=`https://images.unsplash.com/photo-1595769816263-9b910be24d5f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjh8fGxlY3R1cmUlMjBoYWxsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60`

    const location=useLocation()
    //{pathname: '/hotels/62cd3e326369834f9b31e9d2', search: '', hash: '', state: null, key: 'sovke39w'}
    // we want id split path as /
    let split=location.pathname.split("/")
    // console.log(split);//['', 'hotels', '62cd3e326369834f9b31e9d2'] we take the last one 
    let iNo=split.length-1// console.log(iNo);//ino=3 -1 = 2 so inois 2 we take the last one 
    const id=split[iNo]

    const {data}=useFetch(`https://hbsserver.cyclic.app/api/hall/find/${id}`)
    // console.log(data?.hours[0]);
    // useEffect(()=>{
    //     let set=()=>{
    //         let today = new Date();
    //         let dd = today.getDate();//-1 is for to get previous date
    //         let mm = today.getMonth()+1; 
    //         let yyyy = today.getFullYear();
    //         if(dd<10) dd='0'+dd; //because less 10 value add 0 in front
    //         if(mm<10) mm='0'+mm;
    //         today = yyyy+'-'+mm+'-'+dd;
    //         setHallHourId(data.hours)
    //         hallHourId?.map(async(item)=>{
    //             await axios.put(`https://hbsserver.cyclic.app/api/hours/deleteThePast/${item}`,{
    //                 dates: today,
    //             });
    //         })
    //     }
    //     set()
    // },[data])
    
    let context=useContext(HallContext)
    let reasonContext=useContext(ReasonContext)
    const handleSearch=()=>{
        if (date===undefined) {
            toast.error("Please select the date",{position:"top-right",autoClose: 2500})
        } 
        else if(!reason){
            toast.error("Please enter the reason",{position:"top-right",autoClose: 2500})
        }else {
            setOpenModal(true);
            context.search.date=date
            reasonContext.search.reason=reason
        }
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
            <div className="hallContainer">
                <div className="hallWrapper">
                    <h1 style={{marginTop:3}}>{data?.name}</h1>
                    <div className="imgContainer">
                        <img src={photo} alt="" className='img' />
                    </div>
                    <div className="select">
                        <div className="dateBox">
                        <span style={{marginBottom:10,fontSize:18}}>Select the date:</span>
                        <input type="date" 
                            className='date' 
                            style={{textTransform:"uppercase"}}
                            // min={disablePastDate()}
                            onChange={(e)=>setDate(e.target.value)}
                            placeholder="MM/DD/YYYY"
                        />
                        </div>
                        <div className="reasonBox">  
                        <span style={{marginBottom:10,fontSize:18}}>Enter the reason:</span>
                        <input type="text"
                            className='date'
                            style={{color:"black",fontWeight:"normal",textTransform:"none"}}
                            onChange={(e)=>setReason(e.target.value)}
                        />
                        </div>
                        <button className='bookNow' onClick={handleSearch} >Book Now!</button>
                    </div>
                </div>
                {openModal && <Book setOpen={setOpenModal} hallId={id}/>}
                <ToastContainer />
            </div>
            <Footer />
        </div>
    )
}

export default Hall