import { createContext, useContext, useReducer } from "react";
import { appReducers, initialState } from "./reducers";

const Context = createContext();

function AppStateProvider({ reducer, initialState, children }) {
	const value = useReducer(reducer, initialState);
	return <Context.Provider value={value}>{children}</Context.Provider>;
}

// AppStateProvider.propTypes = {
// 	reducer: func,
// 	initialState: object,
// };

function useAppState() {
	return useContext(Context);
}

export { appReducers, initialState, AppStateProvider, useAppState };
