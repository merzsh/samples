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

import * as styles from "./MainStoplight.modules.scss";
import React from 'react';

interface IAsideRightEditor2d {
  title?: string;
}

export const MainStoplight: React.FC<IAsideRightEditor2d> = ({title}): JSX.Element => {

  return <div className={`${styles['aside-right-editor-2d']}`} key={title} >
    <nav>
      <button>Object options</button>
      <button>Common settings</button>
    </nav>
    <h4>The standard Lorem Ipsum passage</h4>
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</p>
  </div>;
}

export default MainStoplight;