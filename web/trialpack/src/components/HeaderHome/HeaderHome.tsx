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

import * as styles from './HeaderHome.modules.scss';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStores from '../../hooks/useStores';
import {
  STR_CLASS_HEADER,
  STR_CLASS_HEADER__BACK, STR_CLASS_HEADER__BACK__BETWEEN,
  STR_CLASS_HEADER__BACK__BETWEEN_BOTTOM, STR_CLASS_HEADER__BACK__BETWEEN_TOP,
  STR_CLASS_HEADER__BACK__LEFT,
  STR_CLASS_HEADER__BACK__LEFT__SELECTOR, STR_CLASS_HEADER__BACK__RIGHT,
  STR_FILENAME_GO,
  STR_FILENAME_GO_PNG,
  STR_FILENAME_IMG,
  STR_FILENAME_RESOURCES,
  STR_FILENAME_UP,
  STR_FILENAME_UP_PNG,
  STR_ID_APP_SELECTOR,
  STR_ID_HEADER,
  STR_ID_HEADER_APP_SELECTOR,
  STR_URL_EMPTY,
  STR_URL_ROOT
} from '../../utils/constants';
require(`../../${STR_FILENAME_RESOURCES}/${STR_FILENAME_GO}/${STR_FILENAME_GO_PNG}`);
require(`../../${STR_FILENAME_RESOURCES}/${STR_FILENAME_UP}/${STR_FILENAME_UP_PNG}`);

interface IHeaderHome {
  title: string;
}

export const HeaderHome: React.FC<IHeaderHome> = ({title}): JSX.Element => {

  const navigate = useNavigate();
  const { store } = useStores();
  const [selectedApp, setSelectedApp] = React.useState('');

  function onSelectApp(value: any) {
    setSelectedApp(value.target.value);
  }

  function onClickGo() {
    navigate(`${STR_URL_ROOT}${selectedApp}` ?? STR_URL_EMPTY);
  }

  function onClickUp() {
    navigate(STR_URL_ROOT);
    const selector: any = document.getElementById(STR_ID_HEADER_APP_SELECTOR);
    if (selector) selector.value = STR_ID_HEADER;
  }

  return <div className={`${styles[STR_CLASS_HEADER]}`} key={title}>
    <div className={`${styles[STR_CLASS_HEADER__BACK]}`}>
      <div className={`${styles[STR_CLASS_HEADER__BACK__LEFT]}`}>
        <select id={STR_ID_HEADER_APP_SELECTOR} className={`${styles[STR_CLASS_HEADER__BACK__LEFT__SELECTOR]}`}
                name={STR_ID_APP_SELECTOR} defaultValue={STR_ID_HEADER}
                onChange={onSelectApp}>
          <option value={STR_ID_HEADER} disabled>Select application</option>
          {[...store.appList.keys()].map((item, index) =>
            <option key={index} value={item}>{store.appList.get(item)?.shortName}</option>)}
        </select>
        <img src={`./${STR_FILENAME_IMG}/${STR_FILENAME_GO_PNG}`} alt={STR_FILENAME_GO} onClick={onClickGo}/>
        <img src={`./${STR_FILENAME_IMG}/${STR_FILENAME_UP_PNG}`} alt={STR_FILENAME_UP} onClick={onClickUp}/>
      </div>
      <div className={`${styles[STR_CLASS_HEADER__BACK__BETWEEN]}`}>
        <div className={`${styles[STR_CLASS_HEADER__BACK__BETWEEN_TOP]}`}></div>
        <div className={`${styles[STR_CLASS_HEADER__BACK__BETWEEN_BOTTOM]}`}></div>
      </div>
      <div className={`${styles[STR_CLASS_HEADER__BACK__RIGHT]}`}></div>
    </div>
    <h2>
      {title}
    </h2>
  </div>;
}

export default HeaderHome;