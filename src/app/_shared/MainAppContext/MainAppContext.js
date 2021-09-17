import { createContext, useContext, useReducer } from 'react'
import initState from './initState'
import MainAppReducer from './MainAppReducer'

export const MainAppContext = createContext(initState)

export const MainAppContextProvider = props => {
    const [state, dispatch] = useReducer(MainAppReducer, initState)

    return (
        <MainAppContext.Provider value={[state, dispatch]}>
            {props.children}
        </MainAppContext.Provider>
    )
}

export const useMainAppContext = () => useContext(MainAppContext)
