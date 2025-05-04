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

import * as styles from './Editor2dAsideRight.modules.scss';
import React from 'react';

interface IEditor2dAsideRight {
  title?: string;
}

export const Editor2dAsideRight: React.FC<IEditor2dAsideRight> = ({title}): JSX.Element => {

  return <div className={`${styles['aside-right-editor-2d']}`} key={title} >
    <nav>
      <button>Object options</button>
      <button>Common settings</button>
    </nav>
    <h4>The standard Lorem Ipsum passage</h4>
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</p>
  </div>;
}

export default Editor2dAsideRight;
