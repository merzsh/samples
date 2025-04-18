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

import React, {useEffect, useState} from 'react';
import * as styles from './Teller.modules.scss';
import {useSelector} from 'react-redux';
import {STR_TELLER_DEFAULT_SLICE_ID, TellerState} from "./store/tellerReducers";

interface ITeller {
  title?: string;
}

export const Teller: React.FC<ITeller> = ({title}): JSX.Element => {

  const state = useSelector(state => state);
  const defaultState = useSelector(state => (state as any)[STR_TELLER_DEFAULT_SLICE_ID]) as TellerState;
  const [temp, setTemp] = useState('');

  useEffect(() => {
    console.log(12345, 'Teller.useEffect[defaultState]', defaultState);
  }, [defaultState]);

  async function onClick() {
    let response: Response;
    try {
      response = await fetch('/api/trialpack/teller/some_endpoint?arg=123');
      if (!response.ok) {
        console.log(12345, `Teller.onClick(): fetch unknown error, status is '${response.statusText}'!`);
        return;
      }
      console.log(12345, `Teller.onClick(): fetch is OK, response is`, response);

      try {
        const json = await response.json();
        console.log(12345, `Teller.onClick(): fetch is OK, JSON result is`, json);
      } catch (err) {
        console.log(12345, 'Teller.onClick(): fetch answer to JSON parse error!', err);
      }
    } catch (ex) {
      console.log(12345, 'Teller.onClick(): fetch error', ex);
    }
  }

  return (
    <div>
      <button onClick={onClick}>Teller</button>
      <input name={'qwerty'}
             value={temp} size={19} disabled
      />
    </div>
  );
}

export default Teller;
