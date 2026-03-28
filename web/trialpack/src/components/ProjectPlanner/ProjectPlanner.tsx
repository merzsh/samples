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
import React, {useEffect, useRef} from 'react';
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
import {AuxLevelTextBoxProps, AuxTextBoxProps, EAuxAlignH, EAuxSize} from "../AuxCommon/types";
import {projectSampleData} from "./fixtures";
import AuxLevelTextBox from "../AuxCommon/AuxLevelTextBox";
import {AuxTextBoxConfig} from "../AuxCommon/AuxTextBox/types";
import {ApiProjectAttribAllIds, ApiProjectWork, ProjectWorkNode} from "./types";
import {addTreeNode, findTreeNode} from "../../utils/utils";
import {getParentWbs} from "./utils";
import {getColNameByCellId, getRowNumByCellId} from "../AuxCommon/AdvancedTable/utils";

type ProjectPlannerProps = {
  title?: string;
};

export const ProjectPlanner: React.FC<ProjectPlannerProps> = ({}) => {

  const headerColsListRef = useRef<Map<string, AdvTblCellPropsAbstract<AuxTextBoxProps>>>();
  const bodyColsListRef = useRef<Map<string, AdvTblCellProps<AuxCompsProps>>[]>();
  const projectWorksTree = useRef<ProjectWorkNode>({
    wbs_code: '',
    work_name: projectSampleData.projectTitle,
    children: [],
  });

  useEffect(() => {
    if (!projectSampleData.projectHeaderAttributes.length) return;

    // build works header
    headerColsListRef.current = new Map<string, AdvTblCellPropsAbstract<AuxTextBoxProps>>(
      projectSampleData.projectHeaderAttributes.map((item, index) => {
        const colId: string = COLUMN_IDS[index];

        return [colId, {
          id: colId,
          component: AuxTextBox,
          componentProps: {
            attrId: item.attrId,
            text: item.attrName,
            props: {
              isNonSelectable: true,
              fontSize: EAuxSize.M,
              alignH: EAuxAlignH.L,
              isBold: true,
            },
          },
          border:  BORDER_FULL,
          background: EAdvTblBackground.HEADER,
        }];
      })
    );

    bodyColsListRef.current = [];

    if (!projectSampleData.projectWorksList.length) return;

    // build works tree
    const parentAttr: ApiProjectAttribAllIds = 'wbs_code';
    const childrenProp: keyof ProjectWorkNode = 'children';

    projectSampleData.projectWorksList
      .sort((a, b) => (
        a[parentAttr] < b[parentAttr] ? -1 : a[parentAttr] > b[parentAttr] ? 1 : 0))
      .forEach(row => {
        const newNode: ProjectWorkNode = {
          ...row,
          children: [],
        }

        addTreeNode(projectWorksTree.current, newNode, {
          [parentAttr]: getParentWbs(newNode[parentAttr].toString())
        }, childrenProp);
      });

    // build works list for UI table layout from project tree by each node traversing
    let rowIndex = 0;

    findTreeNode(projectWorksTree.current, {}, childrenProp, 0,
      (node, level, isLastLevel) => {
        if (!bodyColsListRef.current) return;

        const row = new Map<string, AdvTblCellProps<AuxCompsProps>>(
          projectSampleData.projectHeaderAttributes
            .map((prop, colIndex) => {
              const attr = prop.attrId as keyof typeof node;

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
              const value = node[attr];
              const componentProps = {
                id: colId,
                text: value ? value.toString() : '',
                props: cellProps,
              };

              let result: [string, AdvTblCellProps<AuxCompsProps>];
              const extDataObj: Partial<ApiProjectWork> = {
                [parentAttr]: node[parentAttr].toString(),
                [attr]: '',
              };
              const extData = JSON.stringify(extDataObj);

              console.log(12345, 'ProjectPlanner', extDataObj[parentAttr], value);

              if (attr === 'work_name') {
                const colProps: AdvTblCellPropsAbstract<AuxLevelTextBoxProps> = {
                  ...colCommon,
                  component: AuxLevelTextBox,
                  componentProps: {
                    ...componentProps,
                    extData,
                    level,
                    isExpanded: !!extDataObj[parentAttr] ? true : undefined,
                    isExpanderVisible: !isLastLevel && !!extDataObj[parentAttr],
                    onExpanderClick: (id, extData) => {
                      const result: number[] = [];
                      if (!bodyColsListRef.current?.length || !extData || !id) return result;

                      let exdDataObj: Partial<ApiProjectWork> | undefined = undefined;
                      try {
                        exdDataObj = JSON.parse(extData);
                      } catch (error) {
                        console.warn(`Json parsing error: ${(error as Error).message}`, error);
                      }

                      if (!exdDataObj) return result;

                      const rowNum = getRowNumByCellId(id);
                      if (!rowNum) return result;

                      const row = bodyColsListRef.current[rowNum-1];
                      const col = [...row.values()]
                        .find(item => (item.componentProps.text === exdDataObj[parentAttr]));

                      if (!col) return result;

                      const colName = getColNameByCellId(col.id);
                      if (!colName) return result;

                      bodyColsListRef.current.forEach((rowItem, rowIndex) => {
                        const colItem = rowItem.get(`${colName}${rowIndex+1}`);
                        if (!colItem) return;

                        const id = exdDataObj[parentAttr];
                        if (!id) return;

                        if (colItem.componentProps.text?.startsWith(id.toString())) {
                          result.push(rowIndex+1);
                        }
                      })

                      return result;
                    }
                  }
                };
                result = [colId, colProps];
              } else {
                const colProps: AdvTblCellPropsAbstract<AuxTextBoxProps> = {
                  ...colCommon,
                  component: AuxTextBox,
                  componentProps: {
                    ...componentProps,
                    extData,
                  }
                };
                result = [colId, colProps];
              }

              return result;
            })
        );

        bodyColsListRef.current.push(row);

        rowIndex++;
      });

  }, []);

  if (!headerColsListRef.current || !bodyColsListRef.current) return;

  return (
    <div className={`${s['proj-plan']}`}>
      <AdvancedTable className={`${s['proj-plan__table']}`} header={headerColsListRef.current}
                     body={bodyColsListRef.current} isWithRowNums freeRowsCount={3} />
    </div>
  );
};

export default ProjectPlanner;
