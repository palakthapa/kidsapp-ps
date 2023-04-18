const appStateReducer = function (state = {}, action) {
  switch (action.type) {
    case "setLoadingState":
      state.appState.isLoading = action.payload;
      break;
    case "setErrorState":
      state.appState.isError = action.payload;
      break;
    default:
      break;
  }
  return state;
}

export default appStateReducer;