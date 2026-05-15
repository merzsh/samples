/**
 * TrialPack is web application contains several basic samples to ease web development experience.
 * Copyright (c) 2024-2026 Andrew Miroshnichenko <merzsh@gmail.com, https://github.com/merzsh>
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

import * as s from './AuxGantBox.modules.scss';
import React from 'react';
import clsx from 'clsx';
import {AuxGantBoxProps, EAuxGantBoxCellKind} from "./types";
import {checkIsWeekendLevel} from "./utils";

export const AuxGantBox: React.FC<AuxGantBoxProps> = (
  {id, className, value, level, props}
) => {
  const [isWeekend, isLevel] = checkIsWeekendLevel(value, props?.cellKind);

  return (
    <div id={`atb-${id}`} className={clsx(className, s['aux-gant-box'], {
      [`${s['aux-gant-box_non-selectable']}`]: props?.isNonSelectable,
      [`${s['aux-gant-box_as-aside-summed-task']}`]: props?.cellKind === EAuxGantBoxCellKind.SUM_SIDE,
      [`${s['aux-gant-box_as-weekend-day-leveled-1']}`]: isWeekend && isLevel && level === 0,
      [`${s['aux-gant-box_as-weekend-day-leveled-2']}`]: isWeekend && isLevel && level === 1,
      [`${s['aux-gant-box_as-weekend-day-leveled-3']}`]: isWeekend && isLevel && level === 2,
      [`${s['aux-gant-box_as-weekend-day-leveled-4-and-more']}`]: isWeekend && !isLevel,
    })}>
      <div className={clsx(s['aux-gant-box-item'], {
        [`${s['aux-gant-box-item_summed-task']}`]: props?.cellKind === EAuxGantBoxCellKind.SUM || props?.cellKind === EAuxGantBoxCellKind.SUM_SIDE,
        [`${s['aux-gant-box-item_done-task']}`]: props?.cellKind === EAuxGantBoxCellKind.FACT,
        [`${s['aux-gant-box-item_planned-task']}`]: props?.cellKind === EAuxGantBoxCellKind.PLAN,
        [`${s['aux-gant-box-item_milestone-task']}`]: props?.cellKind === EAuxGantBoxCellKind.MILESTONE,
      })} />
      {props?.cellKind === EAuxGantBoxCellKind.SUM_SIDE && (
        <div className={clsx(s['aux-gant-box-sub-item'])}/>
      )}
    </div>
  );
};

export default AuxGantBox;
