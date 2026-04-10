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
import React, {useState} from 'react';
import AdvancedTable from "../AuxCommon/AdvancedTable";
import {AdvTblCellProps, AdvTblCellPropsAbstract} from "../AuxCommon/AdvancedTable/types";
import {DEFAULT_WORK, ROOT_WBS_CODE} from "./constants";
import {AuxLevelTextBoxProps, AuxTextBoxProps, EAuxTextBoxType} from "../AuxCommon/types";
import {projectSampleDataApiRawResponse} from "./fixtures";
import {ApiProjectAttribAllIds, EProjAttrs, EProjProps, EProjWorkNodeProps, UseProjectWorksTableViewMap} from "./types";
import {castApiRawResponse, getDefaultSortColumn, mapCell} from "./utils";
import {useProjectWorksTree} from "./hooks/useProjectWorksTree";
import {useProjectWorksTableView} from "./hooks/useProjectWorksTableView";
import AuxLevelTextBox from "../AuxCommon/AuxLevelTextBox";

type ProjectPlannerProps = {
  title?: string;
};

export const ProjectPlanner: React.FC<ProjectPlannerProps> = ({}) => {
  const [projectApi] = useState(castApiRawResponse(projectSampleDataApiRawResponse));

  const { rootWorkNode } = useProjectWorksTree(
    projectApi.projectWorksList.find(item => item.wbs_code === ROOT_WBS_CODE) ?? DEFAULT_WORK,
    projectApi.projectWorksList.filter(item => item.wbs_code !== ROOT_WBS_CODE),
    EProjAttrs.WBS,
    EProjWorkNodeProps.CHILDREN
  );

  const { header, works, refreshView } = useProjectWorksTableView(
    {isSuppressZeros: projectApi[EProjProps.IS_SUPPRESS_ZEROS]},
    projectApi.projectHeaderAttributes,
    new Map<ApiProjectAttribAllIds, UseProjectWorksTableViewMap>([
      [EProjAttrs.WBS, (props): AdvTblCellProps<AuxTextBoxProps> => {
        const result = mapCell(props);

        return {
          ...result,
          componentProps: {
            ...result.componentProps,
            props: {
              ...result.componentProps.props,
              isEditable: props.isLastLevel,
            }
          }
        };
      }],
      [EProjAttrs.NAME, (props): AdvTblCellProps<AuxTextBoxProps> => {
        const result: AdvTblCellPropsAbstract<AuxLevelTextBoxProps> = mapCell(props);
        if (props.isHeader) return result;

        const componentProps: AuxLevelTextBoxProps = {
          ...result.componentProps,
          props: {
            ...result.componentProps.props,
            isEditable: props.isLastLevel,
          },
          level: props.level,
          isExpanderVisible: !props.isLastLevel,
          isExpanded: true,
        };

        return {
          ...result,
          component: AuxLevelTextBox,
          componentProps,
        };
      }],
      [EProjAttrs.LEN, (props): AdvTblCellProps<AuxTextBoxProps> => {
        if (props.workNode && !props.isLastLevel) {
          props.workNode.length = props.workNode.children.reduce((accum, curr) => {
            let len = typeof curr.length === 'number' && !isNaN(curr.length) ? curr.length : 0;
            return accum + len;
          }, 0);
        }

        const result = mapCell(props);

        return {
          ...result,
          componentProps: {
            ...result.componentProps,
            props: {
              ...result.componentProps.props,
              isEditable: props.isLastLevel,
            },
            onChange: (value) => {
              if (rootWorkNode && props.workNode && result.componentProps.type === EAuxTextBoxType.NUM) {
                const numVal = Number(value);
                if (!isNaN(numVal)) {
                  props.workNode.length = numVal;
                  refreshView();
                }
              }
            }
          }
        };
      }],
      [EProjAttrs.COMPLETE, (props): AdvTblCellProps<AuxTextBoxProps> => {
        const result = mapCell(props);

        return {
          ...result,
          componentProps: {
            ...result.componentProps,
            props: {
              ...result.componentProps.props,
              isEditable: props.isLastLevel,
            }
          }
        };
      }],
    ]),
    EProjAttrs.WBS,
    EProjWorkNodeProps.CHILDREN,
    rootWorkNode
  );

  if (!header || !works) return;

  return (
    <div className={`${s['proj-plan']}`}>
      <AdvancedTable className={`${s['proj-plan__table']}`}
                     header={header}
                     works={works}
                     isWithRowNums freeRowsCount={3}
                     defaultSortColumn={getDefaultSortColumn(projectApi.projectHeaderAttributes, EProjAttrs.WBS)}
      />
    </div>
  );
};

export default ProjectPlanner;
