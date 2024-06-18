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

import * as styles from './TrialPack.modules.scss';
import React from 'react';
import useStores from '../../hooks/useStores';
import { useEditor2d } from '../../hooks/useEditor2d';
import Header from '../Header';
import AsideLeft from '../AsideLeft';
import AsideRight from '../AsideRight';
import Main from '../Main';
import {STR_URL_EMPTY} from '../../utils/constants';

/**
 * React GUI client calls custom hook represents controller

 * @licence - GPLv3
 * @author - Copyright (c) 2024 Andrey Miroshnichenko <merzsh@gmail.com, https://github.com/merzsh>
 */
function TrialPack() {
  const { store } = useStores();
  store.paymentController = useEditor2d();

  React.useEffect(() => {
    return () => {};
  }, []);

  /*function onClickTest() {
  }*/

  // React TSX-HTML component view of UI
  return <div className={`${styles['trial-pack']}`}>
    <header>
      <Header />
    </header>

    <aside className={`${styles['trial-pack__aside-right']}`}>
      <AsideRight />
    </aside>

    <aside className={`${styles['trial-pack__aside-left']}`}>
      <AsideLeft />
    </aside>

    <main>
      <Main />
    </main>

    <footer className={`${styles['trial-pack__footer']}`}>
      <div className={`${styles['trial-pack__footer__left']}`}>
        <span>Merzsh Technologies</span> <span>is moving towards efficiency!</span><br/><br/><br/>
        All rights reserved &#xA9;
        <br/><br/>
        Licensed under GPL ver.3
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