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

import * as styles from './TrialPack.modules.scss';
import React from 'react';
import useStores from '../../../hooks/useStores';
import MainHeader from '../MainHeader';
import MainAsideLeft from '../AsideLeft';
import MainAsideRight from '../AsideRight';
import Main from '../index';
import { useStoplight, UseStoplightResult } from '../../../hooks/useStoplight';
import { useEditor2d, UseEditor2dResult } from '../../../hooks/useEditor2d';
import {STR_TRAILPACK_VERSION, STR_URL_EMPTY} from '../../../utils/constants';

function TrialPack() {

  const { store } = useStores();
  const stlController = React.useRef<UseStoplightResult>(useStoplight());
  const e2dController = React.useRef<UseEditor2dResult>(useEditor2d());

  React.useEffect(() => {
    initControllers();

    return () => {};
  }, []);

  function initControllers() {
    if (!store?.stlController) {
      store.stlController = stlController.current;
    }
    if (!store?.e2dController) {
      store.e2dController = e2dController.current;
    }
  }

  return <div className={`${styles['trial-pack']}`}>
    <header>
      <MainHeader />
    </header>

    <aside className={`${styles['trial-pack__aside-right']}`}>
      <MainAsideRight />
    </aside>

    <aside className={`${styles['trial-pack__aside-left']}`}>
      <MainAsideLeft />
    </aside>

    <main>
      <Main />
    </main>

    <footer className={`${styles['trial-pack__footer']}`}>
      <div className={`${styles['trial-pack__footer__left']}`}>
        <span>Merzsh Technologies</span> <span>is moving toward efficiency!</span><br/>
        All rights reserved &#xA9; <br/><br/>
        Licensed under GPL v.3 <br/>
        {STR_TRAILPACK_VERSION && (
          `Product version: ${STR_TRAILPACK_VERSION}`
        )}
      </div>
      <div className={`${styles['trial-pack__footer__right']}`}>
        <ul>
          <li>About us</li>
          <li><a href="https://github.com/merzsh/samples" target="_blank">GitHub repo</a></li>
          <li><a href={STR_URL_EMPTY}>User guide</a></li>
          <li><a href={STR_URL_EMPTY}>Media relations</a></li>
        </ul>
        <ul>
          <li>Our partners</li>
          <li><a href={STR_URL_EMPTY}>Partners list</a></li>
          <li><a href={STR_URL_EMPTY}>Become partner</a></li>
        </ul>
      </div>
    </footer>
  </div>;
}

export default TrialPack;
