const MainAppBody = ({ pageProps, Component }) => {
    return (
        <div className="flex flex-1">
            <Component {...pageProps} />
        </div>
    )
}

MainAppBody.propTypes = {}

MainAppBody.defaultProps = {}

export default MainAppBody
