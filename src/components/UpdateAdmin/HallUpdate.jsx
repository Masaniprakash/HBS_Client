import { useEffect, useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import useFetch from '../../hooks/useFetch';
import CustomSelect from '../CustomSelect/CustomSelect';

const UpdateHall = () => {
    const [hallName, setHallName] = useState("") 
    const [hallNameList, setHallNameList] = useState( )
    const [hallList, setHallList] = useState( )
    const [hallNameUrl, setHallNameUrl] = useState("")
    const [loading, setLoading] = useState(false)
    let id
    let getToken = JSON.parse(localStorage.getItem("user")) || null
    let token = getToken?.token; 

    const {data}=useFetch("http://192.168.1.135:4000/api/hall",hallName)  

    
    useEffect(()=>{
        let fetch=async()=>{
            let res=await axios.get("http://192.168.1.135:4000/api/hall")
            let arr=[]
            res.data?.map((item,index)=>{
                arr.push({value:item.name,label:item.name}) 
            })
            setHallList(arr)
        }
        fetch()
    },[hallName])

    useEffect(() => {
        let fetch = async () => {
            let res = await axios.get(`http://192.168.1.135:4000/api/hall/find/${id}`)
            setHallName(res.data.name)
            setHallNameUrl(res.data.url)    
        }
        if(id){
            fetch()
        } 
    }, [hallNameList]) 

    data?.map((item)=>{
        if(item.name===hallNameList?.value){
            id=item._id 
        }
        return null
    }) 

    const handleClick = async () => {
        setLoading(true)
        try {
            if (!hallName) {
                toast.error("hall name required", { position: "top-right" })
                setLoading(false)
            } else {
                await axios({
                    method: 'put',
                    url: `http://192.168.1.135:4000/api/hall/${id}`,
                    data: {
                        name: hallName,
                        url: hallNameUrl
                    },
                    headers: {
                        accept: 'application/json',
                        token: token
                    }
                })
                    .then(response => {
                        toast.success('Hall updated successfully!!!', {
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
                setHallName("")
                setHallNameUrl("")
                setHallNameList("")
                setLoading(false)
            }

        } catch (error) {
            toast.error(error.response.data.message, {
                position: "top-right"
            })
            setLoading(false)
        }
    }
    console.log(hallNameList);

    return (
        <div className='addContainer'>
            <div className="addWrapper">
                <div className="addForm">
                    <h1 className="addHead">Update HALL</h1>
                    <span className="removeSpan">Select Hall Name:</span>
                    {/* {data&&<select className="hall" value={hallNameList} onChange={(e)=>setHallNameList(e.target.value)}>
                        <option ></option>
                        {data.map((item,index)=><option   key={index}>{item.name}</option>)}
                    </select>} */}
                    <CustomSelect
                        option={hallList}
                        selectedOptions={hallNameList}
                        setSelectedOptions={setHallNameList}
                        isSearchable={true}
                        isMulti={false}
                        style={{ marginButtom: "0.5rem" }}
                    />
                    {hallNameList && 
                        <>
                            <span className="addSpan">Hall Name:</span>
                            <input className="addInput" type="text" value={hallName} onChange={(e) => setHallName(e.target.value)} required />
                            {/* <span className="addSpan">Hall Image Url:<span style={{ color: "green" }}>(optional) </span></span>
                            <input className="addInput" type="text" value={hallNameUrl} onChange={(e) => setHallNameUrl(e.target.value)} /> */}
                            <button className='addHallBtn' disabled={loading} onClick={handleClick}>Update Hall</button>
                        </>
                    }
                    <ToastContainer />
                </div>
            </div>
        </div>
    )
}

export default UpdateHall