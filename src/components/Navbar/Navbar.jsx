import "./Navbar.css"
import {Link, useNavigate} from 'react-router-dom'
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket,faBars,faTimes,faUnlock} from "@fortawesome/free-solid-svg-icons"

const Navbar = () => {
    const [click, setClick] = useState(false);
    const navigate=useNavigate()
    const {user,dispatch}=useContext(AuthContext)
    let getAdmin=JSON?.parse(localStorage.getItem("user")) || null
    let admin=getAdmin?.isAdmin;

    const logout=()=>{
        dispatch({type:"LOGOUT"})
        setClick(!click);
        window.location.reload();
        navigate("/")     
    }

    const handleClick = () => setClick(!click);
    return (
        <>
            <nav className="navbar">
                <div className="nav-container">
                    <span className="logo">
                        <Link to="/" style={{color:"white",textDecoration:"none",fontSize:"1.4rem"}}>
                            <span className="lo">H</span>all <span className="lo">B</span>ooking
                            <span className="lo"> S</span>ystem
                        </Link>
                    </span>
                    <ul className={click ? "nav-menu active" : "nav-menu"} style={{paddingLeft:0}}>
                        {user && <><li className="nav-item"   >
                            <Link
                                to="/myBooking"
                                className="nav-links"
                            >
                                My Booking <FontAwesomeIcon icon={faArrowRightFromBracket}/>
                            </Link>
                        </li></>}
                        {admin && 
                            <li className="nav-item"  >
                            <Link
                                to="/admin"
                                className="nav-links"
                            >
                                Admin <FontAwesomeIcon icon={faArrowRightFromBracket} />
                            </Link>
                        </li>}
                        {user?<><li className="nav-item">
                            <Link
                                to="/changePassword"
                                className="nav-links"
                                onClick={handleClick}
                            >
                                Change Password <FontAwesomeIcon icon={faUnlock} />
                            </Link>
                        </li>
                        <li className="nav-item"   >
                            <Link
                                to="/"
                                style={{color:"red"}}
                                className="nav-links"
                                onClick={logout}
                            >
                                Logout <FontAwesomeIcon icon={faArrowRightFromBracket} color="red" />
                            </Link>
                        </li></>:<>
                        <li className="nav-item"  >
                            <Link
                                to="/login"
                                className="nav-links"
                            >
                                Login <FontAwesomeIcon icon={faArrowRightFromBracket} />
                            </Link>
                        </li>
                        </>}
                    </ul>
                    <div className="nav-icon" onClick={handleClick}>
                        {click ?<FontAwesomeIcon icon={faTimes} /> :<FontAwesomeIcon icon={faBars} />}
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar