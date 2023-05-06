import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllSpots, fetchSpots } from "../../store/spots";

const AllSpots = () => {
    const spots = useSelector(getAllSpots);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch]);
    // let allSpots = [];

    return (
        <section>
            <h1>All Spots</h1>
            <ul>{
                spots.map(spot => (
                    <li>{spot.name}</li>
                ))
            }</ul>
        </section>
    );
}

export default AllSpots;
