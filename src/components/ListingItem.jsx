import { Link } from 'react-router-dom'
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg'
import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg'
import locationIcon from '../assets/svg/locationIcon.svg'

function ListingItem({ listing, id, onEdit, onDelete }) {
    return (
        <li className='categoryListing'>
            <Link
                to={`/category/${listing.type}/${id}`}
                className='categoryListingLink'
            >
                <img
                    src={listing.imgUrls[0]}
                    alt={listing.name}
                    className='categoryListingImg'
                />
                <div className='categoryListingDetails'>
                    <p className='categoryListingName'>{listing.title}</p>

                    <p className='categoryListingPrice'>
                        AED&nbsp;
                        {listing.offer
                            ? listing.discountedPrice
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            : listing.regularPrice
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </p>
                    <div className='categoryListingInfoDiv'>
                        <p className='categoryListingInfoText'>
                            AGE<br />
                            <strong>{listing.age} years</strong>
                        </p>
                        <p className='categoryListingInfoText'>
                            CONDITION<br />
                            <strong>{listing.itemCondition}</strong>
                        </p>
                        <p className='categoryListingInfoText'>
                            BRAND<br />
                            <strong>{listing.brand}</strong>
                        </p>
                    </div>
                    <p className='categoryListingLocation'><img width={12} src={locationIcon} alt='' /><span>{listing.address}</span></p>
                </div>
            </Link>

            {onDelete && (
                <DeleteIcon
                    className='removeIcon'
                    fill='rgb(231, 76,60)'
                    onClick={() => onDelete(listing.id, listing.name)}
                />
            )}

            {onEdit && <EditIcon className='editIcon' onClick={() => onEdit(id)} />}
        </li>
    )
}

export default ListingItem