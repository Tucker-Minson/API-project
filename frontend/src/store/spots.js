
const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const ADD_SPOT = 'spots/ADD_SPOT'
//////////////////// Actions ///////////////////////////////
export const receiveSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots
})
export const receiveOneSpot = (id) => ({
    type: ADD_SPOT,
    id
})

//////////////////// Thunk ///////////////////////////////
export const fetchSpots = () => async (dispatch) => {
    const res = await fetch('api/spots');
    const spots = await res.json();
    if (res.ok) {
        dispatch(receiveSpots(spots.spots));
    } else {
        return spots
    }
};

export const getAllSpots = state => {
    return state?.spots ? Object.values(state.spots) : []
    //return slice of state need
    //object.values
    //inside component
}

export const getOneSpot = (spot) => async dispatch => {
    const res = await fetch(`/api/spots/${spot.id}`);
    if (res.ok) {
        const data = await res.json();
        dispatch(receiveOneSpot(data))
    }
}

export const createSpotForm = (payload) => async dispatch => {
    const res = await fetch('api/spots', {
        headers: {'Content-Type': 'application/json'},
        method: "POST",
        body: JSON.stringify(payload)
    })
    if (res.ok) {
        const data = await res.json();
        dispatch(receiveOneSpot(data))
    }
};
///////////////////// Reducer //////////////////////////////
const spotsReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_SPOTS: {
            const newState = { ...state };
            for (let spot of action.spots) {
                newState[spot.id] = spot;
            }
            return newState
        };
        case ADD_SPOT: {
            if (!state[action.spot.id]) {
                const newState = {
                    ...state,
                    [action.spot.id]: action.spot
                }
                const spotList = newState.map(id => newState[id]);
                spotList.push(action.spot);
                return newState
            }
        };
        default: return state;
    }
}

export default spotsReducer;
