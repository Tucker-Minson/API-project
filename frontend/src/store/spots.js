
export const RECEIVE_SPOTS = 'spots/RECEIVE_SPOTS';
export const RECEIVE_SPOT = 'spots/RECEIVE_SPOT'

export const receiveSpots = (spots) => ({
    type: RECEIVE_SPOTS,
    spots
})
export const receiveOneSpot = (id) => ({
    type: RECEIVE_SPOT,
    id
})

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

const spotsReducer = (state = {}, action) => {
    switch (action.type) {
        case RECEIVE_SPOTS: {
            const newState = { ...state };
            for (let spot of action.spots) {
                newState[spot.id] = spot;
            }
            return newState
        }
        default: return state;
    }
}

export default spotsReducer;
