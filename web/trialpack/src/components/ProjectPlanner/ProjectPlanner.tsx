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
import React, {useCallback, useRef, useState} from 'react';
import AuxViews from "../AuxCommon/AuxViews";
import WorksTree from "./WorksTree";
import {GANT_VIEW_ID, TREE_VIEW_ID} from "./constants";
import {castApiRawResponse, getWorksViewsIds} from "./utils";
import {projectSampleDataApiRawResponse} from "./fixtures";
import {useProjectWorksTree} from "./hooks/useProjectWorksTree";
import GantChart from "./GantChart";
import {setRowSelection} from "../AuxCommon/AdvancedTable/utils";
import {OnExpanderRowsProps} from "../AuxCommon/types";
import {ApiProjectWork} from "./types";
import {AdvTblCellProps, AuxCompsProps} from "../AuxCommon/AdvancedTable/types";

type ProjectPlannerProps = {
  title?: string;
};

export const ProjectPlanner: React.FC<ProjectPlannerProps> = ({}) => {
  const [projectApi, setProjectApi] = useState(castApiRawResponse(projectSampleDataApiRawResponse));

  const { rootWorkNode, setWorkAttrValue } = useProjectWorksTree(projectApi);

  const treeViewDivRef = useRef<HTMLDivElement>();
  const treeViewColsCountRef = useRef<number>();

  const gantViewDivRef = useRef<HTMLDivElement>();
  const gantViewColsCountRef = useRef<number>();

  const [rows2Expand, setRows2Expand] = useState<OnExpanderRowsProps>();

  const onRebuildWorksTree = useCallback<() => void>(() => setProjectApi({ ...projectApi }), [projectApi]);

  const onChangeWorkAttrValue = useCallback<(workId: string, attribs: Partial<ApiProjectWork>) => void>((workId, attribs) =>
    setWorkAttrValue(workId, attribs), []);

  const onScrollTree = useCallback<() => void>(() => {
    if (!treeViewDivRef.current || !gantViewDivRef.current)
      [treeViewDivRef.current, gantViewDivRef.current] = getWorksViewsIds([TREE_VIEW_ID, GANT_VIEW_ID]);
    gantViewDivRef.current.scrollTop = treeViewDivRef.current.scrollTop;
  }, []);

  const onScrollGant = useCallback<() => void>(() => {
    if (!treeViewDivRef.current || !gantViewDivRef.current)
      [treeViewDivRef.current, gantViewDivRef.current] = getWorksViewsIds([TREE_VIEW_ID, GANT_VIEW_ID]);
    treeViewDivRef.current.scrollTop = gantViewDivRef.current.scrollTop;
  }, []);

  const onHeaderTree = useCallback<(header: AdvTblCellProps<AuxCompsProps>[]) => void>((header) =>
    treeViewColsCountRef.current = header.length, []);

  const onHeaderGant = useCallback<(header: AdvTblCellProps<AuxCompsProps>[]) => void>((header) =>
    gantViewColsCountRef.current = header.length, []);

  const onRowSelect = useCallback<(cellId: string, isRowSelected: boolean) => void>((cellId, isRowSelected) => {
    if (!treeViewColsCountRef.current || !gantViewColsCountRef.current) return;
    setRowSelection(cellId, isRowSelected, treeViewColsCountRef.current, TREE_VIEW_ID);
    setRowSelection(cellId, isRowSelected, gantViewColsCountRef.current, GANT_VIEW_ID);
  }, []);

  const onExpanderRows = useCallback<(props: OnExpanderRowsProps) => void>((props) => {
    setRows2Expand(props);
  }, []);

  if (!rootWorkNode) return undefined;

  return (
    <AuxViews className={`${s['proj-plan']}`} resizerScreenAdjustmentInPx={250}>
      <WorksTree id={TREE_VIEW_ID} className={s['proj-plan__view']}
                 projectApi={projectApi} rootWorkNode={rootWorkNode}
                 onRebuildWorksTree={onRebuildWorksTree}
                 onChangeWorkAttrValue={onChangeWorkAttrValue}
                 onScroll={onScrollTree}
                 onHeader={onHeaderTree}
                 onRowSelect={onRowSelect}
                 onExpanderRows={onExpanderRows}
      />

      <GantChart id={GANT_VIEW_ID} className={s['proj-plan__view']}
                 projectApi={projectApi} rootWorkNode={rootWorkNode}
                 rows2Expand={rows2Expand}
                 onScroll={onScrollGant}
                 onHeader={onHeaderGant}
      />
    </AuxViews>
  );
};

export default ProjectPlanner;
