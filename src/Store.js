import React, { createContext, useReducer } from 'react';

const initialState = {
  loading: true
};

function Reducer(state = initialState, action) {
  switch (action.type) {
    default:
      return { ...state };
  }
}

const Store = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  return (
    <Context.Provider value={[state, dispatch]}>
      {children}
    </Context.Provider>
  );
};

export const Context = createContext(initialState);
export default Store;
