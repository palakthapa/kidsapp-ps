const modulesDataReducer = function (state = {}, action) {
    switch (action.type) {
        case "setModulesData":
            state.modulesData.modules = action.payload;
            break;
        case "setItemsData":
            state.modulesData.items = action.payload;
            break;
        default:
            break;
    }
    return state;
}

export default modulesDataReducer;