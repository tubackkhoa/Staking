import { MainAppContextProvider } from 'app/_shared/MainAppContext/MainAppContext'
import MainApp from './MainApp'

export default function MainAppContainer(props) {
    return (
        <MainAppContextProvider>
            <MainApp {...props} />
        </MainAppContextProvider>
    )
}
