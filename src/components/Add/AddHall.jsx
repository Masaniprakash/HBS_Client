import "./Add.css"
import { useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

const AddHall = () => {
    const [hallName, setHallName] = useState("")
    const [hallNameUrl, setHallNameUrl] = useState("")
    const [loading, setLoading] = useState(false)
    let getToken = JSON.parse(localStorage.getItem("user")) || null
    let token = getToken?.token;
    let photo = "https://thumbs.dreamstime.com/b/empty-conference-hall-18851712.jpg"

    const handleClick = async () => {
        setLoading(true)
        try {
            if (!hallName) {
                toast.error("hall name required", { position: "top-right" })
                setLoading(false)
            } else {
                await axios({
                    method: 'post',
                    url: "http://192.168.1.135:4000/api/hall/",
                    data: {
                        name: hallName,
                        url: hallNameUrl || photo
                    },
                    headers: {
                        accept: 'application/json',
                        token: token
                    }
                })
                    .then(response => {
                        toast.success('Hall added successfully!!!', {
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
                setLoading(false)
            }

        } catch (error) {
            toast.error(error.response.data.message, {
                position: "top-right"
            })
            setLoading(false)
        }
    }

    return (
        <div className='addContainer'>
            <div className="addWrapper">
                <div className="addForm">
                    <h1 className="addHead">ADD HALL</h1>
                    <span className="addSpan">Hall Name:</span>
                    <input className="addInput" type="text" value={hallName}
                        onChange={(e) => setHallName(e.target.value)} required
                    />
                    <span className="addSpan">Hall Image Url:<span style={{ color: "green" }}>(optional)</span></span>
                    <input className="addInput" type="text" value={hallNameUrl}
                        onChange={(e) => setHallNameUrl(e.target.value)}
                    />
                    <button className='addHallBtn' disabled={loading} onClick={handleClick}>Add Hall</button>
                    <ToastContainer />
                </div>
            </div>
        </div>
    )
}

export default AddHall