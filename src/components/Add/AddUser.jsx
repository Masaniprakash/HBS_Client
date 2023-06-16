import "./Add.css"
import { useState } from 'react'
import axios from 'axios'
import {ToastContainer,toast} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import CustomSelect from "../CustomSelect/CustomSelect";
import departments from "../../data/department";

const AddUser = () => {
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [loading,setLoading]=useState(false)
    const [department,setDepartment]=useState("")
    const [password,setPassword]=useState("12345678")
    let getToken=JSON.parse(localStorage.getItem("user")) || null
    let token=getToken?.token;

    const handleClick=async()=>{
        setPassword("12345678")
        setLoading(true)
        try {
            if(!name || !email || !department){
                toast.error('All fields are required', {
                    className:"toast-success",
                    position: "top-right",
                    autoClose: 2500,
                });
                setLoading(false)
            }else{
                await axios({
                    method: 'post',
                    url:"http://192.168.1.135:4000/api/auth/",
                    data:{
                        name,
                        email,
                        department:department?.value,
                        password
                    },
                    headers: {
                        accept: 'application/json',
                        token:token
                    }
                })
                .then(response=>{
                    toast.success('Department added successfully!!!', {
                        className:"toast-success",
                        position: "top-right",
                        autoClose: 2500,
                    });
                })
                setEmail("")
                setName("")
                setDepartment("")
                setLoading(false)
            }
        }catch(err){
            toast.error(err.response.data.message, {
                position: "top-right",
                autoClose: 2500,
            })
            setLoading(false)
        }
    }
    
    return (
        <div className='addContainer'>
            <div className="addWrapper">
                <div className="addForm">
                    <h1 className="addHead">ADD DEPARTMENT</h1>
                    <span className="addSpan">Name:</span>
                    <input className="addInput" value={name} type="text" id="name" 
                        onChange={(e)=>setName(e.target.value)} required 
                    />
                    <span className="addSpan">Department:</span>
                    <CustomSelect
                        option={departments}
                        selectedOptions={department}
                        setSelectedOptions={setDepartment}
                        isSearchable={true}
                        isMulti={false}
                        placeholder={"Select the Department"}
                        style={{ marginButtom: "0.5rem" }}
                    />
                    <span className="addSpan">Email:</span>
                    <input className="addInput" value={email} style={{textTransform:"lowercase"}} type="email" 
                        id="email" onChange={(e)=>setEmail(e.target.value.toLowerCase())} required />
                   <button className='addHallBtn' 
                        disabled={loading}
                        onClick={handleClick}
                    >
                        Add Department
                    </button>
                    <ToastContainer />
                </div>
            </div>
        </div>
    )
}

export default AddUser