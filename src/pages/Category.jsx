import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    collection,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    getCountFromServer
} from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-hot-toast'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

function Category() {
    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lastFetchedListing, setLastFetchedListing] = useState(null)
    const [showLoadMore, setshowLoadMore] = useState(false)


    const params = useParams()

    let count = 0;
    let totalSize;

    useEffect(() => {
        const fetchListings = async () => {
            try {
                // Get reference
                const listingsRef = collection(db, 'listings')

                // Create a query
                const q = query(
                    listingsRef,
                    where('type', '==', params.categoryName),
                    orderBy('timestamp', 'desc'),
                    limit(5)
                )
                const qCount = query(
                    listingsRef,
                    where('type', '==', params.categoryName),
                    orderBy('timestamp', 'desc')
                )

                // Execute query
                const querySnap = await getDocs(q)
                const querySnapCount = await getCountFromServer(qCount)
                count += 5
                totalSize = querySnapCount.data().count

                const lastVisible = querySnap.docs[querySnap.docs.length - 1]
                setLastFetchedListing(lastVisible)

                if(count <  totalSize){
                    setshowLoadMore(true)
                }

                console.log(count, totalSize)

                const listings = []

                querySnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data(),
                    })
                })

                setListings(listings)
                setLoading(false)
            } catch (error) {
                toast.error('Could not fetch listings')
            }
        }

        fetchListings()
    }, [params.categoryName])

    // Pagination / Load More
    const onFetchMoreListings = async () => {
        try {
            // Get reference
            const listingsRef = collection(db, 'listings')

            // Create a query
            const q = query(
                listingsRef,
                where('type', '==', params.categoryName),
                orderBy('timestamp', 'desc'),
                startAfter(lastFetchedListing),
                limit(5)
            )

            // Execute query
            const querySnap = await getDocs(q)

            const lastVisible = querySnap.docs[querySnap.docs.length - 1]
            setLastFetchedListing(lastVisible)

            if(count <  totalSize){
                setshowLoadMore(true)
            } else {
                setshowLoadMore(false)
            }

            const listings = []

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })

            setListings((prevState) => [...prevState, ...listings])
            setLoading(false)
        } catch (error) {
            toast.error('Could not fetch listings')
        }
    }

    return (
        <div className='category'>
            <header>
                <p className='pageHeader categoryHeader'>
                    {(() => {
                        const category = params.categoryName
                        return category.replace("-", " ")

                    })()}
                </p>
            </header>

            {loading ? (
                <Spinner />
            ) : listings && listings.length > 0 ? (
                <>
                    <main>
                        <ul className='categoryListings'>
                            {listings.map((listing) => (
                                <ListingItem
                                    listing={listing.data}
                                    id={listing.id}
                                    key={listing.id}
                                />
                            ))}
                        </ul>
                    </main>

                    <br />
                    <br />
                    {lastFetchedListing && showLoadMore && (
                        <p className='loadMore' onClick={onFetchMoreListings}>
                            Load More
                        </p>
                    )}
                </>
            ) : (
                <p>No listings for {params.categoryName}</p>
            )}
        </div>
    )
}

export default Category