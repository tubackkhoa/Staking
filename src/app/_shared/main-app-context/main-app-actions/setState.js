import MainAppActionTypes from '../MainAppActionTypes'

const sayHello = (data) => {
    return {
        type: MainAppActionTypes.SET_STATE,
        payload: { data },
    }
}

export default sayHello
