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
import {
  AdvTblCellProps,
  AdvTblCellPropsAbstract,
  AuxCompsProps,
  EAdvTblBackground
} from "../AuxCommon/AdvancedTable/types";
import {COLUMN_IDS} from "../AuxCommon/constants";
import {BORDER_FULL} from "./constants";
import AuxTextBox from "../AuxCommon/AuxTextBox";
import {AuxTextBoxProps, EAuxAlignH, EAuxSize} from "../AuxCommon/types";
import {dataSample} from "./fixtures";
import AuxLevelTextBox from "../AuxCommon/AuxLevelTextBox";
import {AuxTextBoxConfig} from "../AuxCommon/AuxTextBox/types";

type ProjectPlannerProps = {
  title?: string;
};

export const ProjectPlanner: React.FC<ProjectPlannerProps> = ({}) => {

  const headerColsListRef = useRef<Map<string, AdvTblCellPropsAbstract<AuxTextBoxProps>>>(
    new Map<string, AdvTblCellPropsAbstract<AuxTextBoxProps>>(
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

  const bodyColsListRef = useRef<Map<string, AdvTblCellProps<AuxCompsProps>>[]>(
    dataSample.slice(1).map((row, rowIndex) => {
      const colNumB = COLUMN_IDS.indexOf('B');

      return new Map<string, AdvTblCellProps<AuxCompsProps>>(row.map((col, colIndex) => {
        const colId = `${COLUMN_IDS[colIndex]}${rowIndex+1}`;
        const colCommon = {
          id: colId,
          border:  BORDER_FULL,
        };
        const cellProps: AuxTextBoxConfig = {
          isNonSelectable: true,
          isEditable: true,
          fontSize: EAuxSize.M,
          alignH: EAuxAlignH.L,
        };
        const componentProps = {
          id: colId,
          text: col,
          props: cellProps,
        };

        return [colId, colIndex === colNumB ? {
          ...colCommon,
          component: AuxLevelTextBox,
          componentProps: {
            ...componentProps,
            isExpanderVisible: true,
          },
        } : {
          ...colCommon,
          component: AuxTextBox,
          componentProps,
        }];
      }));
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
