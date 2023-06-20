import axios from "axios";
import { useEffect, useState } from "react";
import "./GetBooking.css"
import React, {useRef} from 'react';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import { Link } from "react-router-dom";
import CustomSelect from "../CustomSelect/CustomSelect";
import department  from "../../data/department";
import { usePaginationRange } from "../Pagination/Pagination";

const GetBooking = ({user , data , action }) => {
    let dataLength = data.length;
    console.log(dataLength);
    const tableRef = useRef(null);
    const [hallName,setHallName]=useState("")
    const [dates,setDates]=useState("")
    const [hallList,setHallList]=useState([])
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [dept, setDept] = useState("");
    let [currentPage, setCurrentPage] = useState(1);
    let [recordsPerPage,setRecordsPerPage] = useState({value:10,label:10});
    let [recordsPerPageList,setRecordsPerPageList] = useState([
        {value:5,label:5},
        {value:10,label:10},
        {value:15,label:15},
        {value:20,label:20}
    ]);
    let indexOfLastRecord = currentPage * recordsPerPage.value;   
    let indexOfFirstRecord = indexOfLastRecord - recordsPerPage.value;
    let totalPages = Math.ceil(data.length / recordsPerPage.value);
    data?.map((item,index)=>{
        item.siNo=index+1
    })
    
    data?.sort((a,b)=>{
        return new Date(a.date) + new Date(b.date);
    });

    const paginationRange = usePaginationRange({
        totalPages,
        recordsPerPage,
        currentPage,
    });
    const prevPage = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    const nextPage = () => {
        if (currentPage !== totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    useEffect(()=>{
        let fetch=async()=>{
            let res=await axios.get("https://hbsserver.cyclic.app/api/hall/")
            let arr=[]
            res.data?.map((item)=>{
                arr.push({value:item.name,label:item.name}) 
            })
            setHallList(arr)
        }
        fetch()
    },[])

    let dataAfterFilter=data.filter((hour)=>{
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

    const clearFilter=()=>{
        setHallName("")
        setDates("")
        setFromDate("")
        setToDate("")
        setDept("")
    }

    return (
        <center>
            <div className="getAllContainer" style={user=="admin"?{minHeight:"calc(100Vh - 250px)"}:{minHeight:"calc(100Vh - 180px)"}}>
                <div className="filter" id={user=="normal"&&"filter"} >
                    <div className="filHallDate" id={user=="normal"&&"filHallDate"}>
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
                        {user=="normal"&&<button  className="clFilBtn" style={{maxHeight:45}} onClick={clearFilter}>Clear fliter</button>}
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
                    {user=="admin"&&<button  className="clFilBtn" style={{maxHeight:45}} onClick={clearFilter}>Clear fliter</button>}
                </div>
                {data.length !== 0 &&
                    <div className="ExportExcelAndRowsPerPage">
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
                        <div style={{display:"flex",alignItems:"center"}}>
                            <span className="removeSpan">Rows Per Page:</span>
                            <CustomSelect
                                option={recordsPerPageList}
                                selectedOptions={recordsPerPage}
                                setSelectedOptions={setRecordsPerPage}
                                isSearchable={true}
                                isMulti={false}
                                style={{ marginButtom: "0.5rem" }}
                            />
                        </div>
                    </div>
                }
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
                            {dataAfterFilter?.slice(indexOfFirstRecord, indexOfLastRecord).map((hour,index)=>{
                                totalPages = Math.ceil(dataAfterFilter.length / recordsPerPage.value)
                                    let dateSplit=hour.date.split("T")[0]
                                    return (
                                        <tr key={index}>
                                            <td>{hour.siNo}</td>
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
                    { dataAfterFilter?.length !== 0 && 
                        <nav className="paginationContainer" >
                            <ul className="pagination">
                                <button className="paginationPrev" disabled={currentPage == 1} onClick={prevPage}>{"<"}</button>
                                {paginationRange?.map(number => {
                                    return (
                                        <li onClick={() => setCurrentPage(number)} key={number} className={`page-item ${currentPage==number?"paginationActive":null}`}>
                                            <a className="page-link">
                                                {number}
                                            </a>
                                        </li>
                                    );
                                })}
                                <button className="paginationNext" disabled={currentPage == totalPages} onClick={nextPage}>{">"}</button>
                            </ul>
                        </nav>
                    }
                    {
                        dataAfterFilter?.length == 0 && <div className="noDataFound">No Data Found</div>
                    }
                </div>
            </div>
        </center>
    )
}

export default GetBooking