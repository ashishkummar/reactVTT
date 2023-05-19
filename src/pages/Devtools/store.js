// Redux store file: store.js

import { configureStore } from '@reduxjs/toolkit';

const initialState = {
  VdeoQ: null,
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_VDEOQ':
      return { ...state, VdeoQ: action.payload };
    default:
      return state;
  }
}

const store = configureStore(rootReducer);

export default store;
