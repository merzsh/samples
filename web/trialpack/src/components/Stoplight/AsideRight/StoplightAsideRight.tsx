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

import * as styles from './StoplightAsideRight.modules.scss';
import React from 'react';
import {observer} from 'mobx-react-lite';
import useStores from '../../../hooks/useStores';
import {initSettingsStoplight, StoplightControls} from '../../../utils/constants';

interface IStoplightAsideRight {
  title?: string;
}

export const StoplightAsideRight: React.FC<IStoplightAsideRight> = ({title}): JSX.Element => {
  const { store } = useStores();

  const timerInitial = setInterval(onTimer, 10000000);
  const timer = React.useRef(timerInitial);

  const INT_TIMER_INCREMENT_MS = 100;
  const INT_TIMER_DELAY_GREEN_BLINK_MS = 200;

  // cals when UI blocked/unblocked (run/stop commands)
  React.useEffect(() => {
    clearInterval(timer.current);
    if(store.stlIsSettingsDisabled) {
      timer.current = setInterval(onTimer, INT_TIMER_INCREMENT_MS);
    }
  }, [store.stlIsSettingsDisabled]);

  /**
   * 'Initialize state' button handler. Guides stoplight to its initial state.
   */
  function onClickInit() {
    if(store.stlController) {
      store.stlController.init();
    }
  }

  /**
   * 'Reset settings' button handler. Resets stoplight all lifecycle options to its initial values.
   */
  function onClickReset() {
    if(store.stlController) {
      store.stlController.reset(initSettingsStoplight);
      store.stlSettings = initSettingsStoplight;
    }
  }

  /**
   * 'Go to next state' button handler. Guides stoplight to its next state.
   */
  function onClickNext() {
    if (store.stlController) {
      store.stlController.next();
    }
  }

  /**
   * 'Run' button handler. Runs stoplight work.
   */
  function onClickRun() {
    if (store.stlController) {
      store.stlIsSettingsDisabled = true;
      store.stlController.run();
    }
  }

  /**
   * 'Stop' button handler. Finishes stoplight work.
   */
  function onClickStop() {
    store.stlIsSettingsDisabled = false;
    if (store.stlController) {
      store.stlController.init();
    }
  }

  /**
   * Validates user input.
   *
   * @param value - input value
   */
  function onChangeEditBoxValue(value: any) {
    store.stlMessage = '';
    switch(value.target.name){
      case StoplightControls.FULL_CYCLE_TIME_SEC:
        if(value.target.valueAsNumber <= 0 || value.target.valueAsNumber > 3600) {
          store.stlMessage = 'Error, set full cycle time within range [1-3600] in seconds!';
        }
        store.stlSettings = {...store.stlSettings, [StoplightControls.FULL_CYCLE_TIME_SEC]: value.target.valueAsNumber};
        store.stlController?.setProps(store.stlSettings);
        break;
      case StoplightControls.LIGHT_PERCENT_RED:
      case StoplightControls.LIGHT_PERCENT_RED_YELLOW:
      case StoplightControls.LIGHT_PERCENT_GREEN:
      case StoplightControls.LIGHT_PERCENT_GREEN_BLINKING:
      case StoplightControls.LIGHT_PERCENT_YELLOW:
        if(value.target.valueAsNumber < 0 || value.target.valueAsNumber > 100) {
          store.stlMessage = 'Error, set part of full cycle time [0-100] in %!';
        }
        store.stlSettings = {...store.stlSettings, [value.target.name]: value.target.valueAsNumber};
        store.stlController?.setProps(store.stlSettings);
        break;
      default:
        throw new Error(`Dev error: there is no edit control with name '${value.target.name}'!`);
    }
  }

  /**
   * Handler of timer tics (tact).
   */
  function onTimer() {
    if (store.stlController) {
      store.stlController.nextTact(INT_TIMER_INCREMENT_MS, INT_TIMER_DELAY_GREEN_BLINK_MS);
    }
  }

  return <div className={`${styles['aside-right-stoplight']}`} key={title}>
    <fieldset className={`${styles['aside-right-stoplight__status']}`/*'st-toolbar-control'*/}>
      <legend>Control bar</legend>
      <div className={`${styles['aside-right-stoplight__status__pad']}`}>
        <div className={`${styles['aside-right-stoplight__status__pad__btn']}`}>
          <button onClick={onClickInit} disabled={store.stlIsSettingsDisabled}>
            Initialize state O
          </button>
          <button onClick={onClickReset} disabled={store.stlIsSettingsDisabled}>
            Reset settings X
          </button>
          <button onClick={onClickNext} disabled={store.stlIsSettingsDisabled}>
            Go to next state &gt;
          </button>
          <button onClick={onClickRun} disabled={store.stlIsSettingsDisabled}>
            Run &gt;|
          </button>
          <button onClick={onClickStop} disabled={!store.stlIsSettingsDisabled}>
            Stop []
          </button>
        </div>
        <div className={`${styles['aside-right-stoplight__status__pad__fld']}`}>
          <table>
            <tbody>
            <tr>
              <td className={`${styles['aside-right-stoplight__status__pad__fld__label']}`}>Cycle full time, sec.</td>
              <td className={`${styles['aside-right-stoplight__status__pad__fld__input']}`}>
                <input type={'number'} name={StoplightControls.FULL_CYCLE_TIME_SEC}
                       value={store.stlSettings[StoplightControls.FULL_CYCLE_TIME_SEC]}
                       onChange={onChangeEditBoxValue} size={5} min={1} max={3600} step={1}
                       disabled={store.stlIsSettingsDisabled}></input>
              </td>
            </tr>
            <tr>
              <td className={`${styles['aside-right-stoplight__status__pad__fld__label']}`}>Red light, % of time</td>
              <td className={`${styles['aside-right-stoplight__status__pad__fld__input']}`}>
                <input type={'number'} name={StoplightControls.LIGHT_PERCENT_RED}
                       value={store.stlSettings[StoplightControls.LIGHT_PERCENT_RED]}
                       onChange={onChangeEditBoxValue} size={5} min={1} max={100} step={1}
                       disabled={store.stlIsSettingsDisabled}></input>
              </td>
            </tr>
            <tr>
              <td className={`${styles['aside-right-stoplight__status__pad__fld__label']}`}>Red & Yellow, % of time</td>
              <td className={`${styles['aside-right-stoplight__status__pad__fld__input']}`}>
                <input type={'number'} name={StoplightControls.LIGHT_PERCENT_RED_YELLOW}
                       value={store.stlSettings[StoplightControls.LIGHT_PERCENT_RED_YELLOW]}
                       onChange={onChangeEditBoxValue} size={5} min={1} max={100} step={1}
                       disabled={store.stlIsSettingsDisabled}></input>
              </td>
            </tr>
            <tr>
              <td className={`${styles['aside-right-stoplight__status__pad__fld__label']}`}>Green light, % of time</td>
              <td className={`${styles['aside-right-stoplight__status__pad__fld__input']}`}>
                <input type={'number'} name={StoplightControls.LIGHT_PERCENT_GREEN}
                       value={store.stlSettings[StoplightControls.LIGHT_PERCENT_GREEN]}
                       onChange={onChangeEditBoxValue} size={5} min={1} max={100} step={1}
                       disabled={store.stlIsSettingsDisabled}></input>
              </td>
            </tr>
            <tr>
              <td className={`${styles['aside-right-stoplight__status__pad__fld__label']}`}>Green blinking, % of time</td>
              <td className={`${styles['aside-right-stoplight__status__pad__fld__input']}`}>
                <input type={'number'} name={StoplightControls.LIGHT_PERCENT_GREEN_BLINKING}
                       value={store.stlSettings[StoplightControls.LIGHT_PERCENT_GREEN_BLINKING]}
                       onChange={onChangeEditBoxValue} size={5} min={1} max={100} step={1}
                       disabled={store.stlIsSettingsDisabled}></input>
              </td>
            </tr>
            <tr>
              <td className={`${styles['aside-right-stoplight__status__pad__fld__label']}`}>Green blinking, % of time</td>
              <td className={`${styles['aside-right-stoplight__status__pad__fld__input']}`}>
                <input type={'number'} name={StoplightControls.LIGHT_PERCENT_YELLOW}
                       value={store.stlSettings[StoplightControls.LIGHT_PERCENT_YELLOW]}
                       onChange={onChangeEditBoxValue} size={5} min={1} max={100} step={1}
                       disabled={store.stlIsSettingsDisabled}></input>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </fieldset>
  </div>;
}

export default observer(StoplightAsideRight);
