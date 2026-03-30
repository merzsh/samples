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

export const AuxLevelTextBox: React.FC<AuxLevelTextBoxProps> = ({ level, isExpanderVisible,
                                                                  text, props,
                                                                  id, extData,
                                                                  isExpanded, className,
                                                                  onExpanderClick, onExpanderRows}) => {
  const [isExpandedState, setExpandedState] = React.useState<boolean>(isExpanded ?? false);

  function onExpand(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();

    const isExp = !(isExpandedState ?? false);

    if (onExpanderClick) {
      const arr = onExpanderClick(id, extData, isExp);
      if (onExpanderRows) {
        onExpanderRows(arr, isExp);
      }
    }

    setExpandedState(isExp);
  }

  return (
    <div id={`ltb-${id}`} className={clsx(className, s['aux-level-text-box'], {
      [`${s['aux-level-text-box_leveled-1']}`]: level === 1,
      [`${s['aux-level-text-box_leveled-2']}`]: level === 2,
      [`${s['aux-level-text-box_leveled-3']}`]: level === 3,
      [`${s['aux-level-text-box_leveled-4']}`]: level === 4,
      [`${s['aux-level-text-box_leveled-5']}`]: level === 5,
    })}>
      {isExpanderVisible ? (<div className={clsx(s['aux-level-text-box-expander'], {
        [`${s['aux-level-text-box-expander_opened']}`]: isExpandedState,
        [`${s['aux-level-text-box-expander_closed']}`]: isExpandedState !== undefined && !isExpandedState,
      })} onClick={onExpand} >
        <div className={s['aux-level-text-box-expander__arrow']} />
      </div>) : undefined}
      <AuxTextBox id={id} extData={extData}
                  className={clsx(s['aux-level-text-box__inner-text-box'], {
                    [`${s['aux-level-text-box__inner-text-box_tabbed']}`]: !isExpanderVisible && isExpanded !== undefined,
                  })}
                  text={text} props={{...props}}/>
    </div>
  );
};

export default AuxLevelTextBox;
