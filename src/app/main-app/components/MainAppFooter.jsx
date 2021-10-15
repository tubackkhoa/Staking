import { icons } from 'assets'
import { useRouter } from 'next/dist/client/router'

const NameAndEmail = () => {
    return (
        <div className="flex flex-col">
            <a
                className="flex text-white text-semibold"
                style={{ fontSize: '26px' }}>
                {'HowlCity'}
            </a>
            <div className="flex flex-col" style={{ marginTop: '40px' }}>
                <a className="flex text-white" style={{}}>
                    {'Get the lastes Updates'}
                </a>
                <div
                    className="flex flex-row"
                    style={{
                        backgroundColor: '#1B1A21',
                        height: '40px',
                        width: '283px',
                        borderRadius: '10px',
                        marginTop: '12px',
                    }}>
                    <input
                        className="flex flex-1 text-white"
                        style={{
                            backgroundColor: '#1B1A21',
                            borderRadius: '10px',
                            paddingLeft: '18px',
                            outline: 'none',
                        }}
                        placeholder={'Your Email'}
                    />
                    <button
                        className="flex bg-hwl-blue-1 justify-center items-center"
                        style={{
                            width: '120px',
                            height: '40px',
                            borderRadius: '10px',
                        }}>
                        <p className="flex text-white">{'Email Me!'}</p>
                    </button>
                </div>
            </div>
            <a
                className="flex text-white font-semibold"
                style={{ marginTop: '80px', fontSize: '16px' }}>
                {'HowlCity, Inc. All Rights Reserved'}
            </a>
        </div>
    )
}

const HowlMarketFeatures = () => {
    const route = useRouter()
    const features = [
        {
            id: 'features0',
            title: 'Explore',
            onClick: () => {

            },
        },
        {
            id: 'features1',
            title: 'How it Works',
            onClick: () => undefined,
        },
        {
            id: 'features2',
            title: 'Contact Us',
            onClick: () => undefined,
        },
    ]
    return (
        <div className="flex flex-col">
            <a
                className="flex text-white"
                style={{ fontSize: '20px', fontWeight: 'bolder' }}>
                {'Howl market'}
            </a>
            <div className="flex flex-col" style={{ marginTop: '24px' }}>
                {features.map((item, index) => {
                    const { id, title, onClick } = item
                    return (
                        <button
                            key={id}
                            className="flex text-white"
                            style={{ marginTop: '12px' }}>
                            {title}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

const Supports = () => {
    const features = [
        {
            id: 'supports0',
            title: 'Help center',
            onClick: () => undefined,
        },
        {
            id: 'supports1',
            title: 'Terms of service',
            onClick: () => undefined,
        },
        {
            id: 'supports2',
            title: 'Legal',
            onClick: () => undefined,
        },
        {
            id: 'supports3',
            title: 'Privacy policy',
            onClick: () => undefined,
        },
    ]
    const communities = [
        {
            id: 'communities1',
            title: 'Instagram',
            icon: icons.instagram,
        },
        {
            id: 'communities2',
            title: 'Instagram',
            icon: icons.twitter,
        },
        {
            id: 'communities3',
            title: 'Instagram',
            icon: icons.telegram,
        },
        {
            id: 'communities4',
            title: 'Instagram',
            icon: icons.discord,
        },
    ]
    return (
        <div className="flex flex-col">
            <a
                className="flex text-white"
                style={{ fontSize: '20px', fontWeight: 'bolder' }}>
                {'Support'}
            </a>
            <div className="flex flex-col" style={{ marginTop: '24px' }}>
                {features.map((item, index) => {
                    const { id, title, onClick } = item
                    return (
                        <button
                            key={id}
                            className="flex text-white"
                            style={{ marginTop: '12px' }}>
                            {title}
                        </button>
                    )
                })}
            </div>
            <div className="flex flex-row" style={{ marginTop: 'auto' }}>
                {communities.map((item, index) => {
                    const { id, title, icon } = item
                    return (
                        <button
                            key={id}
                            className="flex"
                            style={{ margin: '0px 20px 0px 0px' }}>
                            <img
                                className="flex"
                                style={{
                                    width: '25px',
                                    height: '25px',
                                }}
                                src={icon}
                            />
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

const MainAppFooter = () => {
    return (
        <div className="flex bg-nav-bar py-8" style={{ boxShadow: '0px -4px 12px rgba(0, 0, 0, 0.08)' }}>
            <div className="flex flex-row justify-around w-full">
                <NameAndEmail />
                <HowlMarketFeatures />
                <Supports />
            </div>
        </div>
    )
}

MainAppFooter.propTypes = {}

MainAppFooter.defaultProps = {}

export default MainAppFooter
