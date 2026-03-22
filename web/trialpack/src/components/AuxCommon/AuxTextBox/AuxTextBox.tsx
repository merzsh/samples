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

import * as s from './AuxTextBox.modules.scss';
import React, {useCallback, useRef} from 'react';
import clsx from 'clsx';
import {AuxTextBoxConfig} from "./types";
import {EAuxAlignH, EAuxSize} from "../types";

export type AuxTextBoxProps = {
  text: string;
  props?: AuxTextBoxConfig;
  id?: string;
  className?: string;
};

export const AuxTextBox: React.FC<AuxTextBoxProps> = ({text, props, id, className}) => {
  const [isEditable, setIsEditable] = React.useState(false);
  const [textInt, setTextInt] = React.useState(text);
  const colWidthRef = useRef(0);

  const onGoToEditMode = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isEditable || !(props && props.isEditable)) return;

    if (e.target instanceof HTMLDivElement) {
      colWidthRef.current = e.target.offsetWidth;
    }

    setIsEditable(!isEditable);
  }, [isEditable]);

  return (
    <div id={id} className={clsx(className, s['aux-text-box'], {
      [`${s['aux-text-box_non-selectable']}`]: props?.isNonSelectable,
      [`${s['aux-text-box_is-weighted']}`]: props?.isBold,
      [`${s['aux-text-box_is-medium-sized']}`]: props?.fontSize === EAuxSize.M,
      [`${s['aux-text-box_is-small-sized']}`]: props?.fontSize === EAuxSize.S,
      [`${s['aux-text-box_left_aligned']}`]: props?.alignH === EAuxAlignH.L,
      [`${s['aux-text-box_right_aligned']}`]: props?.alignH === EAuxAlignH.R
    })} onDoubleClick={onGoToEditMode}>
      {isEditable ? (
        <input style={{width: `${colWidthRef.current-2}px`}} className={s['aux-text-box-input']}
          type={'text'} value={textInt} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setTextInt(e.target.value);
        }} autoFocus onBlur={() => {
          setIsEditable(!isEditable);
        }} />
      ) : (textInt ? textInt : '\u00A0')}
    </div>
  );
};

export default AuxTextBox;
