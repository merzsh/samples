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
import {createSlice} from '@reduxjs/toolkit';
import {BaseQueryArg, createApi, EndpointBuilder, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export type TellerState = {
  temp?: string;
  apiFilter?: string;
}

export type TellerQueryGetBalanceAnswer = {
  amount: string;
}

export const STR_TELLER_DEFAULT_SLICE_ID = 'tellerDefaultSlice';
export const STR_TELLER_DEFAULT_QUERY_ID = 'tellerDefaultQuery';

function getInitStateTeller(): TellerState {
  return {
    temp: '',
    apiFilter: '',
  }
}

const { actions, reducer } = createSlice({
  name: STR_TELLER_DEFAULT_SLICE_ID,
  initialState: getInitStateTeller(),
  reducers: {
    ping: (state, {payload}) => {
      if (typeof payload === "string") {
        state.temp = payload;
      }
    },
  }
});

export const tellerDefaultQuery = createApi({
  reducerPath: STR_TELLER_DEFAULT_QUERY_ID,
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.open-meteo.com/v1/forecast',
    prepareHeaders: async (headers, { getState }) => {
      // headers.set('Access-Control-Allow-Origin', '*');
      // getState();

      return headers;
    }
  }),
  endpoints: builder => ({
    getBalance: builder.query<TellerQueryGetBalanceAnswer, string>({
      query: arg => {
        let result = '';
        try {
          const argJSON = JSON.parse(arg), latitude = 'latitude', longitude = 'longitude',
            temperatureHeight = 'temperatureHeight', windHeight = 'windHeight';
          result = `?${latitude}=${argJSON[latitude]}&${longitude}=${argJSON[longitude]}` +
            `&timezone=auto&wind_speed_unit=ms&current=is_day,cloud_cover,surface_pressure,relative_humidity_2m,` +
            `temperature_${argJSON[temperatureHeight]}m,wind_speed_${argJSON[windHeight]}m`;
        } catch (err) {
          console.log(`Query parse arg error in JSON structure! Details: ${(err as Error).message}`, err);
        }
        return result;
      }
    })
  })
});

export const {
  ping,
} = actions;

export const {
  useGetBalanceQuery,
} = tellerDefaultQuery;

export default reducer;
