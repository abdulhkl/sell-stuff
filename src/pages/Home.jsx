import { Link } from 'react-router-dom'
// import Slider from '../components/Slider'
import categoryComputers from '../assets/png/categoryComputers.png'
import categoryElectronics from '../assets/png/categoryElectronics.png'
import categoryMobilePhones from '../assets/png/categoryMobilePhones.png'
import categoryHomeAppliances from '../assets/png/categoryHomeAppliances.png'
import categoryFurnitures from '../assets/png/categoryFurnitures.png'
import categoryClothings from '../assets/png/categoryClothings.png'



function Home() {
    return (
        <div className='explore'>
            <header>
                <p className='pageHeader'>Categories</p>
            </header>

            <main>
                {/* <Slider /> */}

                <p className='exploreCategoryHeading'></p>
                <div className='exploreCategories'>
                    <Link to='/category/electronics'>
                        <div>
                            <img
                                src={categoryElectronics}
                                alt='rent'
                                className='exploreCategoryImg'
                            />
                        </div>
                        <p className='exploreCategoryName'>Electronics</p>
                    </Link>
                    <Link to='/category/computers'>
                        <div>
                            <img
                                src={categoryComputers}
                                alt='sell'
                                className='exploreCategoryImg'
                            />
                        </div>
                        <p className='exploreCategoryName'>Computers</p>
                    </Link>
                    <Link to='/category/mobile-phones'>
                        <div>
                            <img
                                src={categoryMobilePhones}
                                alt='sell'
                                className='exploreCategoryImg'
                            />
                        </div>
                        <p className='exploreCategoryName'>Mobile Phones</p>
                    </Link>
                    <Link to='/category/home-appliances'>
                        <div>
                            <img
                                src={categoryHomeAppliances}
                                alt='sell'
                                className='exploreCategoryImg'
                            />
                        </div>
                        <p className='exploreCategoryName'>Home Appliances</p>
                    </Link>
                    <Link to='/category/furniture'>
                        <div>
                            <img
                                src={categoryFurnitures}
                                alt='sell'
                                className='exploreCategoryImg'
                            />
                        </div>
                        <p className='exploreCategoryName'>Furniture</p>
                    </Link>
                    <Link to='/category/clothing'>
                        <div>
                            <img
                                src={categoryClothings}
                                alt='sell'
                                className='exploreCategoryImg'
                            />
                        </div>
                        <p className='exploreCategoryName'>Clothing</p>
                    </Link>

                </div>
            </main>
        </div>
    )
}

export default Home