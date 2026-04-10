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
import {
  ApiProject,
  ApiProjectAttribAllIds, ApiProjectAttribNodeSpecIds,
  ApiProjectHeaderAttribute, EProjProps,
  ProjectWorkNode, ProjectWorkNodeProps,
  UseProjectWorksTableView, UseProjectWorksTableViewMap
} from "../types";
import {useCallback, useEffect, useState} from "react";
import {AdvTblCellProps, AuxCompsProps} from "../../AuxCommon/AdvancedTable/types";
import {AuxTextBoxProps, EColID} from "../../AuxCommon/types";
import {findTreeNode} from "../../../utils/utils";
import {INIT_TEXT_BOX_CELL_PROPS} from "../../AuxCommon/AdvancedTable/constants";

export const useProjectWorksTableView = (projectSettings: Pick<ApiProject, EProjProps.IS_SUPPRESS_ZEROS>,
                                         headerAttrs: ApiProjectHeaderAttribute[],
                                         mappings: Map<ApiProjectAttribAllIds, UseProjectWorksTableViewMap>,
                                         parentWorkAttr: ApiProjectAttribNodeSpecIds,
                                         childrenProp: keyof ProjectWorkNodeProps,
                                         rootWorkNode?: ProjectWorkNode):
  UseProjectWorksTableView => {

  const [rootWorkNodeInt, setRootWorkNodeInt] = useState<ProjectWorkNode>();
  const [header, setHeader] = useState<AdvTblCellProps<AuxCompsProps>[]>();
  const [works, setWorks] = useState<AdvTblCellProps<AuxCompsProps>[][]>();

  useEffect(() => {
    if (!rootWorkNode) return;
    setRootWorkNodeInt(rootWorkNode);
  }, [rootWorkNode]);

  useEffect(() => {
    if (!rootWorkNodeInt) return;

    // build header for UI table layout
    const headerResult: AdvTblCellProps<AuxTextBoxProps>[] = [];

    headerAttrs.forEach((attr, attrIndex) => {
      const {attrId, attrName} = attr;
      const mapping = mappings.get(attrId);

      headerResult.push(mapping
        ? mapping({
          workAttr: {attrId, attrName},
          parentWorkAttr,
          colId: `${Object.values(EColID)[attrIndex]}`,
          isHeader: true,
        })
        : INIT_TEXT_BOX_CELL_PROPS);
    });

    setHeader(headerResult);

    // build works list for UI table layout from project tree by each node traversing
    const worksResult: AdvTblCellProps<AuxCompsProps>[][] = [];

    findTreeNode(rootWorkNodeInt, {}, childrenProp,
      (node, level, isLastLevel) => {
        const row: AdvTblCellProps<AuxCompsProps>[] = headerAttrs
          .map((prop, colIndex) => {
            const {attrId, attrName} = prop;
            const mapping = mappings.get(attrId);

            return mapping
              ? mapping({
                workAttr: {attrId, attrName},
                parentWorkAttr,
                workNode: node,
                colId: `${Object.values(EColID)[colIndex]}`,
                isEditable: true,
                isSuppressZeros: projectSettings.isSuppressZeros,
                level,
                isLastLevel,
              })
              : INIT_TEXT_BOX_CELL_PROPS;
          });

        worksResult.push(row);
      });

    setWorks(worksResult);
  }, [rootWorkNodeInt]);

  const refreshView = useCallback(()=> {
    if (!rootWorkNode) return;
    setRootWorkNodeInt({...rootWorkNode});
  }, [rootWorkNode]);

  return {
    header,
    works,
    refreshView,
  }
};
