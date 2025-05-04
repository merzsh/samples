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

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import useStores from '../../../hooks/useStores';
import MainHomeAsideRight from '../MainHome/AsideRight';
import StoplightAsideRight from '../../Stoplight/AsideRight';
import Editor2dAsideRight from '../../Editor2d/AsideRight';
import {STR_ID_APP_EDITOR2D, STR_ID_APP_STOPLIGHT} from '../../../utils/constants';

interface IMainAsideRight {
  title?: string;
}

export const MainAsideRight: React.FC<IMainAsideRight> = ({title}): JSX.Element => {
  const { store } = useStores();

  return <Routes>
    {[...store.appList.keys()].map((item, index) => {
      switch(item) {
        case STR_ID_APP_STOPLIGHT:
          return (<Route key={index} path={'/' + item} element={<StoplightAsideRight />} />);
        case STR_ID_APP_EDITOR2D:
          return (<Route key={index} path={'/' + item} element={<Editor2dAsideRight />} />);
      }
    })}
    <Route path={'/'} element={<MainHomeAsideRight />} key={title} />
  </Routes>;
}

export default MainAsideRight;
