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

import * as s from './GantChart.modules.scss';
import {EAuxAlignH, EAuxTextBoxType} from "../../AuxCommon/types";
import React, {useEffect, useState} from "react";
import clsx from "clsx";
import {useProjectWorksTableView} from "../hooks/useProjectWorksTableView";
import {ApiGantAttribIds, ApiProjectHeaderAttribute, EProjAttrs, EProjWorkNodeProps, GantChartProps,} from "../types";
import {generateDateSequence, mapCellBase} from "../utils";
import AdvancedTable from "../../AuxCommon/AdvancedTable";
import {format} from "date-fns";
import {STR_ISO_DATE_TEMPLATE} from "../../../utils/constants";
import {MSG_DATE_FORMATTING_ERROR} from "../../AuxCommon/constants";
import {DATA_PROPS_DEFAULT, DATE_TEMPLATE_DAY, DATE_TEMPLATE_WEEK_DAY, HEADER_PROPS_DEFAULT} from "../constants";
import {AdvTblCellProps, EBorderType} from "../../AuxCommon/AdvancedTable/types";
import {getTableShortId} from "../../AuxCommon/AdvancedTable/utils";
import {AuxTextBoxProps} from "../../AuxCommon/AuxTextBox/types";
import AuxGantBox from "../../AuxCommon/AuxGantBox";
import {AuxGantBoxConfig, EAuxGantBoxCellKind} from "../../AuxCommon/AuxGantBox/types";

const GantChart: React.FC<GantChartProps> = ({rootWorkNode, defaultSortColumn, projectStartDate,
                                               rows2Expand, onScroll,
                                               onHeader, id, className}
) => {

  const { header, works } = useProjectWorksTableView<ApiGantAttribIds>(
    [
      { attrId: EProjAttrs.WBS, attrName: 'WBS', },
      ...generateDateSequence(projectStartDate ? projectStartDate : new Date(), 135)
        .map<ApiProjectHeaderAttribute<ApiGantAttribIds>>(date => {
          let attrName = '';

          try {
            attrName =  format(date, STR_ISO_DATE_TEMPLATE);
          } catch (err) {
            console.warn(`GantChart: ${MSG_DATE_FORMATTING_ERROR} '${STR_ISO_DATE_TEMPLATE}'`, err);
          }

          return { attrId: EProjAttrs.DEFAULT, attrName };
        }),
    ],
    new Map([
      [EProjAttrs.WBS, (props) => {
        if (props.isHeader) {
          const headerCellResult = mapCellBase(props);

          headerCellResult.isHorizResizable = undefined;
          headerCellResult.componentProps.props = {
            ...headerCellResult.componentProps.props,
            ...HEADER_PROPS_DEFAULT,
          };

          return headerCellResult;
        }

        const dataCellResult = mapCellBase({
          ...props, isNonSelectable: true,
        }, () => {
          let value = '', type = EAuxTextBoxType.TEXT;
          if (!props.workNode) return [value, type];

          const attrValue = props.workNode[EProjAttrs.WBS];

          if (typeof attrValue === 'string') {
            value = attrValue;
          }

          return [value, type];
        });

        dataCellResult.componentProps.props = {
          ...dataCellResult.componentProps.props,
          ...DATA_PROPS_DEFAULT,
        }

        return dataCellResult;
      }],
      [EProjAttrs.DEFAULT, (props) => {
        if (props.isHeader) {
          const headerCellResult = mapCellBase({
            ...props,
            dateDisplayTemplate: DATE_TEMPLATE_WEEK_DAY,
          });

          headerCellResult.isHorizResizable = undefined;
          headerCellResult.componentProps.type = EAuxTextBoxType.DATE;
          if (headerCellResult.componentProps.props) {
            headerCellResult.componentProps.props.isMonospaced = true;
            headerCellResult.componentProps.props.alignH = EAuxAlignH.C;
          }

          return headerCellResult;
        }

        const now = new Date(), colDate = new Date(props.workAttr.attrName);
        const startDate = props.workNode?.start_date instanceof Date ? new Date(props.workNode.start_date) : undefined;
        const finishDate = props.workNode?.finish_date instanceof Date ? new Date(props.workNode.finish_date) : undefined;

        now.setHours(0, 0, 0, 0);
        colDate.setHours(0, 0, 0, 0);
        startDate?.setHours(0, 0, 0, 0);
        finishDate?.setHours(0, 0, 0, 0);

        const result = mapCellBase({
          ...props, isNonSelectable: true,
        }, () => {
          return [props.workAttr.attrName, EAuxTextBoxType.TEXT];
        });

        result.component = AuxGantBox;
        if (props.workNode?.children.length) result.isGroupHighlighting = true;

        const compSubProps = result.componentProps.props as AuxGantBoxConfig;

        // work cell representation
        if (props.workNode && startDate && finishDate && colDate >= startDate && colDate <= finishDate) {
          if (props.workNode.children.length) {
            if (colDate.getTime() === startDate.getTime() || colDate.getTime() === finishDate.getTime()) {
              compSubProps.cellKind = EAuxGantBoxCellKind.SUM_SIDE;
            } else compSubProps.cellKind = EAuxGantBoxCellKind.SUM;
          } else if (startDate.getTime() === finishDate.getTime()) {
            compSubProps.cellKind = EAuxGantBoxCellKind.MILESTONE
          } else if (colDate.getTime() < now.getTime()) {
            compSubProps.cellKind = EAuxGantBoxCellKind.FACT;
          } else {
            compSubProps.cellKind = EAuxGantBoxCellKind.PLAN;
          }
        } else if (props.workNode?.children.length) compSubProps.cellKind = EAuxGantBoxCellKind.EMPTY_LEVEL;

        result.border = {
          ...result.border,
          left: now.getTime() === colDate.getTime() ? EBorderType.TIMELINE : undefined,
          right: undefined,
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

      if (attrId === EProjAttrs.WBS) {
        firstHeaderLine.push(attr);
        mapping.set(attrId, 0);
      } else {
        const attrName = attr.extData?.rawValue;
        if (!attrName) return;

        const date = new Date(attrName);

        if (date.getDay() === 1) {
          firstHeaderLine.push({
            ...attr,
            extData: { currColumnName: date.getDay().toString() },
            componentProps: {
              ...attr.componentProps,
              value: attrName,
              type: EAuxTextBoxType.DATE,
              props: {
                ...attr.componentProps.props,
                ...HEADER_PROPS_DEFAULT,
                alignH: EAuxAlignH.L,
                dateDisplayTemplate: `MMM ${DATE_TEMPLATE_DAY}, ''yy`,
              }
            }
          });
          mapping.set(date.getDay().toString(), 6);
        }

        secondHeaderLine.push(attr);
      }
    });

    setMultilineHeader([firstHeaderLine, secondHeaderLine]);
    setHeaderCellUnionsMap(mapping);
    if (onHeader) onHeader(header);
  }, [header]);

  useEffect(() => {
    if (!rows2Expand) return;
    const tableId = getTableShortId(id);

    rows2Expand.rowNums.forEach(item => {
      if (!item) return;

      const row = document.getElementById(`${tableId}${(item > 0 ? item : -1 * item) }`);
      if (row) {
        row.style.display = item > 0 ? 'table-row' : 'none';
      }
    });
  }, [rows2Expand]);

  if (!works || !multilineHeader || !headerCellUnionsMap) return undefined;

  return (
    <div id={id} key={id} className={clsx(className, s['gant-chart'])} onScroll={onScroll}>
      <AdvancedTable id={`${id}-table`}
                     header={multilineHeader}
                     headerCellUnionsMapping={headerCellUnionsMap}
                     data={works}
                     freeRowsCount={3}
                     defaultSortColumn={defaultSortColumn}
      />
    </div>
  );
};

export default GantChart;
