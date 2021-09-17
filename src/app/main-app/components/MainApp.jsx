import MainAppHead from './MainAppHead'
import MainAppNav from './MainAppNav'

const MainApp = ({ pageProps, Component }) => {
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
