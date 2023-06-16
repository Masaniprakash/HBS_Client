import { useEffect, useState } from "react"
import axios from 'axios'

const useFetch=(url,con)=>{
    const [data,setData]=useState([])
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState(false)

    useEffect(()=>{
        let fetchData=async ()=>{
            setLoading(true)
            try {
                let res=await axios.get(url)  
                setData(res.data)
            } catch (error) {
                setError(error)
            }
            setLoading(false)
        }
        fetchData()
    },[url,con])

    return {data,loading ,error}
}

export default useFetch;