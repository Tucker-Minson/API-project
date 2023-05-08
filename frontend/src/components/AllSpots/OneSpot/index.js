import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllSpots } from "../../../store/spots";

const SpotDetails = () => {
    const spots = useSelector(getAllSpots);

    const { id } = useParams()
    return (
        <div>
            <h1>Spot Details</h1>
            
        </div>
    )
}

export default SpotDetails;
