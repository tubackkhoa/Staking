const sayHello = (state, action) => {
    const { payload: args } = action
    const { data } = args

    return {
        ...state,
        ...data,
    }
}

export default sayHello
