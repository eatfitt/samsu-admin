import { SocialUser } from '@abacritt/angularx-social-login';
import { createReducer, on, createAction, props } from '@ngrx/store';

export const initialState = {
  googleUser: {} as SocialUser,
};

// Actions
export const increment = createAction('[User] Increment');
export const decrement = createAction('[User] Decrement');
export const reset = createAction('[User] Reset');
export const setUser = createAction('[User] Set User', props<{ googleUser: SocialUser }>());


// Reducer
export const userReducer = createReducer(
  initialState,
  // on(increment, (state) => state + 1),
  // on(decrement, (state) => state - 1),
  // on(reset, (state) => 0),
  on(setUser, (state, { googleUser }) => ({... state, googleUser}))
);