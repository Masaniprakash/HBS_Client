import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'


const ChangePassword = () => {
    const navigate=useNavigate()
    const [newPassword,setNewPassword]=useState("")
    const [renewPassword,setReNewPassword]=useState("")
    let getToken=JSON.parse(localStorage.getItem("user")) || null
    let token=getToken?.token;

    
    const handleClick=async (e)=>{
        if(!newPassword || !renewPassword){
            return toast.error("All fields are required",{position:"top-right",autoClose: 2500})
        }else{
            if (newPassword===renewPassword){
                await axios({
                    method: 'put',
                    url:"https://hbsserver.cyclic.app/api/auth/changePassword",
                    data: {
                        newpassword:newPassword 
                    },
                    headers: {
                        accept: 'application/json',
                        token:token
                    }
                }).then(response=>{
                    toast.success('Password Changed successfully!!!', {
                        className:"toast-success",
                        position: "top-right",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setTimeout(()=>{
                        navigate("/")
                    },3000)
                }).catch(err=>{
                    toast.error(err.responce.message, {
                    position: "top-right",
                    autoClose: 2500
                });})
            }else{
                toast.error("Password does not match", {
                    position: "top-right",
                    autoClose: 2500
                })
            }
        }
    }
        
   
    return (
        <>
            <Navbar />
            <div className='login'>
                <div className="loginContainer">
                    <h1 className="loginHeading">Change Password</h1>
                    <input type="password" id="password" placeholder='Password' className="loginInput" onChange={(e)=>setNewPassword(e.target.value)} required/>
                    <input type="password" id="repassword" placeholder='Re-enter the password' className="loginInput" onChange={(e)=>setReNewPassword(e.target.value)} required/>
                    <button onClick={handleClick}  className='loginButton'>Change Password</button>  
                    <ToastContainer />            
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ChangePassword;