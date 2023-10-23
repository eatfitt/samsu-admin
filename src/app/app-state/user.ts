import { createReducer, on, createAction, props, createSelector } from '@ngrx/store';
import { SocialUser } from '../../utils/social-login/public-api';

export interface Jwt {
  email: string,
  firstTime: boolean,
  jwtToken: JwtToken,
}
export interface JwtToken {
  accessToken: string,
  tokenType: string,
}
export interface UserState {
  user: SocialUser,
  jwt: Jwt
}
export const initialState: UserState = {
  user: {} as SocialUser,
  jwt: {} as Jwt,
};

const userState = (state: UserState) => state;

// Actions
export const increment = createAction('[User] Increment');
export const decrement = createAction('[User] Decrement');
export const reset = createAction('[User] Reset');
export const setUser = createAction('[User] Set User', props<UserState>());


// Reducer
export const userReducer = createReducer(
  initialState,
  on(setUser, (state, { user }) => ({... state, user}))
);

// Selector
export const getUserUserState = createSelector(userState, (state: UserState) => {
  return state.user;
})
export const getUserJwtState = createSelector(userState, (state: UserState) => {
  return state.jwt;
})