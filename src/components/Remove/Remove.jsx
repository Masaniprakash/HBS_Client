import { faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useEffect } from "react"
import { useState } from "react"
import useFetch from '../../hooks/useFetch'
import axios from 'axios'
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import CancelDateContext from "../../context/CancelDate"
import SkeletonHour from "../Skeleton/SkeletonHour"

const Reserve = ({ setOpen, hallId }) => {
    const [hallName, setHallName] = useState("")
    const [success, setSuccess] = useState("")
    const [loadingRemove, setLoadingRemove] = useState(false)
    const [user, setUser] = useState()
    const [error, setError] = useState("")
    const [selectedHours, setSelectedHours] = useState([])
    const { data, loading } = useFetch(`https://hbsserver.cyclic.app/api/hall/getHallHours/${hallId}`)

    let getUser = JSON.parse(localStorage.getItem("user")) || null
    let token = getUser?.token;


    useEffect(() => {
        let fetch = async () => {
            if (token) {
                let res = await axios({
                    method: 'get',
                    url: `https://hbsserver.cyclic.app/api/auth/token`,
                    headers: {
                        accept: 'application/json',
                        token: token
                    }
                })
                setUser(res.data)
            }
        }
        fetch()
    }, [token])

    useEffect(() => {
        const fetch = async () => {
            let res = await axios.get(`https://hbsserver.cyclic.app/api/hall/find/${hallId}`)
            let data = res.data
            setHallName(data.name)
        }
        fetch()
    }, [hallId])//remove

    const handleSelect = (e) => {
        const checked = e.target.checked;
        const value = e.target.value;
        setSelectedHours(
            checked
                ? [...selectedHours, value]
                : selectedHours.filter((item) => item !== value)//its unchecked to remove the id
        );
    };
    let context = useContext(CancelDateContext)
    let dates = context.search.date
    let dateArray = []
    let getTimeDate = new Date(dates).getTime()
    dateArray.push(getTimeDate)
    const isAvailable = (hoursNumber) => {
        const isFound = hoursNumber.unavailableDates
            .some((item) => dateArray.includes(new Date(item.date)?.getTime()))
        return !isFound;
    };
    const isAvailableName = (hoursNumber) => {
        const isFou = hoursNumber.unavailableDates.find((item) => dateArray.includes(new Date(item.date)?.getTime()))
        if (isFou) {
            return `${isFou.name}(${isFou.department})`;

        }
    };

    const handleClick = async () => {
        setLoadingRemove(true)
        try {
            if (selectedHours.length === 0) {
                setLoadingRemove(false)
                return toast.error("Please Select hour", { position: "top-right", autoClose: 2500 })
            } else {
                let dept = `${user?.department}`
                await Promise.all(
                    selectedHours.map(async (hourId) => {
                        try {
                            await axios({
                                method: 'put',
                                url: `https://hbsserver.cyclic.app/api/hours/deleteavailability/${hourId}`,
                                data: {
                                    dates: dates
                                },
                                headers: {
                                    accept: 'application/json',
                                    token: token
                                }
                            })
                            await axios.put(`https://hbsserver.cyclic.app/api/hours/availability/${hourId}`, {
                                date: getTimeDate, name: user?.name, hallName: hallName, department: dept, reason: "cancel by admin"
                            })

                        } catch (error) {
                            toast.error(error.responce.message, {
                                position: "top-right"
                            })
                            setLoadingRemove(false)
                        }
                        return null
                    })
                )
            }
            setSuccess("Cancel and Booking Successfully!!!")
            setTimeout(() => {
                setLoadingRemove(false)
                setOpen(false);
            }, 1500)
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="reserve">
            <div className="reserveContainer">
                <FontAwesomeIcon icon={faCircleXmark} className="reserveClose" onClick={() => setOpen(false)} />
                <span>Select the Hours to Cancel:</span>
                {loading ? <SkeletonHour /> : data?.map((item, index) => (
                    <div className="reserveItem" key={index}>
                        {item?.hourNumbers?.map((hourNo, index) => (
                            <div className="room" key={index}>
                                <label style={{ marginTop: "7px" }}>{hourNo?.number}</label>
                                <input type="checkbox"
                                    disabled={true}
                                />
                                <p>{isAvailableName(hourNo)}</p>
                                {isAvailableName(hourNo) &&
                                    <input type="checkbox"
                                        value={hourNo?._id}
                                        disabled={isAvailable(hourNo)}
                                        onChange={handleSelect}
                                    />
                                }
                            </div>
                        ))}
                    </div>
                ))}
                <button className="reserveButton" disabled={loadingRemove} onClick={handleClick}>Cancel Now!</button>
                {success && <p style={{ textAlign: "center", color: "green" }}>{success}</p>}
                {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}
                <ToastContainer />
            </div>
        </div>
    )
}

export default Reserve