import { useState } from 'react'
import AddHall from '../../components/Add/AddHall'
import AddUser from '../../components/Add/AddUser'
import AdminWaring from '../../components/AdminWarning/AdminWarning'
import Footer from '../../components/Footer/Footer'
import GetAllBooking from '../../components/GetAllBooking/GetAllBooking'
import GetAllPastBooking from '../../components/GetAllPastBooking/GetAllPastBooking'
import Navbar from '../../components/Navbar/Navbar'
import RemoveBookDate from '../../components/Remove/RemoveBookDate'
import RemoveHall from '../../components/Remove/RemoveHall'
import RemovePastBook from '../../components/Remove/RemovePastBook'
import RemoveUser from '../../components/Remove/RemoveUser'
import UpdateHall from '../../components/UpdateAdmin/HallUpdate'
import './Admin.css'

const Admin = () => {
    const [action,setAction]=useState("addUser")

    let getUser=JSON.parse(localStorage.getItem("user")) || null
    let admin=getUser?.isAdmin; 

    return (
        <div className='admin'>
            <Navbar />
            <div style={{minHeight: "calc(100vh-  250px)"}}>
            {admin ? <>
                <div className="adminContainer" style={{position:"sticky",top:"80px",zIndex: 3}}>
                    <div className="adminWrapper">
                        <div className="adminButton">
                            <button className='AdminAddUser' id='AdminAddUser' value="addUser"
                                onClick={(e)=>setAction(e.target.value)}
                            >
                                Add Dept
                            </button>
                            <button className='AdminAddPeriod' value="addHall"
                                onClick={(e)=>setAction(e.target.value)}
                            >
                                Add Hall
                            </button>
                            <button className='AdminGetAll' value="getAllBookedDate" 
                                onClick={(e)=>setAction(e.target.value)}
                            >
                                Get All Current Booking
                            </button>
                            <button className='AdminGetAll' value="getAllPastBookedDate" 
                                onClick={(e)=>setAction(e.target.value)}
                            >
                                Get All Past Booking
                            </button>
                            <button style={{backgroundColor:"orange"}} className='AdminAddPeriod' value="upHall"
                                onClick={(e)=>setAction(e.target.value)}
                            >
                                Update Hall
                            </button>
                            <button className='AdminDeleteUser' value="deleteUser" 
                                onClick={(e)=>setAction(e.target.value)}
                            >
                                Delete Dept
                            </button>
                            <button className='AdminDeleteHall' value="deleteHall" 
                                onClick={(e)=>setAction(e.target.value)}
                            >
                                Delete Hall
                            </button>
                            <button className='AdminDeleteBooked' value="deleteBookedDate" 
                                onClick={(e)=>setAction(e.target.value)}
                            >
                                Cancel Booking
                            </button>
                            <button className='AdminDeleteBooked' value="removePastBooked" 
                                onClick={(e)=>setAction(e.target.value)}
                            >
                                Remove Past Booking
                            </button>
                        </div>
                    </div>
                    
                </div>
                <div className="adminAccess" style={{minHeight:"calc(100vh - 250px)"}}>
                    {action==="addUser" ? <AddUser/>:null}
                    {action==="deleteUser" ? <RemoveUser/>:null}
                    {action==="deleteHall" ? <RemoveHall/>:null}
                    {action==="addHall" ? <AddHall/>:null}
                    {action==="deleteBookedDate" ? <RemoveBookDate/>:null}
                    {action==="upHall" ? <UpdateHall/>:null}
                    {action==="getAllBookedDate" ? <GetAllBooking/>:null}
                    {action==="getAllPastBookedDate" ? <GetAllPastBooking />:null}
                    {action==="removePastBooked" ? <RemovePastBook />:null}
                </div>
                </>:
                <AdminWaring />
            }
            </div>
            <Footer />
        </div>
    )
}

export default Admin