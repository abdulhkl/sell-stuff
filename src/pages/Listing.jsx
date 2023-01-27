import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

// import { Helmet } from 'react-helmet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.css'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
import locationIcon from '../assets/svg/locationIcon.svg'

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Autoplay])

function Listing() {
    const [listing, setListing] = useState(null)
    const [loading, setLoading] = useState(true)
    const [shareLinkCopied, setShareLinkCopied] = useState(false)

    const navigate = useNavigate()
    const params = useParams()
    const auth = getAuth()

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', params.listingId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                setListing(docSnap.data())
                setLoading(false)
            }
        }

        fetchListing()
    }, [navigate, params.listingId])

    if (loading) {
        return <Spinner />
    }

    const formatMovementDate = function (date, locale) {
        const calcDaysPassed = (date1, date2) =>
            Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

        const daysPassed = calcDaysPassed(new Date(), date);
        console.log(daysPassed);

        if (daysPassed === 0) return "Posted Today";
        if (daysPassed === 1) return "Posted Yesterday";
        if (daysPassed <= 7) return `Posted ${daysPassed} days ago`;
        return new Intl.DateTimeFormat(locale).format(date);
    };

    return (
        <main>
            <div className='listingDetails'>
                <div>
                    <p>For Sale
                        <span className='listingType'>{listing.type}</span></p>
                    <div className='titlePrice'>
                        <div><p className='listingName'>
                            {listing.title}
                        </p>
                            <p className='daysAgo'>
                                {formatMovementDate(new Date(listing.timestamp.seconds * 1000), "en-US")}
                            </p></div>
                        <div className='listingPrice'>
                            {listing.featured && (
                                <span className='discountPrice'>
                                    AED{listing.regularPrice}
                                </span>
                            )}&nbsp;AED
                            {listing.featured
                                ? listing.discountedPrice
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                : listing.regularPrice
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                    </div>
                    <div
                        className='shareIconDiv'
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href)
                            setShareLinkCopied(true)
                            setTimeout(() => {
                                setShareLinkCopied(false)
                            }, 2000)
                        }}
                    >
                        <img src={shareIcon} alt='' />
                    </div>
                    {shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}
                    <Swiper slidesPerView={1} autoplay={{ delay: 3000 }} pagination={{ clickable: true }} navigation={{ clickable: true }}>
                        {listing.imgUrls.map((url, index) => (
                            <SwiperSlide key={index}>
                                <div
                                    style={{
                                        background: `url(${listing.imgUrls[index]}) center no-repeat`,
                                        backgroundSize: 'cover', minHeight: 500,
                                    }}
                                    className='swiperSlideDiv'
                                ></div>
                            </SwiperSlide>

                        ))}
                    </Swiper>


                </div>
                <p className='listingSubTitle'>Item Overview</p>
                <div className='itemOverview'>
                    <div>
                        <p>AGE</p>
                        <div className='info'>{listing.age > 1
                            ? `${listing.age} Years`
                            : '1 Year'}
                        </div></div>
                    <div><p>BRAND</p><div className='info'>{listing.brand}</div></div>
                    <div><p>CONDITION</p><div className='info'>{listing.itemCondition}</div></div>
                    <div><p>WARRANTY</p><div className='info'>{listing.warranty
                        ? 'Yes'
                        : 'No'}</div></div>
                </div>
                <p className='listingSubTitle'>Description</p>
                <div>
                    {listing.description}
                </div>
                <p className='listingSubTitle'>Location</p>
                <div className='leafletContainer'>
                    <MapContainer
                        style={{ height: '100%', width: '100%' }}
                        center={[listing.geolocation.lat, listing.geolocation.lng]}
                        zoom={12}
                        scrollWheelZoom={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker
                            position={[listing.geolocation.lat, listing.geolocation.lng]}
                        >
                            <Popup>{listing.address}</Popup>
                        </Marker>
                    </MapContainer>
                </div>
                <p className='listingLocation'><img src={locationIcon} alt='location' /><span>{listing.address}</span></p>

                {auth.currentUser?.uid !== listing.userRef && (
                    <Link
                        to={`/contact/${listing.userRef}?listingName=${listing.title}`}
                        className='primaryButton'
                    >
                        Contact Landlord
                    </Link>
                )}
            </div>
        </main>
    )
}

export default Listing