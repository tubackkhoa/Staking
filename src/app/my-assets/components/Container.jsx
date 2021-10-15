import { useEffect } from 'react'
import connectWallet from 'app/main-app/wallet'
import MyAssetsGrid from './MyAssetsGrid'
import { useGlobal } from 'reactn'
import { globalKeys } from 'app/store'

const Container = props => {
    const [walletInfo, setWalletInfo] = useGlobal(globalKeys.walletInfo)

    useEffect(() => {
        const walletInfo = connectWallet()
        console.log({ walletInfo })
        if(!walletInfo){
            console.log('connectWallet failed!')
            return;
        }
        const {  marketplaceContract, gameItemContract, signer, howlTokenContract } = walletInfo;
        setWalletInfo({
            marketplaceContract,
            gameItemContract,
            signer,
            howlTokenContract,
        })
    }, [])

    return (
        <>
            <MyAssetsGrid />
        </>
    )
}

export default Container
