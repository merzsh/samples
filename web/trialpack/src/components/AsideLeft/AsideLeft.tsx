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
import { Route, Routes } from 'react-router-dom';
import useStores from '../../hooks/useStores';
import AsideLeftHome from '../AsideLeftHome';
import AsideLeftStoplight from '../AsideLeftStoplight';
import AsideLeftEditor2d from '../AsideLeftEditor2d';
import { STR_ID_APP_EDITOR2D, STR_ID_APP_STOPLIGHT } from '../../utils/constants';

interface IAsideLeft {
  title?: string;
}

export const AsideLeft: React.FC<IAsideLeft> = ({title}): JSX.Element => {
  const { store } = useStores();

  return <Routes>
    {[...store.appList.keys()].map((item, index) => {
      switch(item) {
        case STR_ID_APP_STOPLIGHT:
          return (<Route key={index} path={'/' + item} element={<AsideLeftStoplight />} />);
        case STR_ID_APP_EDITOR2D:
          return (<Route key={index} path={'/' + item} element={<AsideLeftEditor2d />} />);
      }
    })}
    <Route path={'/'} element={<AsideLeftHome />} key={title} />
    </Routes>;
}

export default AsideLeft;