import { csrfFetch } from "./csrf";
const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const LOAD_SPOT = 'spots/LOAD_SPOT'
const ADD_SPOT = 'spots/ADD_SPOT'
//////////////////// Actions ///////////////////////////////
export const receiveSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots
})
export const receiveOneSpot = (spot) => ({
    type: LOAD_SPOT,
    spot
})
export const addSpot = (spot) => ({
    type: ADD_SPOT,
    spot
})

//////////////////// Thunk ///////////////////////////////
export const fetchSpots = () => async (dispatch) => {
    const res = await csrfFetch('api/spots');
    const spots = await res.json();
    if (res.ok) {
        dispatch(receiveSpots(spots.spots));
    } else {
        return spots
    }
};


export const getOneSpot = (id) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${id}`);
    if (res.ok) {
        const data = await res.json();
        dispatch(receiveOneSpot(data))
    }
}

export const createSpotForm = (payload) => async dispatch => {
    const res = await csrfFetch('api/spots', {
        headers: {'Content-Type': 'application/json'},
        method: "POST",
        body: JSON.stringify(payload.spot)
    })
    if (res.ok) {
        const data = await res.json();
        payload.images.forEach(async image => {
            const resImg = await csrfFetch(`/api/spots/${data.id}/images`, {
                headers: {'Content-Type': 'application/json'},
                method: "POST",
                body: JSON.stringify(image)
            })
        })
            dispatch(addSpot(data))
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
        case LOAD_SPOT: {
            return { ...state, [action.spot.id]: action.spot}
        }
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
