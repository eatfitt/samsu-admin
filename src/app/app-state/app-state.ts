import { SemesterState, semesterReducer } from "./semester";
import { UserState, userReducer } from "./user";

export interface AppState {
    user: UserState;
    semesters: SemesterState;
}

export const appReducer = {
    user: userReducer,
    semesters: semesterReducer,
}

// const initialState: AppState = {
//     userState: null
// } 150, s3 cloudfront
