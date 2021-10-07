import { useEffect, useState } from 'react'
import { globalKeys } from 'app/store'
import { useRouter } from 'next/dist/client/router'
import { useGlobal } from 'reactn'
import { icons } from 'assets'
import Image from 'next/image'
import { dummyInfoPages } from './dummy'

const MyAssetsList = () => {
    const route = useRouter()
    return (
        <div className="ItemSelectedContainer bg-hwl-gray-1 flex flex-1 flex-col"></div>
    )
}

export default MyAssetsList
