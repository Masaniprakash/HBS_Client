import "./Remove.css"
import { useEffect, useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from "react-toastify"
// import useFetch from "../../hooks/useFetch"
import CustomSelect from "../CustomSelect/CustomSelect"

const RemoveUser = () => {
    const [email, setEmail] = useState("")
    const [emailList, setEmailList] = useState()
    const [loading, setLoading] = useState(false)

    // const { data } = useFetch("https://hbsserver.cyclic.app/api/auth/")
    
    useEffect(()=>{
        let fetch=async()=>{
            let res=await axios.get("https://hbsserver.cyclic.app/api/auth/")
            let arr=[]
            res.data?.map((item)=>{
                arr.push({value:item.email,label:item.email}) 
            })
            setEmailList(arr)
        }
        fetch()
    },[email])

    let getToken = JSON.parse(localStorage.getItem("user")) || null
    let token = getToken?.token;

    const handleClick = async () => {
        setLoading(true)
        try {
            if (!email) {
                setLoading(false)
                toast.error("email required", { position: "top-right", autoClose: 2500 })
            } else {
                await axios({
                    method: 'delete',
                    url: "https://hbsserver.cyclic.app/api/auth/deleteUser",
                    data: {
                        email: email?.value
                    },
                    headers: {
                        accept: 'application/json',
                        token: token
                    }
                })
                    .then(response => {
                        toast.success('Removed Staff successfully!!!', {
                            className: "toast-success",
                            position: "top-right",
                            autoClose: 2500,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    })
                setLoading(false)
                setEmail("")
            }
        } catch (error) {
            if (error.message === "Request failed with status code 403") {
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
                    <h1 className="removeHead">REMOVE DEPARTMENT</h1>
                    <span className="removeSpan">Select Email:</span>
                    {/* {data && <select className="hall" value={email} onChange={(e) => setEmail(e.target.value)}>
                        <option ></option>
                        {data.map((item, index) => <option key={index}>{item.email}</option>)}
                    </select>} */}
                    <CustomSelect
                        option={emailList}
                        selectedOptions={email}
                        setSelectedOptions={setEmail}
                        isSearchable={true}
                        isMulti={false}
                        style={{ marginButtom: "0.5rem" }}
                    />
                    <button className='removeHallBtn' disabled={loading} onClick={handleClick}>Remove Department</button>
                    <ToastContainer />
                </div>
            </div>
        </div>
    )
}

export default RemoveUser