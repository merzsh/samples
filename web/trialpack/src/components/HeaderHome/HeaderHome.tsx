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

import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStores from '../../hooks/useStores';
import * as styles from './HeaderHome.modules.scss';
require('../../resources/go.png');

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
    navigate('/' + selectedApp ?? '#');
    //navigate('https://www.yandex.ru');
    //navigate('/qwe');
  }

  return <div className={`${styles['header']}`}>
    <div className={`${styles['header__back']}`}>
      <div className={`${styles['header__back__left']}`}>
        <select className={`${styles['header__back__left__selector']}`}
                name={'app-selector'} defaultValue={'header'}
                onChange={onSelectApp}>
          <option value='header' disabled>Select application</option>
          {[...store.appList.keys()].map((item, index) =>
            <option key={index} value={item}>{store.appList.get(item)?.shortName}</option>)}
        </select>
        <img src={'./img/go.png'} alt={'go'} onClick={onClickGo}/>
      </div>
      <div className={`${styles['header__back__between']}`}>
        <div className={`${styles['header__back__between__top']}`}></div>
        <div className={`${styles['header__back__between__bottom']}`}></div>
      </div>
      <div className={`${styles['header__back__right']}`}></div>
    </div>
    <h2>
      {title}
    </h2>
  </div>;
}

export default HeaderHome;