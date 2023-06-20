import './Footer.css'

const Footer = () => {
    return (  
        <div className="footer">
            <div className="footerContainer">
                <div className="footerText">
                    Copyright © {new Date().getFullYear()}
                    <span className="lo"> M</span>asaniprakash     
                </div>
            </div>
        </div>   
    ) 
}

export default Footer