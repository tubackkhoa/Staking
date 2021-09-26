import MainAppActions from 'app/_shared/main-app-context/MainAppActions'
import { useMainAppContext } from 'app/_shared/main-app-context/MainAppContext'
import { useEffect } from 'react'
import { MainAppHead } from './MainAppHead'
import MainAppNav from './MainAppNav'
import MainAppBody from './MainAppBody'
import MainAppFooter from './MainAppFooter'

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
        <div
            className="flex flex-1 flex-col bg-hwl-gray-1"
            style={{ height: '100vh' }}>
            <MainAppHead />
            <MainAppNav />
            <MainAppBody />
            <MainAppFooter />
            {/* <Component {...pageProps} /> */}
        </div>
    )
}

export default MainApp
