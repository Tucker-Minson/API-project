import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink} from "react-router-dom";
import { getAllSpots, fetchSpots } from "../../store/spots";
import SpotDetails from "./OneSpot";
import SpotCard from "./SpotCard";

const AllSpots = () => {
    const spots = useSelector(getAllSpots);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch]);

    return (
        <section>
            <h1>All Spots</h1>
            <ul>
                {spots.map(spot => (
                    <li key={spot.id}>
                        <NavLink to={`/spots/${spot.id}`}>
                            <SpotCard spot={spot}/>
                        </NavLink>
                    </li>
                ))}
            </ul>

        </section>
    );
}

export default AllSpots;
