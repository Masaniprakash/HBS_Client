import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
const SkeletonHour = () => {
    return (
        <div className="reserveItem" >
                <Skeleton baseColor="silver" width={29} />
                <Skeleton baseColor="silver" width={29} />
                <Skeleton baseColor="silver" width={29} />
                <Skeleton baseColor="silver" width={29} />
                <Skeleton baseColor="silver" width={29} />
                <Skeleton baseColor="silver" width={29} />
                <Skeleton baseColor="silver" width={29} />
           
        </div>
    );
  };
  export default SkeletonHour;
