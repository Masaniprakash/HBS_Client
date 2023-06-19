import  { useContext } from 'react'
import './Login.css'
import { useState } from 'react'
import {AuthContext} from "../../context/AuthContext"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {toast,ToastContainer} from "react-toastify"
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'

const Login = () => {   
    const navigate=useNavigate()
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const {loading,dispatch}=useContext(AuthContext)//if want error add this

    const handleClick=async (e)=>{
        try {
            if(!email && !password){
                toast.error("please enter email and password", {
                    position: "top-right",
                })
            }else if(!password){
                toast.error("please enter password", {
                    position: "top-right",
                })
            }else if(!email){
                toast.error("please enter email", {
                    position: "top-right",
                })
            }else if(email && password){
                dispatch({type:"LOGIN_START"})
                const res=await axios.post("https://hbsserver.cyclic.app/api/auth/login",{
                    email,
                    password
                })
                dispatch({type:"LOGIN_SUCCESS",payload:res?.data})
                toast.success("Login successfull!!!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
                setTimeout(()=>{
                    navigate(-1)
                },3000)
            }
        } catch (error) {
            dispatch({type:"LOGIN_FAILURE",payload:error.response.data.message})
            toast.error(error.response.data.message, {
                position: "top-right",
            })
        }
        
    }
    return (
        <>
            <Navbar />    
            <div className='login'>
                <div className="loginContainer">
                    <h1 className="loginHeading">LOGIN</h1>
                    <input type="email" id='email' placeholder='Email' className="loginInput" 
                        onChange={(e)=>setEmail(e.target.value.toLowerCase())} required
                    />
                    <input type="password" id="password" placeholder='password' className="loginInput" 
                        onChange={(e)=>setPassword(e.target.value)} required
                    />
                    <button onClick={handleClick} disabled={loading} className='loginButton'>Login</button>
                    <ToastContainer />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Login