import { useState, useEffect, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
} from 'firebase/storage'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { MapContainer, TileLayer } from 'react-leaflet'
import L from "leaflet";
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import Spinner from '../components/Spinner'

function CreateListing() {
    const [loading, setLoading] = useState(false)
    const [latlng, setLatlng] = useState(null)
    const [formData, setFormData] = useState({
        type: 'electronics',
        title: '',
        description: '',
        brand: '',
        phoneNumber: '',
        age: 0,
        itemCondition: '',
        warranty: false,
        featured: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        address: '',
    })

    const {
        type,
        title,
        description,
        brand,
        phoneNumber,
        age,
        // eslint-disable-next-line
        itemCondition,
        warranty,
        featured,
        regularPrice,
        discountedPrice,
        images,
        address,
    } = formData

    const auth = getAuth()
    const navigate = useNavigate()
    const isMounted = useRef(true)

    useEffect(() => {
        if (isMounted) {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setFormData({ ...formData, userRef: user.uid })
                } else {
                    navigate('/sign-in')
                }
            })
        }

        return () => {
            isMounted.current = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted])
    const onSubmit = async (e) => {
        e.preventDefault()
        if (discountedPrice >= regularPrice) {
            setLoading(false)
            toast.error('Discounted price needs to be less than regular price')
            return
        }
        if (images.length > 6) {
            setLoading(false)
            toast.error('Max 6 images')
            return
        }

        if (!latlng) {
            toast.error('Click and drag the pin on location map')
            return
        }

        let geolocation = {}
        geolocation.lat = latlng.lat
        geolocation.lng = latlng.lng


        // Store image in firebase
        const storeImage = async (image) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage()
                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

                const storageRef = ref(storage, 'images/' + fileName)

                const uploadTask = uploadBytesResumable(storageRef, image)

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress =
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        console.log('Upload is ' + progress + '% done')
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused')
                                break
                            case 'running':
                                console.log('Upload is running')
                                break
                            default:
                                break
                        }
                    },
                    (error) => {
                        reject(error)
                    },
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL)
                        })
                    }
                )
            })
        }

        const imgUrls = await Promise.all(
            [...images].map((image) => storeImage(image))
        ).catch(() => {
            setLoading(false)
            toast.error('Images not uploaded')
            return
        })

        const formDataCopy = {
            ...formData,
            imgUrls,
            geolocation,
            timestamp: serverTimestamp(),
        }

        delete formDataCopy.images
        !formDataCopy.featured && delete formDataCopy.discountedPrice

        const docRef = await addDoc(collection(db, 'listings'), formDataCopy)
        setLoading(false)
        toast.success('Listing saved')
        navigate(`/category/${formDataCopy.type}/${docRef.id}`)

    }
    const onMutate = (e) => {
        let boolean = null

        if (e.target.value === 'true') {
            boolean = true
        }
        if (e.target.value === 'false') {
            boolean = false
        }

        // Files
        if (e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files,
            }))
        }

        // Text/Booleans/Numbers
        if (!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value,
            }))
        }
    }

    const icon = L.icon({
        iconSize: [25, 41],
        iconAnchor: [10, 41],
        popupAnchor: [2, -40],
        iconUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-shadow.png"
    });

    if (loading) {
        return <Spinner />
    }

    return (
        <div className='formWrapper'>
            <header>
                <p className='pageHeader'>Create a Listing</p>
            </header>

            <main>
                <form onSubmit={onSubmit}>
                    <label className='formLabel'>Select Category</label>
                    <div className='formButtons selectCategory'>
                        <button
                            type='button'
                            className={type === 'electronics' ? 'formButtonActive' : 'formButton'}
                            id='type'
                            value='electronics'
                            onClick={onMutate}
                        >
                            Electronics
                        </button>
                        <button
                            type='button'
                            className={type === 'computers' ? 'formButtonActive' : 'formButton'}
                            id='type'
                            value='computers'
                            onClick={onMutate}
                        >
                            Computers
                        </button>
                        <button
                            type='button'
                            className={type === 'mobile-phones' ? 'formButtonActive' : 'formButton'}
                            id='type'
                            value='mobile-phones'
                            onClick={onMutate}
                        >
                            Mobile Phones
                        </button>
                        <button
                            type='button'
                            className={type === 'home-appliances' ? 'formButtonActive' : 'formButton'}
                            id='type'
                            value='home-appliances'
                            onClick={onMutate}
                        >
                            Home Appliances
                        </button>
                        <button
                            type='button'
                            className={type === 'furniture' ? 'formButtonActive' : 'formButton'}
                            id='type'
                            value='furniture'
                            onClick={onMutate}
                        >
                            Furniture
                        </button>
                        <button
                            type='button'
                            className={type === 'clothing' ? 'formButtonActive' : 'formButton'}
                            id='type'
                            value='clothing'
                            onClick={onMutate}
                        >
                            Clothing
                        </button>
                    </div>
                    <label className='formLabel'>Title</label>
                    <input
                        className='formInputName'
                        type='text'
                        id='title'
                        value={title}
                        onChange={onMutate}
                        maxLength='100'
                        minLength='10'
                        required
                    />
                    <label className='formLabel'>Description</label>
                    <textarea className='formInputName'
                        type='text'
                        id='description'
                        value={description}
                        onChange={onMutate}
                        maxLength='500'
                        minLength='10'
                        required>

                    </textarea>
                    <label className='formLabel'>Brand</label>
                    <input
                        className='formInputName'
                        type='text'
                        id='brand'
                        value={brand}
                        onChange={onMutate}
                        maxLength='32'
                        minLength='2'
                        required
                    />
                    <label className='formLabel'>Phone Number</label>
                    <input
                        className='formInputName'
                        type='text'
                        id='phoneNumber'
                        value={phoneNumber}
                        onChange={onMutate}
                        maxLength='15'
                        minLength='8'
                        required
                    />
                    <label className='formLabel'>Age (Years)</label>
                    <input
                        className='formInputName'
                        type='number'
                        id='age'
                        value={age}
                        onChange={onMutate}
                        min='1'
                        max='20'
                        required
                    />
                    <label className='formLabel'>Item Condition</label>
                    <select
                        className='formSelectItemCondition'
                        id="itemCondition"
                        name="itemCondition"
                        onChange={onMutate}
                        required>
                        <option value=''>Select item condition</option>
                        <option value='Flawless'>Perfect inside and out</option>
                        <option value='Excellent'>Almost no noticeable problems or flaws</option>
                        <option value='Good'>A bit of wear and tear, but in good working condition</option>
                        <option value='Average'>Normal wear and tear for the age of the item, a few problems here and there</option>
                        <option value='Poor'>Above average wear and tear.  The item may need a bit of repair to work properly</option>
                    </select>

                    <label className='formLabel'>Warranty</label>
                    <div className='formButtons'>
                        <button
                            className={warranty ? 'formButtonActive' : 'formButton'}
                            type='button'
                            id='warranty'
                            value={true}
                            onClick={onMutate}
                        >
                            Yes
                        </button>
                        <button
                            className={
                                !warranty && warranty !== null ? 'formButtonActive' : 'formButton'
                            }
                            type='button'
                            id='warranty'
                            value={false}
                            onClick={onMutate}
                        >
                            No
                        </button>
                    </div>
                    <label className='formLabel'>Address</label>
                    <textarea
                        className='formInputAddress'
                        type='text'
                        id='address'
                        value={address}
                        onChange={onMutate}
                        maxLength='100'
                        minLength='5'
                        required
                    />

                    <label className='formLabel'>Featured</label>
                    <div className='formButtons'>
                        <button
                            className={featured ? 'formButtonActive' : 'formButton'}
                            type='button'
                            id='featured'
                            value={true}
                            onClick={onMutate}
                        >
                            Yes
                        </button>
                        <button
                            className={
                                !featured && featured !== null ? 'formButtonActive' : 'formButton'
                            }
                            type='button'
                            id='featured'
                            value={false}
                            onClick={onMutate}
                        >
                            No
                        </button>
                    </div>


                    <label className='formLabel'>Regular Price</label>
                    <div className='formPriceDiv'>
                        <input
                            className='formInputSmall'
                            type='number'
                            id='regularPrice'
                            value={regularPrice}
                            onChange={onMutate}
                            min='50'
                            max='750000000'
                            required
                        />
                        {type === 'rent' && <p className='formPriceText'>$ / Month</p>}
                    </div>

                    {featured && (
                        <>
                            <label className='formLabel'>Discounted Price</label>
                            <input
                                className='formInputSmall'
                                type='number'
                                id='discountedPrice'
                                value={discountedPrice}
                                onChange={onMutate}
                                min='50'
                                max='75000000'
                                required={featured}
                            />
                        </>
                    )}

                    <label className='formLabel'>Images</label>
                    <p className='imagesInfo'>
                        The first image will be the cover (max 6).
                    </p>
                    <input
                        className='formInputFile'
                        type='file'
                        id='images'
                        onChange={onMutate}
                        max='6'
                        accept='.jpg,.png,.jpeg'
                        multiple
                        required
                    />
                    <label className='formLabel'>Click and drag the pin to the exact location.</label>
                    <div className='leafletContainer cr'>

                        <MapContainer
                            style={{ height: '100%', width: '100%' }}
                            center={[25, 55]}
                            zoom={11}
                            draggable={true}
                            scrollWheelZoom={false}
                            whenReady={(map) => {
                                console.log(map);

                                let marker;
                                const draggable = true
                                map.target.on("click", function (e) {
                                    if (marker) {
                                        marker.remove();
                                    }
                                    const { lat, lng } = e.latlng;
                                    marker = L.marker([lat, lng], { icon, draggable }).addTo(map.target);
                                    setLatlng(e.latlng)
                                    console.log(latlng)
                                    marker.on('dragend', function (event) {
                                        setLatlng(event.target._latlng)
                                        console.log(latlng)
                                    });
                                });


                            }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />


                        </MapContainer>
                    </div>
                    <button type='submit' className='primaryButton createListingButton'>
                        Create Listing
                    </button>

                </form>
            </main>
        </div>
    )
}

export default CreateListing