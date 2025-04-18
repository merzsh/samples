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

import * as styles from './Stoplight.modules.scss';
import React from 'react';
import { observer } from 'mobx-react-lite';
import useStores from '../../hooks/useStores';
import { StateValue } from '../../hooks/useStoplight';
import { STL_STR_CLASS_MAIN, STL_STR_OPACITY_OFF, STL_STR_OPACITY_ON } from '../../utils/constants';
require('../../resources/stoplight/stoplight.jpg');

interface IStoplight {
  title?: string;
}

export const Stoplight: React.FC<IStoplight> = ({title}): JSX.Element => {
  const { store } = useStores();

  React.useEffect(() => {
    return () => {};
  }, []);

  React.useEffect(() => {
    if (store?.stlController) {
      store.stlController.registerStateHandler(onStateChange);
    }
  }, [store.stlController]);

  /**
   * Finite state machine (stoplight) changing each state event handler.
   * It helps to detect moment when UI have to be refreshed.
   *
   * @param stateValue - payload value of each state
   */
  function onStateChange(stateValue: StateValue) {
    if(!stateValue) throw new ReferenceError('Error: state value is initial!');

    store.stlOpacityRed = stateValue.isLightRed ? STL_STR_OPACITY_ON : STL_STR_OPACITY_OFF;
    store.stlOpacityYellow = stateValue.isLightYellow ? STL_STR_OPACITY_ON : STL_STR_OPACITY_OFF;
    store.stlOpacityGreen = stateValue.isLightGreen ? STL_STR_OPACITY_ON : STL_STR_OPACITY_OFF;

    const countdownSec = Math.round(stateValue.countdownMs / 1000);
    const countdownSecStr = countdownSec < 10 ? '0' + countdownSec : countdownSec.toString();

    store.stlCountdownStr = stateValue.countdownMs >= 1000 ? countdownSecStr :
      (stateValue.countdownMs > 0 && stateValue.countdownMs < 1000 ? '--' : '');

    store.stlStateName = stateValue.stateName;
  }

  return <div className={`${styles[STL_STR_CLASS_MAIN]}`} key={title}>
    <div className={`${styles[`${STL_STR_CLASS_MAIN}__image`]}`}>
      <div className={`${styles[`${STL_STR_CLASS_MAIN}__image__red`]}`}
           style={{opacity: store.stlOpacityRed}}></div>
      <div className={`${styles[`${STL_STR_CLASS_MAIN}__image__yellow`]}`} style={{
        opacity: store.stlOpacityYellow,
        color: store.stlOpacityRed === STL_STR_OPACITY_OFF ? 'green' : 'red'
      }}>
        {store.stlCountdownStr}
      </div>
      <div className={`${styles[`${STL_STR_CLASS_MAIN}__image__green`]}`}
           style={{opacity: store.stlOpacityGreen}}></div>

    </div>
    <div className={`${styles[`${STL_STR_CLASS_MAIN}__statusbar`]}`}>
      <textarea name="text" placeholder="Status bar:" value={store.stlMessage}
                rows={1} disabled></textarea>
    </div>
  </div>;
}

export default observer(Stoplight);
