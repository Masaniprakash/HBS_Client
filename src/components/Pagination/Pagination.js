// import React, { useEffect, useState } from 'react';


// export default function Pagination({data}) {
//     let [currentPage, setCurrentPage] = useState(1);
//     let recordsPerPage = 5;
//     let indexOfLastRecord = currentPage * recordsPerPage;   
//     let indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//     let currentRecords = data?.slice(indexOfFirstRecord, indexOfLastRecord);
//     let totalPages = Math.ceil(data.length / recordsPerPage);
//     let pageNumbers = [...Array(totalPages).keys()].map(num => num + 1);

//     const prevPage = () => {
//         if (currentPage !== indexOfFirstRecord) {
//             setCurrentPage(currentPage - 1);
//         }
//     };

//     const nextPage = () => {
//         if (currentPage !== indexOfLastRecord) {
//             setCurrentPage(currentPage + 1);
//         }
//     };

//     return (
        
//     );
// }