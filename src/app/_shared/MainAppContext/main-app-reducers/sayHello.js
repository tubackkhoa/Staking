const sayHello = (state, action) => {
    const { payload: args } = action
    const { greeting } = args

    return {
        ...state,
        greeting,
    }
}

export default sayHello
