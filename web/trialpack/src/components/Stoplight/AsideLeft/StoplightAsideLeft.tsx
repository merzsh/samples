/**
 * TrialPack is web application contains several basic samples to ease web development experience.
 * Copyright (c) 2024-2025 Andrew Miroshnichenko <merzsh@gmail.com, https://github.com/merzsh>
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

import * as styles from './StoplightAsideLeft.modules.scss';
import React from 'react';
import { observer } from 'mobx-react-lite';
import useStores from '../../../hooks/useStores';
import { StateNames } from '../../../hooks/useStoplight';

interface IStoplightAsideLeft {
  title?: string;
}

export const StoplightAsideLeft: React.FC<IStoplightAsideLeft> = ({title}): JSX.Element => {
  const { store } = useStores();

  return <div className={`${styles['stoplight-aside-left']}`} key={title} >
    <fieldset className={`${styles['stoplight-aside-left__status']}`}>
      <legend>State diagram</legend>
      <table>
        <tbody>
        <tr style={store.stlStateName === StateNames.INIT ? {background: "wheat"} : {}}>
          <td className={`${styles['stoplight-aside-left__status__td-ptr']}`}>
             {store.stlStateName === StateNames.INIT ? '>' : ''}
          </td>
          <td>
              <div className={`${styles['stoplight-aside-left__status__td-pic']}`}>
                <div id={`${styles['INIT']}`}></div>
              </div>
          </td>
          <td className={`${styles['stoplight-aside-left__status__td-state']}`}>INIT</td>
        </tr>
        <tr style={store.stlStateName === StateNames.RED ? {background: "wheat"} : {}}>
          <td className={`${styles['stoplight-aside-left__status__td-ptr']}`}>
            {store.stlStateName === StateNames.RED ? '>' : ''}
          </td>
          <td>
            <div className={`${styles['stoplight-aside-left__status__td-pic']}`}>
              <div id={`${styles['RED']}`}></div>
            </div>
          </td>
          <td className={`${styles['stoplight-aside-left__status__td-state']}`}>RED</td>
        </tr>
        <tr style={store.stlStateName === StateNames.RED_YELLOW ? {background: "wheat"} : {}}>
          <td className={`${styles['stoplight-aside-left__status__td-ptr']}`}>
            {store.stlStateName === StateNames.RED_YELLOW ? '>' : ''}
          </td>
          <td>
            <div className={`${styles['stoplight-aside-left__status__td-pic']}`}>
              <div id={`${styles['RED_YELLOW']}`}></div>
            </div>
          </td>
          <td className={`${styles['stoplight-aside-left__status__td-state']}`}>RED_YELLOW</td>
        </tr>
        <tr style={store.stlStateName === StateNames.GREEN ? {background: "wheat"} : {}}>
          <td className={`${styles['stoplight-aside-left__status__td-ptr']}`}>
            {store.stlStateName === StateNames.GREEN ? '>' : ''}
          </td>
          <td>
            <div className={`${styles['stoplight-aside-left__status__td-pic']}`}>
              <div id={`${styles['GREEN']}`}></div>
            </div>
          </td>
          <td className={`${styles['stoplight-aside-left__status__td-state']}`}>GREEN</td>
        </tr>
        <tr style={store.stlStateName === StateNames.GREEN_BLINKING ? {background: "wheat"} : {}}>
          <td className={`${styles['stoplight-aside-left__status__td-ptr']}`}>
            {store.stlStateName === StateNames.GREEN_BLINKING ? '>' : ''}
          </td>
          <td>
            <div className={`${styles['stoplight-aside-left__status__td-pic']}`}>
              <div id={`${styles['GREEN_BLINKING']}`}></div>
            </div>
          </td>
          <td className={`${styles['stoplight-aside-left__status__td-state']}`}>GREEN_BLINKING</td>
        </tr>
        <tr style={store.stlStateName === StateNames.YELLOW ? {background: "wheat"} : {}}>
          <td className={`${styles['stoplight-aside-left__status__td-ptr']}`}>
            {store.stlStateName === StateNames.YELLOW ? '>' : ''}
          </td>
          <td>
            <div className={`${styles['stoplight-aside-left__status__td-pic']}`}>
              <div id={`${styles['YELLOW']}`}></div>
            </div>
          </td>
          <td className={`${styles['stoplight-aside-left__status__td-state']}`}>YELLOW</td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
          <th colSpan={3} style={{textAlign: "left"}}>Timer value: {store.stlCountdownStr}</th>
        </tr>
        </tfoot>
      </table>
    </fieldset>
  </div>;
}

export default observer(StoplightAsideLeft);
