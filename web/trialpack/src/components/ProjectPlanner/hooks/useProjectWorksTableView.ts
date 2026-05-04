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
  ApiGantAttribIds,
  ApiProjectAttribAllIds,
  ApiProjectAttribNodeSpecIds,
  ApiProjectHeaderAttribute,
  ProjectWorkNode,
  ProjectWorkNodeProps,
  UseProjectWorksTableView,
  UseProjectWorksTableViewMap
} from "../types";
import {useCallback, useEffect, useState} from "react";
import {AdvTblCellProps, AuxCompsProps} from "../../AuxCommon/AdvancedTable/types";
import {AuxTextBoxProps} from "../../AuxCommon/types";
import {findTreeNode} from "../../../utils/utils";
import {INIT_TEXT_BOX_CELL_PROPS} from "../../AuxCommon/AdvancedTable/constants";
import {getColIdBySeqNumber} from "../../AuxCommon/AdvancedTable/utils";

export const useProjectWorksTableView = <T extends ApiProjectAttribAllIds | ApiGantAttribIds>(
  headerAttrs: ApiProjectHeaderAttribute<T>[], mappings: Map<T, UseProjectWorksTableViewMap<T>>,
  parentWorkAttr: ApiProjectAttribNodeSpecIds, childrenProp: keyof ProjectWorkNodeProps, rootWorkNode?: ProjectWorkNode
): UseProjectWorksTableView => {

  const [rootWorkNodeInt, setRootWorkNodeInt] = useState<typeof rootWorkNode>();
  const [header, setHeader] = useState<AdvTblCellProps<AuxCompsProps>[]>();
  const [works, setWorks] = useState<AdvTblCellProps<AuxCompsProps>[][]>();

  useEffect(() => {
    if (!rootWorkNode || !headerAttrs.length) return;

    setRootWorkNodeInt(rootWorkNode);
  }, [rootWorkNode]);

  useEffect(() => {
    if (!rootWorkNodeInt) return;

    // build header for UI table layout
    const headerResult: AdvTblCellProps<AuxTextBoxProps>[] = [];

    headerAttrs.forEach((attr, attrIndex) => {
      const {attrId, attrName} = attr;
      let mapping = mappings.get(attrId);
      if (!mapping && mappings.size) [mapping] = [...mappings.values()];

      headerResult.push(mapping
        ? mapping({
          workAttr: {attrId, attrName},
          parentWorkAttr,
          colId: `${getColIdBySeqNumber(attrIndex)}`,
          isHeader: true,
          isNonSelectable: true,
          isReadOnlyMarkDisabled: true,
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
            let mapping = mappings.get(attrId);
            if (!mapping && mappings.size) [mapping] = [...mappings.values()];

            return mapping
              ? mapping({
                workAttr: {attrId, attrName},
                parentWorkAttr,
                workNode: node,
                colId: `${getColIdBySeqNumber(colIndex)}`,
                isEditable: true,
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
