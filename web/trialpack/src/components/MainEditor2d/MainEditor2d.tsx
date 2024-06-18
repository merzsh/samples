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

import * as styles from './MainEditor2d.modules.scss';
import React from 'react';
import { observer } from 'mobx-react-lite';
import useStores from '../../hooks/useStores';
import { STR_CLASS_MAIN_EDITOR_2D} from '../../utils/constants';

interface IMainEditor2d {
  title?: string;
}

export const MainEditor2d: React.FC<IMainEditor2d> = ({title}): JSX.Element => {
  const { store } = useStores();

  const currFileRef = React.useRef<string>('');

  function onClickCloseFile(event: React.MouseEvent<HTMLElement>) {
    const target = (event.target as any);
    const fileName = (target.id as string).substring('idFileBtn'.length);
    store.filesList = store.filesList.filter(item => item !== fileName);
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

  return <div className={`${styles[STR_CLASS_MAIN_EDITOR_2D]}`} key={title}>
    <nav>
      <ul>
        {
          store.filesList.map(item => {
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
  </div>;
}

export default observer(MainEditor2d);