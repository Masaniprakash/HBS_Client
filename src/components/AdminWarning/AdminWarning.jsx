import "./AdminWarning.css"
import { Link } from 'react-router-dom'
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const AdminWaring = () => {
    return (
        <div className="aW">
            <div className="aWWrapp">
                <div className="awContainer">  
                <FontAwesomeIcon icon={faTriangleExclamation} className="warningIcon" color="red"/>             
                    <h2 className="warningText"> You are not admin</h2>
                    <h3>Go back</h3>
                    <Link to="/" ><button className="warningGoBack">Back</button></Link>
                </div>
            </div>
            
        </div>
    )
}

export default AdminWaring