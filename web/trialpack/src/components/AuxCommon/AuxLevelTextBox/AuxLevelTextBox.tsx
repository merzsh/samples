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

import * as s from './AuxLevelTextBox.modules.scss';
import React from 'react';
import clsx from 'clsx';
import AuxTextBox from "../AuxTextBox";
import {AuxLevelTextBoxProps} from "../types";

export const AuxLevelTextBox: React.FC<AuxLevelTextBoxProps> = ({ isExpanderVisible, text,
                                                                  props, id,
                                                                  className}) => {
  const [isExpanded, setExpanded] = React.useState<boolean>();

  function onExpand(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();

    setExpanded(!(isExpanded ?? false));
  }

  return (
    <div id={`alt${id}`} className={clsx(className, s['aux-level-text-box'])}>
      {isExpanderVisible ? (<div className={clsx(s['aux-level-text-box-expander'], {
        [`${s['aux-level-text-box-expander_opened']}`]: isExpanded,
        [`${s['aux-level-text-box-expander_closed']}`]: isExpanded !== undefined && !isExpanded,
      })} onClick={onExpand} >
        <div className={s['aux-level-text-box-expander__arrow']} />
      </div>) : undefined}
      <AuxTextBox id={id} className={s['aux-level-text-box__inner-text-box']}
                  text={text} props={props}/>
    </div>
  );
};

export default AuxLevelTextBox;
