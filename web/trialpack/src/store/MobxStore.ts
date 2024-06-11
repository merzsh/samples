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

import { makeAutoObservable } from 'mobx';
import { Map, Record } from 'immutable';
import {UseEditor2dInitProps, UseEditor2dResult} from '../hooks/useEditor2d';
import {STR_ID_APP_EDITOR2D, STR_ID_APP_STOPLIGHT} from "../utils/constants";

class MobxStore {

  constructor() {
    makeAutoObservable(this);
  }

  baseRoute = '';
  paymentController: UseEditor2dResult | null = null;

  initProps: UseEditor2dInitProps = {
    fileName: '',
  };

  appList = this.initMapList();

  filesList = [] as string[];

  initMapList(): Map<string, { shortName: string; name: string }> {
    let result = Map<string, { shortName: string; name: string }>();

    result = result.set(STR_ID_APP_STOPLIGHT, {shortName: 'State machine', name: 'State machine with stoplight sample'});
    result = result.set(STR_ID_APP_EDITOR2D, {shortName: '2d graphics editor', name: '2d vector graphics web editor'});
    return result;
  }
}

export default new MobxStore();