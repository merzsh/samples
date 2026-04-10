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
import {AdvTblCellProps} from "./types";
import {AuxTextBoxProps} from "../types";
import AuxTextBox from "../AuxTextBox";
import {BORDER_FULL} from "../../ProjectPlanner/constants";

export const INIT_TEXT_BOX_CELL_PROPS: AdvTblCellProps<AuxTextBoxProps> = {
  id: '', border: BORDER_FULL, component: AuxTextBox, componentProps: { }
};
