import { createReducer, on, createAction, props, createSelector } from '@ngrx/store';
import { SocialUser } from '../../utils/social-login/public-api';
import { AppState } from './app-state';

export interface Jwt {
  email: string,
  firstTime: boolean,
  jwtToken: JwtToken,
}
export interface JwtToken {
  accessToken: string,
  tokenType: string,
}

export interface UserSummary {
  name: string,
  role: string,
  status: string,
  dob: string,
  department: string,
}
export interface UserState {
  socialUser: SocialUser,
  jwt: Jwt,
  userSummary: UserSummary,
}
export const initialState: UserState = {
  socialUser: {} as SocialUser,
  jwt: {} as Jwt,
  userSummary: {} as UserSummary,
};

export const userState = (state: AppState) => state.user;

// Actions
export const setUserSocialUser = createAction('[User] Set Social User', props<{ socialUser: SocialUser }>());
export const setUserJwt = createAction('[User] Set Jwt', props<{ jwt: Jwt }>());
export const setUserUserSummary = createAction('[User] Set User Summary', props<{ userSummary: UserSummary }>());


// Reducer
export const userReducer = createReducer(
  initialState,
  on(setUserSocialUser, (state, { socialUser }) => ({... state, socialUser: socialUser})),
  on(setUserJwt, (state, { jwt }) => ({... state, jwt: jwt})),
  on(setUserUserSummary, (state, { userSummary }) => ({... state, userSummary: userSummary})),
);

// Selector
export const getUserSocialUserState = createSelector(userState, (state: UserState) => {
  return state.socialUser;
})
export const getUserJwtState = createSelector(userState, (state: UserState) => {
  return state.jwt;
})
export const setUserUserSummaryState = createSelector(userState, (state: UserState) => {
  return state.userSummary;
})
