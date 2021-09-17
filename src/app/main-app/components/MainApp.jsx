import MainAppActions from 'app/_shared/MainAppContext/MainAppActions'
import { useMainAppContext } from 'app/_shared/MainAppContext/MainAppContext'
import { useEffect } from 'react'
import MainAppHead from './MainAppHead'
import MainAppNav from './MainAppNav'

const MainApp = ({ pageProps, Component }) => {
    const [state, dispatch] = useMainAppContext()

    useEffect(() => {
        _init()
    }, [])

    useEffect(() => {
        _logMainAppContext()
    }, [state])

    const _logMainAppContext = () => {
        console.log(`App state: ${JSON.stringify(state)}`)
    }

    const _init = () => {
        dispatch(MainAppActions.sayHello())
    }

    return (
        <>
            <MainAppHead />
            <div>
                <MainAppNav />
                <Component {...pageProps} />
            </div>
        </>
    )
}

export default MainApp
