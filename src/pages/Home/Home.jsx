import Footer from "../../components/Footer/Footer"
import Navbar from "../../components/Navbar/Navbar"
import useFetch from "../../hooks/useFetch"
import "./Home.css"
import SkeletonCard from "../../components/Skeleton/Skeleton"
import { Link } from "react-router-dom"
import hall1 from "../../images/hall1.jpg"
import hall2 from "../../images/hall2.jpg"
import hall3 from "../../images/hall3.jpg"
import hall4 from "../../images/hall4.jpg"
import hall5 from "../../images/hall5.jpg"
import hall6 from "../../images/hall6.jpg"
import hall7 from "../../images/hall7.jpg"
import hall8 from "../../images/hall8.jpg"
import hall9 from "../../images/hall9.jpg"

const Home = () => {
    const {data,loading}=useFetch(`https://hbsserver.cyclic.app/api/hall/`)
    const images=[hall1,hall2,hall3,hall4,hall5,hall6,hall7,hall8,hall9]
    return (
        <div> 
            <Navbar />
            <div className="homeContainer">
                <h1 className="homeTitle">Select the hall</h1>
                {loading?<SkeletonCard />:<>{data.map((item,index)=>(
                    <div className='searchItem' key={index}>
                        <img src={images[index] || item.url} alt="" className="siImg" />
                        <div className="siDesc">
                            <h1 className="siTitle">{item.name}</h1>
                            <Link to={`/halls/${item._id}`}>
                                <button className='siCheckButton'>See availability</button>
                            </Link>
                        </div>
                    </div>))}
                </>}
            </div>
            <Footer />
        </div>
    )
}

export default Home