/**
 * TrialPack is web application contains several basic samples to ease web development experience.
 * Copyright (c) 2024 Andrey Miroshnichenko <merzsh@gmail.com, https://github.com/merzsh>
 *
 * This file is part of TrialPack.
 *
 * TrialPack is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import {combineReducers, configureStore} from '@reduxjs/toolkit';
import tellerDefaultSlice, {STR_TELLER_DEFAULT_QUERY_ID, useGetBalanceQuery, tellerDefaultQuery} from './tellerReducers';

const reducer = combineReducers({
  tellerDefaultSlice,
  [STR_TELLER_DEFAULT_QUERY_ID]: tellerDefaultQuery.reducer,
})

const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tellerDefaultQuery.middleware),
});

export default store;
