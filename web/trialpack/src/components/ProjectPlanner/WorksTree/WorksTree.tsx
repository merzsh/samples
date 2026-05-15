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
import React, {useCallback, useEffect, useState} from "react";
import {
  mapCellBaseWithDateValue,
  mapCellBaseWithNumberValue,
  mapCellBaseWithStringArrayValue,
  mapCellBaseWithStringValue, mapWorkHeaderDataDefault
} from "../utils";
import {useProjectWorksTableView} from "../hooks/useProjectWorksTableView";
import {
  ApiProjectAttribAllIds,
  EProjAttrs,
  EProjProps,
  EProjWorkNodeProps,
  WorksTreeProps
} from "../types";
import {STR_HTML_SPACE} from "../../AuxCommon/constants";
import {
  DATA_PROPS_DEFAULT,
  DATES_GROUP_COLUMN_ID,
  DATES_GROUP_COLUMN_TITLE,
  DEFAULT_WORK,
  HEADER_PROPS_DEFAULT
} from "../constants";
import AuxLevelTextBox from "../../AuxCommon/AuxLevelTextBox";
import AdvancedTable from "../../AuxCommon/AdvancedTable";
import {AdvTblCellProps} from "../../AuxCommon/AdvancedTable/types";
import {AuxTextBoxProps} from "../../AuxCommon/AuxTextBox/types";
import {OnGetChildrenIds} from "../../AuxCommon/AuxUiCompGenerator/types";

const WorksTree: React.FC<WorksTreeProps> = ({ projectApi, rootWorkNode,
                                               worksTreeMap, defaultSortColumn,
                                               onRebuildWorksTree, onChangeWorkAttrValue,
                                               onScroll, onRowSelect,
                                               onExpanderRows, onHeader,
                                               id, className}
) => {

  const { header, works } = useProjectWorksTableView<ApiProjectAttribAllIds>(
    projectApi.projectHeaderAttributes,
    new Map([
      [EProjAttrs.WBS, (props) => {
        const result = mapCellBaseWithStringValue(props);
        if (props.isHeader && result.componentProps.props) {
          result.componentProps.props = {
            ...result.componentProps.props,
            ...HEADER_PROPS_DEFAULT,
          };
          return result;
        }

        result.componentProps.onChange = (value: string, prevValue?: string) => {
          if (props.workNode && result.componentProps.type === EAuxTextBoxType.TEXT && value && value !== STR_HTML_SPACE) {
            if (prevValue === STR_HTML_SPACE && onRebuildWorksTree) {
              projectApi[EProjProps.WORKS_LIST].push({ ...DEFAULT_WORK, wbs_code: value, length: 1 });
              onRebuildWorksTree();
            } else if (prevValue !== STR_HTML_SPACE && onChangeWorkAttrValue) {
              onChangeWorkAttrValue(props.workNode.wbs_code.toString(), { wbs_code: value });
            }
          }
        }

        result.componentProps.props = {
          ...result.componentProps.props,
          ...DATA_PROPS_DEFAULT,
        }

        return result;
      }],
      [EProjAttrs.NAME, (props) => {
        const result = mapCellBaseWithStringValue(props);
        if (props.isHeader && result.componentProps.props) {
          result.componentProps.props = {
            ...result.componentProps.props,
            ...HEADER_PROPS_DEFAULT,
          };
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
            props: {
              ...result.componentProps.props,
              ...DATA_PROPS_DEFAULT,
            }
          }
        };
      }],
      [EProjAttrs.LEN, (props) => {
        const result = mapCellBaseWithNumberValue(props, props.isLastLevel, projectApi.isSuppressZeros);
        if (props.isHeader && result.componentProps.props) {
          result.componentProps.props = {
            ...result.componentProps.props,
            ...HEADER_PROPS_DEFAULT,
          };
          return result;
        }

        if (props.workNode?.children.length) result.isGroupHighlighting = true;

        result.componentProps.onChange = (value: string) => {
          if (props.workNode && result.componentProps.type === EAuxTextBoxType.NUM) {
            const numVal = Number(value);
            if (!isNaN(numVal) && onChangeWorkAttrValue) {
              onChangeWorkAttrValue(props.workNode.wbs_code.toString(), { length: numVal });
            }
          }
        }

        result.componentProps.props = {
          ...result.componentProps.props,
          ...DATA_PROPS_DEFAULT,
        };

        return result;
      }],
      [EProjAttrs.COMPLETE, (props) => {
        return mapWorkHeaderDataDefault(props, mapCellBaseWithNumberValue(props, props.isLastLevel, projectApi.isSuppressZeros));
      }],
      [EProjAttrs.S_DATE, (props) => {
        return mapWorkHeaderDataDefault(props, mapCellBaseWithDateValue(props, false, projectApi.dateDisplayTemplate));
      }],
      [EProjAttrs.F_DATE, (props) => {
        return mapWorkHeaderDataDefault(props, mapCellBaseWithDateValue(props, false, projectApi.dateDisplayTemplate));
      }],
      [EProjAttrs.PREV, (props) => {
        const result = mapCellBaseWithStringArrayValue(props, props.isLastLevel);
        if (props.isHeader && result.componentProps.props) {
          result.componentProps.props = {
            ...result.componentProps.props,
            ...HEADER_PROPS_DEFAULT,
          };
          return result;
        }

        if (props.workNode?.children.length) result.isGroupHighlighting = true;

        result.componentProps.onChange = (value: string) => {
          if (props.workNode && result.componentProps.type === EAuxTextBoxType.TEXT && onChangeWorkAttrValue) {
            onChangeWorkAttrValue(props.workNode.wbs_code.toString(), { prev_works: value.split(',') });
          }
        }

        result.componentProps.props = {
          ...result.componentProps.props,
          ...DATA_PROPS_DEFAULT,
        }

        return result;
      }],
    ]),
    EProjAttrs.WBS,
    EProjWorkNodeProps.CHILDREN,
    rootWorkNode
  );

  const [multilineHeader, setMultilineHeader] =
    React.useState<AdvTblCellProps<AuxTextBoxProps>[][]>();
  const [headerCellUnionsMap, setHeaderCellUnionsMap] =
    useState<Map<string, number>>();

  useEffect(() => {
    if (!header) return;

    const mapping = new Map<string, number>();
    const firstHeaderLine: AdvTblCellProps<AuxTextBoxProps>[] = [];
    const secondHeaderLine: typeof firstHeaderLine = [];

    header.forEach(attr => {
      const attrId = attr.extData?.currColumnName;
      if (!attrId) return;

      switch (attrId) {
        case EProjAttrs.S_DATE:
          firstHeaderLine.push({
            ...attr,
            extData: { currColumnName: DATES_GROUP_COLUMN_ID },
            componentProps: {
              ...attr.componentProps,
              value: DATES_GROUP_COLUMN_TITLE,
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

  const onGetChildrenIds = useCallback<OnGetChildrenIds>((parentId) => {
    return [...worksTreeMap.keys()]
      .filter(key => key !== parentId && key.startsWith(parentId))
      .sort((a,b) => a < b ? -1 : a > b ? 1 : 0);
    }, []
  );

  if (!works || !multilineHeader || !headerCellUnionsMap) return undefined;

  return (
    <div id={id} key={id} className={clsx(className, s['works-tree'])} onScroll={onScroll}>
      <AdvancedTable id={`${id}-table`}
                     header={multilineHeader}
                     headerCellUnionsMapping={headerCellUnionsMap}
                     data={works}
                     isWithRowNums
                     freeRowsCount={3}
                     defaultSortColumn={defaultSortColumn}
                     onGetChildrenIds={onGetChildrenIds}
                     onRowSelect={onRowSelect}
                     onExpanderRows={onExpanderRows}
      />
    </div>
  );
};

export default WorksTree;
