import { createContext, useContext, useReducer } from 'react'
import mainAppInitState from './mainAppInitState'
import MainAppReducer from './MainAppReducer'

const MainAppContext = createContext(mainAppInitState)

export const MainAppContextProvider = props => {
    const [state, dispatch] = useReducer(MainAppReducer, mainAppInitState)

    return (
        <MainAppContext.Provider value={[state, dispatch]}>
            {props.children}
        </MainAppContext.Provider>
    )
}

export const useMainAppContext = () => useContext(MainAppContext)
