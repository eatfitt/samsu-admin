import { createReducer, on, createAction, props, createSelector } from '@ngrx/store';
import { SocialUser } from '../../utils/social-login/public-api';
import { AppState } from './app-state';

export interface SemesterState {
  semesters: string[]
}
export const initialState: SemesterState = {
  semesters: [],
};

export const semesterState = (state: AppState) => state.semesters;

// Actions
export const setSemesters = createAction('[Semester] Set Semester', props<{ semesters: string[] }>());


// Reducer
export const semesterReducer = createReducer(
  initialState,
  on(setSemesters, (state, { semesters }) => ({... state, semesters: semesters})),
);

// Selector
export const getSemesterState = createSelector(semesterState, (state: SemesterState) => {
  return state.semesters;
})
