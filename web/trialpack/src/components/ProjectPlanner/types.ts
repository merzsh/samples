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

import {AdvTblCellProps} from "../AuxCommon/AdvancedTable/types";
import React from "react";
import {AuxCommonProps, EColID, OnExpanderRowsProps} from "../AuxCommon/types";
import {AuxCompsProps} from "../AuxCommon/AuxUiCompGenerator/types";
import {AuxTextBoxProps} from "../AuxCommon/AuxTextBox/types";

export enum EProjAttrs {
  WBS = 'wbs_code',
  NAME = 'work_name',
  LEN = 'length',
  COMPLETE = 'percent_complete',
  S_DATE = 'start_date',
  F_DATE = 'finish_date',
  PREV = 'prev_works',
  DEFAULT = 'default',
}

export enum EProjProps {
  PROJ_START_DATE = 'projectStartDate',
  CURR_DATE = 'projectCurrDate',
  DATE_TEMPLATE = 'dateDisplayTemplate',
  IS_SUPPRESS_ZEROS = 'isSuppressZeros',
  HEADER_ATTRIBS = 'projectHeaderAttributes',
  WORKS_LIST = 'projectWorksList',
}

export enum EProjHeaderProps {
  ID = 'attrId',
  NAME = 'attrName',
  IS_OPTIONAL4LEAF = 'isOptionalForLeaf',
}

export enum EProjWorkNodeProps {
  PARENT = 'parent',
  CHILDREN = 'children',
  PREDECESSORS ='predecessors',
  FOLLOWERS = 'followers',
}

export type ApiProjectAttribValueTypes = string | string[] | number | Date;
export type ApiProjectAttribNodeKeyIds = EProjAttrs.WBS;
export type ApiProjectAttribNodeExtIds = EProjAttrs.DEFAULT;
export type ApiProjectAttribLeafSpecIds =  EProjAttrs.NAME | EProjAttrs.LEN |  EProjAttrs.COMPLETE |
  EProjAttrs.S_DATE | EProjAttrs.F_DATE | EProjAttrs.PREV;

export type ApiProjectAttribAllIds = ApiProjectAttribNodeKeyIds | ApiProjectAttribLeafSpecIds;
export type ApiGantAttribIds = ApiProjectAttribNodeKeyIds | ApiProjectAttribNodeExtIds;

export type ApiProjectHeaderAttribute<T extends ApiProjectAttribAllIds | ApiGantAttribIds> = {
  [EProjHeaderProps.ID]: T;
  [EProjHeaderProps.NAME]: string;
  [EProjHeaderProps.IS_OPTIONAL4LEAF]?: boolean;
};

export type ApiProjectWork = Record<ApiProjectAttribNodeKeyIds, ApiProjectAttribValueTypes> &
  Partial<Record<ApiProjectAttribLeafSpecIds, ApiProjectAttribValueTypes>>;

export type ApiProject = {
  [EProjProps.PROJ_START_DATE]: string;
  [EProjProps.CURR_DATE]?: string;
  [EProjProps.DATE_TEMPLATE]?: string;
  [EProjProps.IS_SUPPRESS_ZEROS]?: boolean;
  [EProjProps.HEADER_ATTRIBS]: ApiProjectHeaderAttribute<ApiProjectAttribAllIds>[];
  [EProjProps.WORKS_LIST]: ApiProjectWork[];
};

export type ProjectWorkNodeProps = {
  [EProjWorkNodeProps.PARENT]?: ProjectWorkNode;
  [EProjWorkNodeProps.CHILDREN]: ProjectWorkNode[];
  [EProjWorkNodeProps.PREDECESSORS]: ProjectWorkNode[];
  [EProjWorkNodeProps.FOLLOWERS]: ProjectWorkNode[];
};

export type ProjectWorkNode = ApiProjectWork & ProjectWorkNodeProps;

export type UseProjectWorksTreeSetWorkAttrValue = (workId: string, attribs: Partial<ApiProjectWork>) => void;

export type UseProjectWorksTree = {
  rootWorkNode?: ProjectWorkNode;
  worksTreeMap?: Map<string, ProjectWorkNode>;
  setWorkAttrValue: UseProjectWorksTreeSetWorkAttrValue;
};

export type UseProjectWorksTableViewMapArg<T extends ApiProjectAttribAllIds | ApiGantAttribIds> = {
  workAttr: ApiProjectHeaderAttribute<T>;
  parentWorkAttr: ApiProjectAttribNodeKeyIds;
  workNode?: ProjectWorkNode;
  colId?: string;
  isHeader?: boolean;
  isEditable?: boolean;
  isNonSelectable?: boolean;
  isReadOnlyMarkDisabled?: boolean;
  level?: number;
  isLastLevel?: boolean;
} & Pick<ApiProject, EProjProps.IS_SUPPRESS_ZEROS | EProjProps.DATE_TEMPLATE>;

export type UseProjectWorksTableViewMap<T extends ApiProjectAttribAllIds | ApiGantAttribIds> =
  (props: UseProjectWorksTableViewMapArg<T>) => AdvTblCellProps<AuxCompsProps>;

export type UseProjectWorksTableView = {
  header?: AdvTblCellProps<AuxTextBoxProps>[];
  works?: AdvTblCellProps<AuxCompsProps>[][];
  refreshView: () => void;
};

export type AdvancedTableViewProps = AuxCommonProps & {
  rootWorkNode: ProjectWorkNode;
  defaultSortColumn?: EColID;
  onRebuildWorksTree?: () => void;
  onChangeWorkAttrValue?: UseProjectWorksTreeSetWorkAttrValue;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  onRowSelect?: (cellId: string, isRowSelected: boolean) => void;
  onExpanderRows?: (props: OnExpanderRowsProps) => void;
  onHeader?: (header: AdvTblCellProps<AuxCompsProps>[]) => void;
};

export type WorksTreeProps = AdvancedTableViewProps &
  Required<Pick<UseProjectWorksTree, 'worksTreeMap'>> & {
  projectApi: ApiProject;
};

export type GantChartProps = AdvancedTableViewProps & {
  projectStartDate?: Date;
  rows2Expand?: OnExpanderRowsProps;
};
