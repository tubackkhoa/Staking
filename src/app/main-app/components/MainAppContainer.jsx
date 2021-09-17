import { MainAppContextProvider } from 'app/_shared/main-app-context/MainAppContext'
import MainApp from './MainApp'

export default function MainAppContainer(props) {
    return (
        <MainAppContextProvider>
            <MainApp {...props} />
        </MainAppContextProvider>
    )
}
