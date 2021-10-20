import CreateSale from './CreateSale'

const Container = props => {
    return (
        <div className="flex flex-1 pt-16 flex-col">
            {/* <h1 className="flex text-white font-bold text-4xl">
                Create new sale
            </h1> */}
            <CreateSale />
        </div>
    )
}

export default Container
