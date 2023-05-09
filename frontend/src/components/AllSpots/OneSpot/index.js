import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOneSpot } from "../../../store/spots";
import { useEffect } from "react";

const SpotDetails = () => {
    const dispatch = useDispatch();
    let { id } = useParams()
    id = parseInt(id)
    const spot = useSelector(state => state.spots[id])
    console.log(spot)

    useEffect(() => {
        dispatch(getOneSpot(id))
    }, [dispatch, id])
    return (
        <div>
            <h1>{spot.name}</h1>


        </div>
    )
}

export default SpotDetails;

