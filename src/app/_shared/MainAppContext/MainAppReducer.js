import initState from './initState'
import sayHello from './main-app-reducers/sayHello'
import MainAppActionTypes from './MainAppActionTypes'

const MainAppReducer = (state, action) => {
    const { type, payload = {} } = action
    const _state = { ...(state || initState) }

    if (type === MainAppActionTypes.SAY_GREETING)
        return sayHello(_state, { type, payload })

    return state
}

export default MainAppReducer
