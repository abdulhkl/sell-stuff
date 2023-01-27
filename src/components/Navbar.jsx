import { useNavigate, useLocation, Link } from 'react-router-dom'
import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg'
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg'
import { ReactComponent as PersonOutlineIcon } from '../assets/svg/personOutlineIcon.svg'
import logo from '../assets/png/logo.png'
function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const pathMatchRoute = (route) => {
        if (route === location.pathname) {
            return true
        }
    }
    return (
        <footer className="navbar">
            <nav className="navbarNav">
                <div className='container'>
                    <div className='navbarWrapper'>
                        <Link to='/'><img
                            src={logo}
                            alt='Sell Stuffs' onClick={() => navigate('/')}

                        /></Link>
                        <ul className="navbarListItems">
                            <li className="navbarListItem" onClick={() => navigate('/')}><ExploreIcon fill={pathMatchRoute('/') ? '#ffffff' : '#8f8f8f'}
                                width='24px'
                                height='24px' />
                                <p
                                    className={
                                        pathMatchRoute('/')
                                            ? 'navbarListItemNameActive'
                                            : 'navbarListItemName'
                                    }
                                >
                                    Categories
                                </p>
                            </li>
                            <li className="navbarListItem" onClick={() => navigate('/featured')}><OfferIcon fill={pathMatchRoute('/featured') ? '#ffffff' : '#8f8f8f'}
                                width='24px'
                                height='24px' />
                                <p
                                    className={
                                        pathMatchRoute('/featured')
                                            ? 'navbarListItemNameActive'
                                            : 'navbarListItemName'
                                    }
                                >
                                    Featured Listing
                                </p>
                            </li>
                            <li className="navbarListItem" onClick={() => navigate('/profile')}><PersonOutlineIcon fill={pathMatchRoute('/profile') ? '#ffffff' : '#8f8f8f'}
                                width='24px'
                                height='24px' />
                                <p
                                    className={
                                        pathMatchRoute('/profile')
                                            ? 'navbarListItemNameActive'
                                            : 'navbarListItemName'
                                    }
                                >
                                    My Account
                                </p>
                            </li>
                        </ul>
                    </div>

                </div>
            </nav>
        </footer >
    )
}

export default Navbar