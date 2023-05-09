import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink} from "react-router-dom";
import { fetchSpots } from "../../store/spots";
import SpotCard from "./SpotCard";

const AllSpots = () => {
    const spots = Object.values(useSelector(state => state?.spots ? state.spots : {}));

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch]);


    return (
        <section>
                <NavLink to={'/spots/new'}>Create New Spot</NavLink>
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
