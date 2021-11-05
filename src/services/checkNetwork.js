import { toast } from "react-toastify"
import PropTypes from 'prop-types'
import { useGlobal } from "reactn"
import { configs } from 'config/config'
import { globalKeys } from "config/globalKeys"

// const requestBscTestNet = 

const defaultProps = {
    onSuccess: () => null,
    onFailed: () => null,
}

export const checkNetworkAndRequest = async ({ onSuccess, onFailed } = defaultProps) => {
    // Check if MetaMask is installed
    // MetaMask injects the global API into window.ethereum
    if (window && window?.ethereum) {
        try {
            // check if the chain to connect to is installed
            const resSwitch = await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: configs.Networks.BscTestnet.ChainId.hex }], // // chainId must be in hexadecimal numbers
            })
            // switched
            if (onSuccess) onSuccess()
        } catch (switchError) {
            console.log('Check switchError = ' + JSON.stringify(switchError))
            if (switchError?.code === 4902) {
                // This error code indicates that the chain has not been added to MetaMask.
                toast.warning('Cần truy cập đúng mạng BSC Testnet để có thể sử dụng được các tính năng của chợ!')
                try {
                    const results = await window?.ethereum?.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: configs.Networks.BscTestnet.ChainId.hex,
                                rpcUrl: configs.Networks.BscTestnet.RPCEndpoints,
                            },
                        ],
                    }).then((success) => {
                        console.log('Check success = ' + JSON.stringify(success))
                        if (success) {
                            console.log('FOO successfully added to wallet!')
                        } else {
                            throw new Error('Something went wrong.')
                        }
                    })
                    console.log('Check results = ' + JSON.stringify(results))
                } catch (addError) {
                    console.log('Check addError = ' + JSON.stringify(addError))
                }
                return
            }
            if (switchError?.code === 4001) {
                // "User rejected the request.
                toast.error('Từ chối chuyển đúng mạng sẽ khiến bạn không thể lấy được danh sách xe!')
                if (onFailed) onFailed()
                return
            }
            if (switchError?.code === -32002) {
                // "Request of type 'wallet_switchEthereumChain' already pending for origin
                toast.warning('Đã gửi yêu cầu chuyển mạng, vui lòng kiểm tra danh sách yêu cầu ở ví metamask của bạn!')
                if (onFailed) onFailed()
                return
            }
            // handle other "switch" errors
        }
    } else {
        // if no window.ethereum then MetaMask is not installed
        alert(lang().notInstallMetamask)
    }
}
