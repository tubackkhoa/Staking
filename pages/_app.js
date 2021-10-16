import MainAppContainer from 'app/main-app'
import 'styles/index.scss'
import React, { setGlobal } from 'reactn'
import { globalKeys } from 'app/store'

// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

setGlobal({
    [globalKeys.itemSelect]: null,
    [globalKeys.walletInfo]: {
        marketplaceContract: null,
        gameItemContract: null,
        signer: null,
        howlTokenContract: null,
    },
})

// export default MainAppContainer

// const AppContainer = () => {
//     return (
//         <div>
//             <MainAppContainer/>
//             {/* <ToastContainer /> */}
//         </div>
//     );
// }

export default MainAppContainer