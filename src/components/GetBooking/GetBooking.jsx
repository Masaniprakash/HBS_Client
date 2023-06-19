import axios from "axios";
import { useEffect, useState } from "react";
import "./GetBooking.css"
import React, {useRef} from 'react';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import { Link } from "react-router-dom";
import CustomSelect from "../CustomSelect/CustomSelect";
import department  from "../../data/department";

const GetBooking = ({user , data , action}) => {
    const tableRef = useRef(null);
    const [hallName,setHallName]=useState("")
    const [dates,setDates]=useState("")
    const [hallList,setHallList]=useState([])
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [dept, setDept] = useState("");
    let [currentPage, setCurrentPage] = useState(1);
    let recordsPerPage = 5;
    let indexOfLastRecord = currentPage * recordsPerPage;   
    let indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    // let currentRecords = data?.slice(indexOfFirstRecord, indexOfLastRecord);
    let totalPages = Math.ceil(data.length / recordsPerPage);
    let pageNumbers = [...Array(totalPages).keys()].map(num => num + 1);
    // console.log(pageNumbers);
    const prevPage = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    console.log(totalPages);
    const nextPage = () => {
        if (currentPage !== totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    useEffect(()=>{
        let fetch=async()=>{
            let res=await axios.get("https://hbsserver.cyclic.app/api/hall/")
            let arr=[]
            res.data?.map((item,index)=>{
                arr.push({value:item.name,label:item.name}) 
            })
            setHallList(arr)
        }
        fetch()
    },[])

    let mass=data.filter((hour)=>{
        if(!hallName && !dates && !fromDate && !toDate && !dept){
            return hour
        }
        if(dept && !hallName && !dates && !fromDate && !toDate){
            return hour?.department?.toLowerCase()?.includes(dept?.value?.toLowerCase())
        }
        if(dates){
            if(dates && !dept && !hallName){
                return hour?.date?.split("T")[0]===dates
            }else if(dates && dept && hallName){
                return (hour?.date?.split("T")[0]===dates
                    && hour.hallName?.toLowerCase().includes(hallName?.value.toLowerCase()) 
                    && hour.department.toLowerCase().includes(dept?.value?.toLowerCase())
                )
            }else if(dates && dept && !hallName){
                return (hour?.date?.split("T")[0]===dates 
                    && hour.department.toLowerCase().includes(dept?.value?.toLowerCase())
                )
            }
        }
        if(hallName){
            if(hallName && dates && !fromDate && !dept && !toDate){
                return (hour.hallName?.toLowerCase().includes(hallName?.value.toLowerCase()) 
                && hour?.date?.split("T")[0]===dates
                )
            }else if(hallName && dept && !dates && !fromDate && !toDate){
                return (hour.hallName?.toLowerCase().includes(hallName?.value.toLowerCase()) 
                    && hour.department.toLowerCase().includes(dept?.value?.toLowerCase())
                )
            }else if(hallName && !dates && !fromDate && !toDate && !dept){
                return hour.hallName?.toLowerCase().includes(hallName?.value.toLowerCase())
            }
        }
        if(fromDate && toDate){
            let dateSplit=hour.date.split("T")[0]
            if(!hallName && !dates && !dept){
                if(dateSplit>=fromDate && dateSplit<=toDate){
                    return hour
                }else {
                    return hour=null;
                }
            }else if(hallName && !dates && !dept){
                return (hour.hallName?.toLowerCase().includes(hallName?.value.toLowerCase()) 
                    && dateSplit>=fromDate && dateSplit<=toDate
                )
            }else if(!hallName && dept && !dates){
                return ( dateSplit>=fromDate && dateSplit<=toDate
                    && hour.department.toLowerCase().includes(dept?.value?.toLowerCase())
                )
            }
            
        }
        if(hallName && dept && fromDate && toDate && !dates ){
            let dateSplit=hour.date.split("T")[0]
            return (hour.hallName?.toLowerCase().includes(hallName?.value.toLowerCase()) 
                && dateSplit>=fromDate && dateSplit<=toDate
                && hour.department.toLowerCase().includes(dept?.value?.toLowerCase())
            )
        }
        return null
        })
    
    data?.sort((a,b)=>{
        return new Date(a.date) - new Date(b.date);
    });

    const clearFilter=()=>{
        setHallName("")
        setDates("")
        setFromDate("")
        setToDate("")
        setDept("")
    }

    let sNo=0
    return (
        <center>
            <div className="getAllContainer" style={{minHeight:"calc(100Vh - 180px)"}}>
                <div className="filter">
                    <div className="filHallDate">
                        <div className="filBox">
                            <span className="removeSpan">Select Hall Name:</span>
                            <CustomSelect
                                option={hallList}
                                selectedOptions={hallName}
                                setSelectedOptions={setHallName}
                                isSearchable={true}
                                isMulti={false}
                                style={{ marginButtom: "0.5rem" }}
                            />
                        </div>
                        <div className="filBox">
                            <span className="removeSpan">Select Date:</span>
                            <input type="date" placeholder="Enter the hall Name" 
                                className="dates" value={dates}
                                disabled={fromDate!=="" || toDate!==""}
                                onChange={(e)=>setDates(e.target.value)}
                            />
                        </div>
                    </div><br/>
                    {user==="admin" && 
                        <>
                            <div className="fltFromTo">
                                <div className="filBox">
                                    <span className="removeSpan">Select Date From:</span>
                                    <input type="date" placeholder="Enter the hall Name"
                                        disabled={dates!==""}
                                        className="dates" value={fromDate} 
                                        onChange={(e)=>setFromDate(e.target.value)}
                                    />
                                </div>
                                    
                                <div className="filBox">
                                    <span className="removeSpan">To Date:</span>
                                    <input type="date" placeholder="Enter the hall Name" 
                                        disabled={dates!==""}
                                        className="dates" value={toDate} 
                                        onChange={(e)=>setToDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <br/>
                            <div className="fltDep" style={{marginRight:"15px"}}>
                                <span className="removeSpan">Select The Department:</span>
                                <CustomSelect
                                    option={department}
                                    selectedOptions={dept}
                                    setSelectedOptions={setDept}
                                    isSearchable={true}
                                    isMulti={false}
                                    style={{ marginButtom: "0.5rem" }}
                                />
                            </div>
                        </>
                    }
                    <button  className="clFilBtn" style={{maxHeight:45}} onClick={clearFilter}>Clear fliter</button>
                </div>
                {data.length===0 ? null : <div className="ExportExcel" style={{justifyContent:"center"}}>
                    {action==="get booking" && <Link to={"/canceltheirbooking"}>
                        <button className="cancelBtn" >Cancel Booking</button>
                    </Link>}
                    <DownloadTableExcel 
                        filename={action}
                        sheet="users"
                        currentTableRef={tableRef.current}
                    >
                        <button  className="clFilBtn" style={{marginTop:10}}> Export excel </button>
                    </DownloadTableExcel>
                </div>}
                <div className="getAllBook" >
                    <table ref={tableRef}>
                        <thead className="tableHeader">
                            <tr>
                                <th>S.No</th>
                                <th style={{minWidth:80,maxWidth:130}}>Hall Name</th>
                                <th>Hour</th>
                                {user==="admin" && <th> Staff Name</th>}
                                {user==="admin" &&<th> Department</th>}
                                <th style={{maxWidth:200,minWidth:160}}>Reason</th>
                                <th style={{maxWidth:75,minWidth:75}}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mass?.slice(indexOfFirstRecord, indexOfLastRecord).map((hour,index)=>{
                                totalPages = Math.ceil(mass.length / recordsPerPage)
                                pageNumbers = [...Array(totalPages).keys()].map(num => num + 1);
                                // console.log(totalPages,mass.length);
                                    sNo=sNo+1
                                    let dateSplit=hour.date.split("T")[0]
                                    return (
                                        <tr key={index}>
                                            <td>{sNo}</td>
                                            <td style={{minWidth:80,maxWidth:130}}>{hour.hallName}</td>
                                            <td>{hour.hourNo}</td>
                                            {user==="admin" && <td style={{maxWidth:170}}>{hour.name}</td>}
                                            {user==="admin" && <td style={{maxWidth:170}}>{hour.department}</td>}
                                            <td style={{maxWidth:200,minWidth:160}}>{hour.reason}</td>
                                            <td style={{maxWidth:75,minWidth:75}}>{dateSplit}</td>
                                        </tr>
                                    )
                                })       
                            }
                        </tbody>
                    </table>
                    <nav>
                        <ul className="pagination">
                            <button className="paginationPrevNext" onClick={prevPage}>{"<"}</button>
                            {pageNumbers.map(number => {
                                return (
                                    <li key={number} className={`page-item ${currentPage==number?"paginationActive":null}`}>
                                        <a onClick={() => setCurrentPage(number)}  className="page-link">
                                            {number}
                                        </a>
                                    </li>
                                );
                            })}
                            <button className="paginationPrevNext" onClick={nextPage}>{">"}</button>
                        </ul>
                    </nav>
                </div>
            </div>
        </center>
    )
}

export default GetBooking