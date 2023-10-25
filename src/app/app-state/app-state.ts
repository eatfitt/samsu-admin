import { UserState, userReducer } from "./user";

export interface AppState {
    user: UserState;
}

export const appReducer = {
    user: userReducer
}

// const initialState: AppState = {
//     userState: null
// } 150, s3 cloudfront
