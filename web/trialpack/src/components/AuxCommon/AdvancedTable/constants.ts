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
import {AuxTextBoxProps, EColID} from "../types";
import AuxTextBox from "../AuxTextBox";
import {BORDER_FULL} from "../../ProjectPlanner/constants";
import * as s from "./AdvancedTable.modules.scss";

export const INIT_TEXT_BOX_CELL_PROPS: AdvTblCellProps<AuxTextBoxProps> = {
  id: '', border: BORDER_FULL, component: AuxTextBox, componentProps: { }
};

export const colIdsMap = new Map<EColID, number>([
  [EColID.A, 0], [EColID.B, 1], [EColID.C, 2], [EColID.D, 3], [EColID.E, 4], [EColID.F, 5], [EColID.G, 6],
  [EColID.H, 7], [EColID.I, 8], [EColID.J, 9], [EColID.K, 10], [EColID.L, 11], [EColID.M, 12], [EColID.N, 13],
  [EColID.O, 14], [EColID.P, 15], [EColID.Q, 16], [EColID.R, 17], [EColID.S, 18], [EColID.T, 19], [EColID.U, 20],
  [EColID.V, 21], [EColID.W, 22], [EColID.X, 23], [EColID.Y, 24], [EColID.Z, 25],
]);

export const colIds = [...colIdsMap.keys()];

export const TOTAL_ABC_CAPACITY = 26;

export const ROW_SELECTION_STYLES = {
  dataCellBackSelected: s['adv-table__cell_selected'],
  headerCellBackSelected: s['adv-table__cell_background-head-select-colored'],
  headerCellBackUnselected: s['adv-table__cell_background-head-colored'],
};
