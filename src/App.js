import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import Featured from "./pages/Featured"
import Category from './pages/Category'
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Profile from "./pages/Profile"
import CreateListing from './pages/CreateListing'
import EditListing from './pages/EditListing'
import ForgotPassword from "./pages/ForgotPassword"
import Navbar from "./components/Navbar";
import Listing from './pages/Listing'
import Contact from './pages/Contact'
function App() {
  return (
    <>
      <Router>
        <div className="container">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/featured" element={<Featured />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path='/profile' element={<PrivateRoute />}>
              <Route path='/profile' element={<Profile />} />
            </Route>
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path='/create-listing' element={<CreateListing />} />
            <Route path='/edit-listing/:listingId' element={<EditListing />} />
            <Route path='/contact/:landlordId' element={<Contact />} />
            <Route path='/category/:categoryName' element={<Category />} />
            <Route path='/category/:categoryName/:listingId' element={<Listing />} />
          </Routes>
        </div>
        <Navbar />
        <Toaster />
      </Router>
    </>
  );
}

export default App;
