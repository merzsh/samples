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
import {EAuxAlignH, EAuxTextBoxType, GantChartProps} from "../../AuxCommon/types";
import React, {useEffect, useState} from "react";
import clsx from "clsx";
import {useProjectWorksTableView} from "../hooks/useProjectWorksTableView";
import {
  ApiGantAttribIds,
  EProjAttrs,
  EProjWorkNodeProps,
  UseProjectWorksTableViewMap
} from "../types";
import {generateDateSequence, getDefaultSortColumn, mapCellBase} from "../utils";
import AdvancedTable from "../../AuxCommon/AdvancedTable";
import {format} from "date-fns";
import {STR_ISO_DATE_TEMPLATE} from "../../../utils/constants";
import {MSG_DATE_FORMATTING_ERROR} from "../../AuxCommon/constants";
import {DATE_TEMPLATE_DAY, DATE_TEMPLATE_WEEK_DAY} from "../constants";
import {AdvTblCellProps, AuxCompsProps} from "../../AuxCommon/AdvancedTable/types";

const GantChart: React.FC<GantChartProps> = ({projectApi, rootWorkNode, onScroll,
                                               onHeader, id, className}
) => {

  const { header, works } = useProjectWorksTableView(
    [
      { attrId: 'wbs_code', attrName: 'WBS', },
      ...generateDateSequence(new Date(projectApi.projectStartDate), 100)
        .map(date => {
          let attrId = '', attrName = '';

          try {
            attrId =  format(date, STR_ISO_DATE_TEMPLATE);
          } catch (err) {
            console.warn(`GantChart: ${MSG_DATE_FORMATTING_ERROR} '${STR_ISO_DATE_TEMPLATE}'`, err);
          }

          try {
            attrName =  format(date, DATE_TEMPLATE_WEEK_DAY);
          } catch (err) {
            console.warn(`GantChart: ${MSG_DATE_FORMATTING_ERROR} '${DATE_TEMPLATE_WEEK_DAY}'`, err);
          }

          return { attrId, attrName };
        })
    ],
    new Map<ApiGantAttribIds, UseProjectWorksTableViewMap<ApiGantAttribIds>>([
      [EProjAttrs.WBS, (props) => {
        if (props.isHeader) {
          const headerCell = mapCellBase(props);

          headerCell.isHorizResizable = undefined;
          if (headerCell.componentProps.props) {
            headerCell.componentProps.props.isMonospaced = true;
          }

          return headerCell;
        }

        return mapCellBase({
          ...props, isNonSelectable: true,
        }, () => {
          let value = '', type = EAuxTextBoxType.TEXT;
          if (!props.workNode) return [value, type];

          value = props.workAttr.attrId === EProjAttrs.WBS ? props.workNode[EProjAttrs.WBS].toString() : '';

          return [value, type];
        });
      }]
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

      if (attrId === EProjAttrs.WBS) {
        firstHeaderLine.push(attr);
        mapping.set(attrId, 0);
      } else {
        let day = '', label = '';

        try {
          day = format(new Date(attrId), DATE_TEMPLATE_WEEK_DAY);
          label = format(new Date(attrId), `MMM ${DATE_TEMPLATE_DAY}, ''yy`);
        } catch (err) {
          console.warn(`GantChart.useEffect: ${MSG_DATE_FORMATTING_ERROR} '${DATE_TEMPLATE_WEEK_DAY}' (or other)`, err);
        }

        if (day === 'M') {
          firstHeaderLine.push({
            ...attr,
            componentProps: {
              ...attr.componentProps,
              value: label,
              extData: { currColumnName: day },
              props: {
                ...attr.componentProps.props,
                alignH: EAuxAlignH.L,
              }
            }
          });
          mapping.set(day, 6);
        }

        secondHeaderLine.push(attr);
      }
    });

    setMultilineHeader([firstHeaderLine, secondHeaderLine]);
    setHeaderCellUnionsMap(mapping);
    if (onHeader) onHeader(header);
  }, [header]);

  if (!works || !multilineHeader || !headerCellUnionsMap) return undefined;

  return (
    <div id={id} key={id} className={clsx(className, s['gant-chart'])} onScroll={onScroll}>
      <AdvancedTable id={`${id}-table`}
                     header={multilineHeader}
                     headerCellUnionsMapping={headerCellUnionsMap}
                     works={works}
                     freeRowsCount={3}
                     defaultSortColumn={getDefaultSortColumn(projectApi.projectHeaderAttributes, EProjAttrs.WBS)}
      />
    </div>
  );
};

export default GantChart;
