import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const CreateSpotForm = () => {
    // const spot = useSelector(state => state.spot)
    const dispatch = useDispatch();
    const history = useHistory();

    // const [ownerId, setOwnerId] = useState(user.id)
    const [ name, setName ] = useState('');
    const [ address, setAddress ] = useState('');
    const [ city, setCity ] = useState('');
    const [ state, setState ] = useState('');
    const [country, setCountry] = useState('');
    const [description, setDescription] = useState('');

    return (
        <div>
            <h1>Create Spot Form</h1>
            <form className="create-spot-form" onSubmit="submit">

            </form>
        </div>
    );
}

export default CreateSpotForm;
