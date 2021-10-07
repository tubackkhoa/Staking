import { useRouter } from 'next/dist/client/router'

const MyAssetsList = () => {
    const route = useRouter()
    return (
        <div className="ItemSelectedContainer bg-hwl-gray-1 flex flex-1 flex-col"></div>
    )
}

export default MyAssetsList
