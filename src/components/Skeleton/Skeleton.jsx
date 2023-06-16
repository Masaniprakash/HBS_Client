import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
const SkeletonCard = () => {
    return (
        <div className="homeContainer" >
            <div className='searchItem' style={{flexDirection:"column"}}>
                <Skeleton containerClassName="searchItem" variant="rectangular" baseColor="silver" height={300} />
                <center><Skeleton containerClassName="siTitle"  
                variant="rectangular" width={"40%"} 
                baseColor="silver" height={40} /></center>
            </div>
            
        </div>
    );
  };
  export default SkeletonCard;
