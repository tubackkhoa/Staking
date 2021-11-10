import { toast } from "react-toastify"
import PropTypes from 'prop-types'
import { useGlobal } from "reactn"
import { configs } from 'config/config'
import { globalKeys } from "config/globalKeys"
import { lang } from "lang"

// const requestBscTestNet = 

const defaultProps = {
    onSuccess: () => null,
    onFailed: () => null,
}

export const checkNetworkAndRequest = async ({ 
        chainId = configs.Networks.BscTestnet.ChainId.hex,
        rpcUrl = configs.Networks.BscTestnet.RPCEndpoints,
        onSuccess, 
        onFailed 
    } = defaultProps) => {
    // Check if MetaMask is installed
    // MetaMask injects the global API into window.ethereum
    if (window && window?.ethereum) {
        try {
            // check if the chain to connect to is installed
            const resSwitch = await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId }], // chainId must be in hexadecimal numbers
            })
            // switched
            if (onSuccess) onSuccess()
        } catch (switchError) {
            console.log('Check switchError = ' + JSON.stringify(switchError))
            if (switchError?.code === 4902) {
                // This error code indicates that the chain has not been added to MetaMask.
                toast.warning(lang().accessToCorrectNetwork)
                try {
                    const results = await window?.ethereum?.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId,
                                rpcUrl,
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
                toast.error(lang().nefusingConnectNetwork)
                if (onFailed) onFailed()
                return
            }
            if (switchError?.code === -32002) {
                // "Request of type 'wallet_switchEthereumChain' already pending for origin
                toast.warning(lang().transferRequestSent)
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
