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

import * as styles from './MainHome.modules.scss';
import React from 'react';
import {
  STR_CLASS_MAIN, STR_FILENAME_BACKGROUND, STR_FILENAME_BACKGROUND_PNG, STR_FILENAME_RESOURCES,
} from '../../utils/constants';
require(`../../${STR_FILENAME_RESOURCES}/${STR_FILENAME_BACKGROUND}/${STR_FILENAME_BACKGROUND_PNG}`);


interface IMainHome {
  title?: string;
}

export const MainHome: React.FC<IMainHome> = ({title}): JSX.Element => {

  return <div className={`${styles[STR_CLASS_MAIN]}`} key={title} >
    <div className={`${styles[`${STR_CLASS_MAIN}__copyright`]}`}>
      Copyright &#xA9; 2024 Andrey Miroshnichenko &lt;<a href={'mailto:merzsh@gmail.com'}>merzsh@gmail.com</a>&gt;<br/>
      This program comes with ABSOLUTELY NO WARRANTY; for details go to Github repo via link below.<br/>
      This is free software, and you are welcome to redistribute it under certain conditions.
    </div>
  </div>;
}

export default MainHome;