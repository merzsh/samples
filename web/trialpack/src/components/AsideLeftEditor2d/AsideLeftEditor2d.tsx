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

import * as styles from './AsideLeftEditor2d.modules.scss';
import React from 'react';
import {observer} from 'mobx-react-lite';
import useStores from '../../hooks/useStores';

interface IAsideLeftEditor2d {
  title?: string;
}

export const AsideLeftEditor2d: React.FC<IAsideLeftEditor2d> = ({title}): JSX.Element => {
  const { store } = useStores();

  function onClickNewFile() {
    const num = (store.filesList.length + 1).toString();
    store.filesList.push(`Untitled-${num}`);
  }

  return <div className={`${styles['aside-left-editor-2d']}`} key={title}>
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
    </div>;
}

export default observer(AsideLeftEditor2d);