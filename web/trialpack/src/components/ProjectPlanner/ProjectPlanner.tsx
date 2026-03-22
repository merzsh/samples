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

import * as s from './ProjectPlanner.modules.scss';
import React, {useRef} from 'react';
import AdvancedTable from "../AuxCommon/AdvancedTable";
import {AdvTblCellProps, EAdvTblBackground} from "../AuxCommon/AdvancedTable/types";
import {COLUMN_IDS} from "../AuxCommon/constants";
import {BORDER_FULL} from "./constants";
import AuxTextBox from "../AuxCommon/AuxTextBox";
import {EAuxAlignH, EAuxSize} from "../AuxCommon/types";
import {dataSample} from "./fixtures";

type ProjectPlannerProps = {
  title?: string;
};

export const ProjectPlanner: React.FC<ProjectPlannerProps> = ({}) => {

  const headerColsListRef = useRef<Map<string, AdvTblCellProps>>(new Map<string, AdvTblCellProps>(
    dataSample[0].map((item, index) => {
      const colId: string = COLUMN_IDS[index];
      return [colId, {
        id: colId,
        component: AuxTextBox,
        componentProps: {
          text: item,
          props: {
            isNonSelectable: true,
            fontSize: EAuxSize.M,
            alignH: EAuxAlignH.L,
            isBold: true,
          }
        },
        border:  BORDER_FULL,
        background: EAdvTblBackground.HEADER,
      }];
    })
  ));

  const bodyColsListRef = useRef<Map<string, AdvTblCellProps>[]>(
    dataSample.slice(1).map((row, rowIndex) => {
      return new Map<string, AdvTblCellProps>(row.map((col, colIndex) => {
        const cellId = `${COLUMN_IDS[colIndex]}${rowIndex+1}`;
        return [cellId, {
          id: cellId,
          component: AuxTextBox,
          componentProps: {
            text: col,
            props: {
              isNonSelectable: true,
              isEditable: true,
              fontSize: EAuxSize.M,
              alignH: EAuxAlignH.L,
            }
          },
          border: BORDER_FULL,
        }];
      }))
    })
  );

  return (
    <div className={`${s['proj-plan']}`}>
      <AdvancedTable className={`${s['proj-plan__table']}`} header={headerColsListRef.current}
                     body={bodyColsListRef.current} isWithRowNums freeRowsCount={3} />
    </div>
  );
};

export default ProjectPlanner;
