//-------------------- IMPORT MODULES ------------------------------------

import { configureStore, createSlice } from "@reduxjs/toolkit"; //createSelector is for memoization,uses the 'reselect' lib,and..
//import logger from "redux-logger"; //creating a cache of every selector,so when we retrieve something..
//from the store its returning the cached values if they havent changed

//------------------ SLICES -----------------------------------------------

export const dataReducer = createSlice({
  name: "data",
  initialState: {
    currentUser: {},
    isLoading: false,
    entities: {},
  },
  reducers: {
    SET_LOGGED_AS: (state, action) => {
      // Redux Toolkit allows to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.currentUser = action.payload;
    },
    TOGGLE_IS_LOADING: (state) => {
      state.isLoading = !state.isLoading;
    },
    ENTITIES_LOADED: (state, action) => {
      state.entities = action.payload;
    },
  },
});

// export const countReducer = createSlice({
//   name: "tests",
//   initialState: {
//     counter: 0,
//   },
//   reducers: {
//     INCREASE_COUNTER: (state) => {
//       // Redux Toolkit allows to write "mutating" logic in reducers. It
//       // doesn't actually mutate the state because it uses the Immer library,
//       // which detects changes to a "draft state" and produces a brand new
//       // immutable state based off those changes
//       state.counter++;
//     },
//     DECREASE_COUNTER: (state) => {
//       state.counter--;
//     },
//     SET_INITIAL_COUNTER: (state, action) => {
//       state.counter = action.payload;
//     },
//   },
// });

//--------------------- STORE CONFIG ---------------------------------------

export const store = configureStore({
  //reduxjs/toolkit runs combineReducers automatically and gets Thunk middleware tool/redux devtools
  reducer: {
    // tests: countReducer.reducer,
    data: dataReducer.reducer,
  },
  //devTools: false,
  //enhancers: [devToolsEnhancer({ realtime: true })],
  //middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger), // Store has all of the default middleware added, and we add the 'logger' middleware
});

//----------------------- EXPORTS --------------------------------------------

//Action creators are generated for each case reducer function
// export const { INCREASE_COUNTER, DECREASE_COUNTER, SET_INITIAL_COUNTER } =
//   countReducer.actions;

export const { SET_LOGGED_AS, TOGGLE_IS_LOADING, ENTITIES_LOADED } =
  dataReducer.actions;

//-----------------------------------------------------------------------------
