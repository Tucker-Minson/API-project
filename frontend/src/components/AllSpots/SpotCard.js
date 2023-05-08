import { useSelector, useDispatch } from "react-redux";

const SpotCard = ({spot}) => {
    const card = useSelector((state) => {})

    return (
        <li>
            <h1>{spot.name}</h1>
            <img
                src={spot.previewImage}
                alt={spot.previewImage}
            />
            <h4>{`${spot.city}, ${spot.state}`}</h4>
            <h4>{spot.avgRating}</h4>
            <h4>{`$${spot.price} / night`}</h4>
        </li>
    );
}

export default SpotCard;
