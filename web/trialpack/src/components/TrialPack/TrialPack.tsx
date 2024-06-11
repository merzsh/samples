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

import React, {Reducer, useReducer, useRef, useState} from 'react';
import * as styles from './TrialPack.modules.scss';
import useStores from '../../hooks/useStores';
import {useEditor2d} from '../../hooks/useEditor2d';
import Header from '../Header';

/**
 * React GUI client calls custom hook represents stoplight finite state machine

 * @licence - GPLv3
 * @author - Copyright (c) 2024 Andrey Miroshnichenko <merzsh@gmail.com, https://github.com/merzsh>
 */
function TrialPack() {
  const { store } = useStores();
  store.paymentController = useEditor2d();

  const [filesList, setFilesList] = React.useState<string[]>([]);
  const currFileRef = React.useRef<string>('');

  React.useEffect(() => {
    return () => {};
  }, []);

  function onClickNewFile() {
    const num = (store.filesList.length + 1).toString();
    store.filesList.push(`Untitled-${num}`);
    setFilesList(store.filesList.slice());
  }

  function onClickCloseFile(event: React.MouseEvent<HTMLElement>) {
    const target = (event.target as any);
    const fileName = (target.id as string).substring('idFileBtn'.length);
    store.filesList = store.filesList.filter(item => item !== fileName);
    setFilesList(store.filesList.slice());
    console.log(fileName, store.filesList.slice());
  }

  function onClickFileSelected(event: React.MouseEvent<HTMLElement>) {
    const fileName = (event.target as any).firstChild.data;
    const div = document.getElementById(`idFileDiv${fileName}`);
    if (div) {
      if (currFileRef.current) {
        const divPrev = document.getElementById(`idFileDiv${currFileRef.current}`);
        if (divPrev) divPrev.className = '';
      }
      div.className = `${styles['file-selected']}`;
      currFileRef.current = fileName;
    }
  }

  function onClickTest() {
  }

  // React TSX-HTML component view of UI
  return <div className={`${styles['trial-pack']}`}>
    <header>
      <Header />
    </header>

    <aside className={`${styles['trial-pack__aside-right']}`}>
      <nav>
        <button>Object options</button>
        <button>Common settings</button>
      </nav>
      <h4>The standard Lorem Ipsum passage</h4>
      <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</p>
    </aside>

    <aside className={`${styles['trial-pack__aside-left']}`}>
      <details>
        <summary>File management</summary>
        <input type={'button'} onClick={onClickNewFile} value={'New file ...'}
               style={{margin: '10px', padding: '5px', border: '1px solid lightgray'}}></input>
      </details>
      <details>
        <summary>Draw figure</summary>
        <p>Spoiler content 2</p>
      </details>
      <details>
        <summary>Format options</summary>
        <p>Spoiler content 3</p>
      </details>
    </aside>

    <main>
      <nav>
        <ul>
          {
            filesList.map(item => {
              return <li key={`liKey${item}`}>
                <div id={`idFileDiv${item}`} onClick={onClickFileSelected}>
                  <span>{item}</span>
                  <button id={`idFileBtn${item}`} onClick={onClickCloseFile}>X</button>
                </div>
              </li>
            })
          }
        </ul>
      </nav>
    </main>
    <footer className={`${styles['trial-pack__footer']}`}>
      <div className={`${styles['trial-pack__footer__left']}`}>
        <span>Merzsh Technologies</span> <span>is moving towards efficiency!</span><br/><br/><br/>
        All rights reserved &#xA9;
        <br/><br/>
        Licensed under GPL v.3
      </div>
      <div className={`${styles['trial-pack__footer__right']}`}>
        <ul>
          <li>About us</li>
          <li><a href="https://github.com/merzsh/samples" target="_blank">GitHub repo</a></li>
          <li><a href="#">User guide</a></li>
          <li><a href="#">Media relations</a></li>
        </ul>
        <ul>
          <li>Our partners</li>
          <li><a href="#">Partners list</a></li>
          <li><a href="#">Become partner</a></li>
        </ul>
      </div>
    </footer>
  </div>;
}

export default TrialPack;