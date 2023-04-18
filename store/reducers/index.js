import { initialState } from "./initialState";
import userProfileReducer from "./userProfileReducer";
import appStateReducer from "./appStateReducer";
import modulesDataReducer from "./modulesDataReducer";

const combineReducers = (reducers) => {
  return (state, action) => {
    return Object.keys(reducers).reduce((acc, prop) => {
      return {
        ...acc,
        ...reducers[prop]({ [prop]: acc[prop] }, action),
      };
    }, state);
  };
};

const appReducers = combineReducers({
  userProfile: userProfileReducer,
  appState: appStateReducer,
  modulesData: modulesDataReducer,
});

export { initialState, appReducers };
