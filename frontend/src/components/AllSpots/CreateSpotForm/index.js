import { useEffect, useState } from "react";
import { useDispatch} from "react-redux";
import { useHistory } from "react-router-dom";

const CreateSpotForm = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    // const [ownerId, setOwnerId] = useState(user.id)
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [description, setDescription] = useState('');
    // const [lat, setLat] = useState('');
    // const [lng, setlng] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState([])

    const updateName = (e) => setName(e.target.value)
    const updateAddress = (e) => setAddress(e.target.value)
    const updateCity = (e) => setCity(e.target.value)
    const updateState = (e) => setState(e.target.value)
    const updateCountry = (e) => setCountry(e.target.value)
    const updateDescription = (e) => setDescription(e.target.value)
    // const updateLat = (e) => setLat(e.target.value)
    // const updateLng = (e) => setLng(e.target.value)
    const updatePrice = (e) => setPrice(e.target.value)
    const updateImage = (e) => setImage(e.target.value)

    useEffect(() => {
        const errors = {};
        
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        //need to make an images and spots key
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
                    placeholder="Name of your spot"
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
                <input
                    placeholder="Price per night"
                    value={`${price}`}
                    onChange={updatePrice}
                />
                <input
                placeholder="Preview Image URL"
                value={image}
                onChange={updateImage}
                />
            </form>
            <button type="submit" onClick={handleSubmit}>Create Spot</button>

        </div>
    );
}

export default CreateSpotForm;
