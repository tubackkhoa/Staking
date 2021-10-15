import MainAppActionTypes from '../MainAppActionTypes'

const sayHello = (greetingValue = 1) => {
    return {
        type: MainAppActionTypes.SAY_GREETING,
        payload: { greeting: greetingValue },
    }
}

export default sayHello
