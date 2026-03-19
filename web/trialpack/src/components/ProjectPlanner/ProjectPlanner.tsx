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
import React, { useRef} from 'react';
import AdvancedTable from "../AuxCommon/AdvancedTable";
import {AdvTblCellProps, EAdvTblBackground} from "../AuxCommon/AdvancedTable/types";
import {EProjPlannerColIds} from "./types";
import {BORDER_FULL, BORDER_ROW} from "./constants";

type ProjectPlannerProps = {
  title?: string;
};

export const ProjectPlanner: React.FC<ProjectPlannerProps> = ({title}) => {
  const headerColsListRef = useRef(new Map<string, AdvTblCellProps>([
    [EProjPlannerColIds.COL1,
      {
        id: EProjPlannerColIds.COL1,
        component: <span>Cell head - 1</span>,
        border: BORDER_FULL,
        background: EAdvTblBackground.HEADER,
      }],
    [EProjPlannerColIds.COL2,
      {
        id: EProjPlannerColIds.COL2,
        component: <span>Cell head - 2</span>,
        border: BORDER_FULL,
        background: EAdvTblBackground.HEADER,
      }]
  ]));

  const bodyColsListRef = useRef(new Map<number, Map<string, AdvTblCellProps>>([
    [1, new Map([
      [
        EProjPlannerColIds.COL1,
        {
          id: `${EProjPlannerColIds.COL1}1`,
          component: <span>Cell data - A1</span>,
          border: BORDER_FULL,
        }],
      [
        EProjPlannerColIds.COL2,
        {
          id: `${EProjPlannerColIds.COL2}1`,
          component: <span>Cell data - B1</span>,
          border: BORDER_FULL,
        }]
    ])],
    [2, new Map([
      [
        EProjPlannerColIds.COL1,
        {
          id: `${EProjPlannerColIds.COL1}2`,
          component: <span>Cell data - A2</span>,
          border: BORDER_FULL,
        }],
      [
        EProjPlannerColIds.COL2,
        {
          id: `${EProjPlannerColIds.COL2}2`,
          component: <span>Cell data - B2</span>,
          border: BORDER_FULL,
        }]
    ])]
  ]));

  return (
    <div className={`${s['proj-plan']}`}>
      <AdvancedTable className={`${s['proj-table']}`} header={headerColsListRef.current}
                     body={bodyColsListRef.current} />
    </div>
  );
};

export default ProjectPlanner;
