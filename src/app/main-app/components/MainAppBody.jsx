import LeftSideBar from './LeftSideBar'

const MainAppBody = ({ pageProps, Component }) => {
    return (
        <div className="flex flex-1">
            <LeftSideBar />
            <Component {...pageProps} />
        </div>
    )
}

MainAppBody.propTypes = {}

MainAppBody.defaultProps = {}

export default MainAppBody
