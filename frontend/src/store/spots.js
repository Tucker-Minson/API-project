
export const RECEIVE_SPOTS = 'spots/RECEIVE_SPOTS';

export const receiveSpots = (spots) => ({
    type: RECEIVE_SPOTS,
    spots
})

export const fetchSpots = () => async (dispatch) => {
    const res = await fetch('api/spots');
    const spots = await res.json();
    console.log('----->',spots.spots)
    if (res.ok) {
        dispatch(receiveSpots(spots.spots));
    } else {
        return spots
    }
};

export const getAllSpots = state => {
    return state?.spots ? Object.values(state.spots) : []
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
