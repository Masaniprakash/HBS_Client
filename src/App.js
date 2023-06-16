import './App.css';
import {BrowserRouter , Routes , Route} from "react-router-dom"
import Home from './pages/Home/Home';
import HallContext from './context/HallContext';
import CancelDateContext from './context/CancelDate';
import Login from './pages/Login/Login';
import Hall from './pages/Hall/Hall';
import { AuthContextProvider } from './context/AuthContext';
import Admin from './pages/Admin/Admin';
import ChangePassword from './pages/changePassword/ChangePassword';
import GetBookingByName from './components/GetBookingByName/GetBookingByName';
import ReasonContext from './context/ReasonContext';
import CancelTheirBooking from './pages/CancelTheirBooking/CancelTheirBooking';
 
function App() { 

    return (
        <div className="App">   
            <AuthContextProvider>
                <ReasonContext.Provider value={{search:{reason:""}}}>
                    <HallContext.Provider value={{search:{date:""}}}>
                        <CancelDateContext.Provider value={{search:{date:""}}}>
                            <BrowserRouter>
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/halls/:id" element={<Hall />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/myBooking" element={<GetBookingByName />} />
                                    <Route path="/changePassword" element={<ChangePassword />} />
                                    <Route path="/admin" element={<Admin />} />
                                    <Route path="/canceltheirbooking" element={<CancelTheirBooking />} />
                                </Routes>
                            </BrowserRouter>
                        </CancelDateContext.Provider>
                    </HallContext.Provider>
                </ReasonContext.Provider>
            </AuthContextProvider>
        </div>
    );
}

export default App;