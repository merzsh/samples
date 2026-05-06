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

import * as s from './WorksTree.modules.scss';
import clsx from 'clsx';
import {EAuxAlignH, EAuxTextBoxType} from "../../AuxCommon/types";
import React, {useEffect, useState} from "react";
import {
  getDefaultSortColumn,
  mapCellBaseWithDateValue,
  mapCellBaseWithNumberValue,
  mapCellBaseWithStringArrayValue,
  mapCellBaseWithStringValue
} from "../utils";
import {useProjectWorksTableView} from "../hooks/useProjectWorksTableView";
import {
  ApiProjectAttribAllIds,
  EProjAttrs,
  EProjProps,
  EProjWorkNodeProps,
  UseProjectWorksTableViewMap,
  WorksTreeProps
} from "../types";
import {STR_HTML_SPACE} from "../../AuxCommon/constants";
import {DATES_GROUP_COLUMN_ID, DATES_GROUP_COLUMN_TITLE, DEFAULT_WORK} from "../constants";
import AuxLevelTextBox from "../../AuxCommon/AuxLevelTextBox";
import AdvancedTable from "../../AuxCommon/AdvancedTable";
import {AdvTblCellProps, AuxCompsProps} from "../../AuxCommon/AdvancedTable/types";

const WorksTree: React.FC<WorksTreeProps> = ({ projectApi, rootWorkNode,
                                               onRebuildWorksTree, onChangeWorkAttrValue,
                                               onScroll, onRowSelect,
                                               onExpanderRows,
                                               onHeader, id, className}
) => {

  const { header, works } = useProjectWorksTableView(
    projectApi.projectHeaderAttributes,
    new Map<ApiProjectAttribAllIds, UseProjectWorksTableViewMap<ApiProjectAttribAllIds>>([
      [EProjAttrs.WBS, (props) => {
        const result = mapCellBaseWithStringValue(props);
        if (props.isHeader && result.componentProps.props) {
          result.componentProps.props.isMonospaced = true;
          return result;
        }

        result.componentProps.onChange = (value, prevValue) => {
          if (props.workNode && result.componentProps.type === EAuxTextBoxType.TEXT && value && value !== STR_HTML_SPACE) {
            if (prevValue === STR_HTML_SPACE && onRebuildWorksTree) {
              projectApi[EProjProps.WORKS_LIST].push({ ...DEFAULT_WORK, wbs_code: value, length: 1 });
              onRebuildWorksTree();
            } else if (prevValue !== STR_HTML_SPACE && onChangeWorkAttrValue) {
              onChangeWorkAttrValue(props.workNode.wbs_code.toString(), { wbs_code: value });
            }
          }
        }

        return result;
      }],
      [EProjAttrs.NAME, (props) => {
        const result = mapCellBaseWithStringValue(props);
        if (props.isHeader && result.componentProps.props) {
          result.componentProps.props.isMonospaced = true;
          return result;
        }

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
        const result = mapCellBaseWithNumberValue(props, props.isLastLevel, projectApi.isSuppressZeros);
        if (props.isHeader && result.componentProps.props) {
          result.componentProps.props.isMonospaced = true;
          return result;
        }

        result.componentProps.onChange = (value) => {
          if (props.workNode && result.componentProps.type === EAuxTextBoxType.NUM) {
            const numVal = Number(value);
            if (!isNaN(numVal) && onChangeWorkAttrValue) {
              onChangeWorkAttrValue(props.workNode.wbs_code.toString(), { length: numVal });
            }
          }
        }

        return result;
      }],
      [EProjAttrs.COMPLETE, (props) => {
        const result = mapCellBaseWithNumberValue(props, props.isLastLevel, projectApi.isSuppressZeros);
        if (props.isHeader && result.componentProps.props) {
          result.componentProps.props.isMonospaced = true;
        }
        return result;
      }],
      [EProjAttrs.S_DATE, (props) => {
        const result = mapCellBaseWithDateValue(props, false, projectApi.dateDisplayTemplate);
        if (props.isHeader && result.componentProps.props) {
          result.componentProps.props.isMonospaced = true;
        }
        return result;
      }],
      [EProjAttrs.F_DATE, (props) => {
        const result = mapCellBaseWithDateValue(props, false, projectApi.dateDisplayTemplate);
        if (props.isHeader && result.componentProps.props) {
          result.componentProps.props.isMonospaced = true;
        }
        return result;
      }],
      [EProjAttrs.PREV, (props) => {
        const result = mapCellBaseWithStringArrayValue(props, props.isLastLevel);
        if (props.isHeader && result.componentProps.props) {
          result.componentProps.props.isMonospaced = true;
          return result;
        }

        result.componentProps.onChange = (value) => {
          if (props.workNode && result.componentProps.type === EAuxTextBoxType.TEXT && onChangeWorkAttrValue) {
            onChangeWorkAttrValue(props.workNode.wbs_code.toString(), { prev_works: value.split(',') });
          }
        }

        return result;
      }],
    ]),
    EProjAttrs.WBS,
    EProjWorkNodeProps.CHILDREN,
    rootWorkNode
  );

  const [multilineHeader, setMultilineHeader] =
    React.useState<AdvTblCellProps<AuxCompsProps>[][]>();
  const [headerCellUnionsMap, setHeaderCellUnionsMap] =
    useState<Map<string, number>>();

  useEffect(() => {
    if (!header) return;

    const mapping = new Map<string, number>();
    const firstHeaderLine: AdvTblCellProps<AuxCompsProps>[] = [];
    const secondHeaderLine: typeof firstHeaderLine = [];

    header.forEach(attr => {
      const attrId = attr.componentProps.extData?.currColumnName;
      if (!attrId) return;

      switch (attrId) {
        case EProjAttrs.S_DATE:
          firstHeaderLine.push({
            ...attr,
            componentProps: {
              ...attr.componentProps,
              value: DATES_GROUP_COLUMN_TITLE,
              extData: { currColumnName: DATES_GROUP_COLUMN_ID },
              props: {
                ...attr.componentProps.props,
                alignH: EAuxAlignH.C,
              }
            }
          });
          secondHeaderLine.push(attr);
          mapping.set(DATES_GROUP_COLUMN_ID, 1);
          break;
        case EProjAttrs.F_DATE:
          secondHeaderLine.push(attr);
          break;
        default:
          firstHeaderLine.push(attr);
          mapping.set(attrId, 0);
      }
    });

    setMultilineHeader([firstHeaderLine, secondHeaderLine]);
    setHeaderCellUnionsMap(mapping);
    if (onHeader) onHeader(header);
  }, [header]);

  if (!works || !multilineHeader || !headerCellUnionsMap) return undefined;

  const defaultSortColumn = getDefaultSortColumn(projectApi.projectHeaderAttributes, EProjAttrs.WBS);

  return (
    <div id={id} key={id} className={clsx(className, s['works-tree'])} onScroll={onScroll}>
      <AdvancedTable id={`${id}-table`}
                     header={multilineHeader}
                     headerCellUnionsMapping={headerCellUnionsMap}
                     works={works}
                     isWithRowNums
                     freeRowsCount={3}
                     defaultSortColumn={defaultSortColumn}
                     onRowSelect={onRowSelect}
                     onExpanderRows={onExpanderRows}
      />
    </div>
  );
};

export default WorksTree;
