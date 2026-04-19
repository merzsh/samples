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
import {EAuxTextBoxType} from "../AuxCommon/types";
import {projectSampleDataApiRawResponse} from "./fixtures";
import {ApiProjectAttribAllIds, EProjAttrs, EProjProps, EProjWorkNodeProps, UseProjectWorksTableViewMap} from "./types";
import {castApiRawResponse, getDefaultSortColumn, mapWorkAttrBasic} from "./utils";
import {useProjectWorksTree} from "./hooks/useProjectWorksTree";
import {useProjectWorksTableView} from "./hooks/useProjectWorksTableView";
import AuxLevelTextBox from "../AuxCommon/AuxLevelTextBox";
import {STR_HTML_SPACE} from "../AuxCommon/constants";
import {PROJECT_DEFAULT_NAME} from "./constants";
import AuxViews from "../AuxCommon/AuxViews";

type ProjectPlannerProps = {
  title?: string;
};

export const ProjectPlanner: React.FC<ProjectPlannerProps> = ({}) => {
  const [projectApi, setProjectApi] = useState(castApiRawResponse(projectSampleDataApiRawResponse));

  const { rootWorkNode, setWorkAttrValue } = useProjectWorksTree(projectApi);

  const { header, works } = useProjectWorksTableView(
    {
      projectStartDate: projectApi[EProjProps.PROJ_START_DATE],
      dateDisplayTemplate: projectApi[EProjProps.DATE_TEMPLATE],
      isSuppressZeros: projectApi[EProjProps.IS_SUPPRESS_ZEROS],
    },
    projectApi.projectHeaderAttributes,
    new Map<ApiProjectAttribAllIds, UseProjectWorksTableViewMap>([
      [EProjAttrs.WBS, (props) => {
        const result = mapWorkAttrBasic(props);
        if (props.isHeader) return result;

        result.componentProps.onChange = (value, prevValue) => {
          if (props.workNode && result.componentProps.type === EAuxTextBoxType.TEXT && value && value !== STR_HTML_SPACE) {
            if (prevValue === STR_HTML_SPACE) {
              projectApi[EProjProps.WORKS_LIST].push({ wbs_code: value, work_name: PROJECT_DEFAULT_NAME, length: 1 });
              setProjectApi({ ...projectApi });
            } else {
              setWorkAttrValue(props.workNode.wbs_code.toString(), { wbs_code: value });
            }
          }
        }

        return result;
      }],
      [EProjAttrs.NAME, (props) => {
        const result = mapWorkAttrBasic(props);
        if (props.isHeader) return result;

        return {
          ...result,
          component: AuxLevelTextBox,
          componentProps: {
            ...result.componentProps,
            level: props.level,
            isExpanderVisible: !props.isLastLevel,
            isExpanded: true,
          }
        };
      }],
      [EProjAttrs.LEN, (props) => {
        const result = mapWorkAttrBasic({ ...props, isEditable: props.isLastLevel });
        if (props.isHeader) return result;

        result.componentProps.onChange = (value) => {
          if (props.workNode && result.componentProps.type === EAuxTextBoxType.NUM) {
            const numVal = Number(value);
            if (!isNaN(numVal)) {
              setWorkAttrValue(props.workNode.wbs_code.toString(), { length: numVal });
            }
          }
        }

        return result;
      }],
      [EProjAttrs.COMPLETE, (props) => {
        return mapWorkAttrBasic({...props, isEditable: props.isLastLevel });
      }],
      [EProjAttrs.S_DATE, (props) => {
        return mapWorkAttrBasic({...props, isEditable: false });
      }],
      [EProjAttrs.F_DATE, (props) => {
        return mapWorkAttrBasic({...props, isEditable: false });
      }],
      [EProjAttrs.PREV, (props) => {
        const result = mapWorkAttrBasic({...props, isEditable: props.isLastLevel });
        if (props.isHeader) return result;

        result.componentProps.onChange = (value) => {
          if (props.workNode && result.componentProps.type === EAuxTextBoxType.TEXT) {
            setWorkAttrValue(props.workNode.wbs_code.toString(), { prev_works: value.split(',') });
          }
        }

        return result;
      }],
    ]),
    EProjAttrs.WBS,
    EProjWorkNodeProps.CHILDREN,
    rootWorkNode
  );

  if (!header || !works) return;

  return (
    <AuxViews className={`${s['proj-plan']}`} resizerScreenAdjustmentInPx={250}>
      <AdvancedTable id={'wbs'} key={'wbs'}
                     className={`${s['proj-plan__table']}`}
                     header={header}
                     works={works}
                     isWithRowNums freeRowsCount={3}
                     defaultSortColumn={getDefaultSortColumn(projectApi.projectHeaderAttributes, EProjAttrs.WBS)}
      />
      <AdvancedTable id={'diagram'} key={'diagram'}
                     className={`${s['proj-plan__table']}`}
                     header={header}
                     works={works}
                     isWithRowNums freeRowsCount={3}
                     defaultSortColumn={getDefaultSortColumn(projectApi.projectHeaderAttributes, EProjAttrs.WBS)}
      />
    </AuxViews>
  );
};

export default ProjectPlanner;
