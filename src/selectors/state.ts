import {createSelector} from '@reduxjs/toolkit';
import {RootState, UserAccount} from 'types';

export const getAuthData = (state: RootState) => state.app.auth;

// Managed Accounts
export const getUserAccounts = (state: RootState) => state.app.managed_accounts;

// User Accounts
export const getUserProfiles = (state: RootState) => state.users.profiles;
export const getUserAccountBalances = (state: RootState) => state.users.balances;
