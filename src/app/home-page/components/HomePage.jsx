import { icons } from 'assets'
import QuickFilterBar from './QuickFilterBar'
import { nfts } from '../statics/dummy'

const HomePage = () => {
    return (
        <div className="first-letter:bg-hwl-gray-1 HomePage">
            <QuickFilterBar />
            <div className="NftItems flex flex-wrap">
                {nfts.map(item => {
                    const { id, title, image, like, price, tokenCode } = item
                    return (
                        <button key={id} className="flex flex-col NftItem">
                            <img
                                className="flex"
                                style={{
                                    width: '182px',
                                    height: '182px',
                                    borderRadius: '20px',
                                }}
                                src={image}
                            />
                            <div className="flex flex-1 flex-col items-left w-full Info">
                                <a className="text-white text-left Title">
                                    {title}
                                </a>
                                <div
                                    className="flex flex-row items-center w-full"
                                    style={{ marginTop: '4px' }}
                                >
                                    <a className="flex text-white Price">
                                        {price}
                                    </a>
                                    <a className="flex text-white TokenCode">
                                        {tokenCode}
                                    </a>
                                    <img
                                        className="HeartIcon"
                                        src={icons.heart}
                                    />
                                    <a
                                        className="flex text-white"
                                        style={{
                                            marginLeft: '3px',
                                            fontSize: '12px',
                                        }}
                                    >
                                        {like}
                                    </a>
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default HomePage
