import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const CreateSpotForm = () => {
    // const spot = useSelector(state => state.spot)
    const dispatch = useDispatch();
    const history = useHistory();

    // const [ownerId, setOwnerId] = useState(user.id)
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [description, setDescription] = useState('');

    const updateName = (e) => setName(e.target.value)
    const updateAddress = (e) => setAddress(e.target.value)
    const updateCity = (e) => setCity(e.target.value)
    const updateState = (e) => setState(e.target.value)
    const updateCountry = (e) => setCountry(e.target.value)
    const updateDescription = (e) => setDescription(e.target.value)

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            name,
            address,
            city,
            state,
            country,
            description
        }
        let createSpot;
        if (createSpot) {
            history.push(`/spots/${createSpot.id}`)
        }
    };

    return (
        <div>
            <h1>Create Spot Form</h1>
            <form className="create-spot-form" onSubmit={handleSubmit}>
                <input
                    placeholder="name"
                    value={name}
                    onChange={updateName}
                />
                <input
                    placeholder="address"
                    value={address}
                    onChange={updateAddress}
                />
                <input
                    placeholder="city"
                    value={city}
                    onChange={updateCity}
                />
                <input
                    placeholder="state"
                    value={state}
                    onChange={updateState}
                />
                <input
                    placeholder="country"
                    value={country}
                    onChange={updateCountry}
                />
                <textarea
                    placeholder="description"
                    value={description}
                    onChange={updateDescription}
                />
            </form>
            <button type="submit" onClick={handleSubmit}> Create Spot</button>

        </div>
    );
}

export default CreateSpotForm;
