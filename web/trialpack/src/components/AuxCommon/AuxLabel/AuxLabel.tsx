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

import * as s from './AuxLabel.modules.scss';
import React from 'react';
import clsx from 'clsx';
import {AuxLabelConfig} from "./types";
import {EAuxAlignH, EAuxSize} from "../types";

type AuxLabelProps = {
  text: string;
  props?: AuxLabelConfig;
  className?: string;
};

export const AuxLabel: React.FC<AuxLabelProps> = ({text, props, className}) => {
  return (
    <div className={clsx(className, s['aux-label'], {
      [`${s['aux-label_non-selectable']}`]: props?.isNonSelectable,
      [`${s['aux-label_is-weighted']}`]: props?.isBold,
      [`${s['aux-label_is-medium-sized']}`]: props?.fontSize === EAuxSize.M,
      [`${s['aux-label_is-small-sized']}`]: props?.fontSize === EAuxSize.S,
      [`${s['aux-label_left_aligned']}`]: props?.alignH === EAuxAlignH.L,
      [`${s['aux-label_right_aligned']}`]: props?.alignH === EAuxAlignH.R
    })} >{`${text}`}</div>
  );
};

export default AuxLabel;
