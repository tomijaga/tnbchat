import {RootState} from 'types';

export const getAuthData = (state: RootState) => state.app.auth;
