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
import {AdvTblCellProps, AuxCompsProps} from "../AuxCommon/AdvancedTable/types";

export enum EProjAttrs {
  WBS = 'wbs_code',
  NAME = 'work_name',
  LEN = 'length',
  COMPLETE = 'percent_complete',
  S_DATE = 'start_date',
  F_DATE = 'finish_date',
  PREV = 'prev_works',
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
export type ApiProjectAttribNodeSpecIds = EProjAttrs.WBS | EProjAttrs.NAME;
export type ApiProjectAttribLeafSpecIds =  EProjAttrs.LEN |  EProjAttrs.COMPLETE |
  EProjAttrs.S_DATE | EProjAttrs.F_DATE | EProjAttrs.PREV;
export type ApiProjectAttribAllIds = ApiProjectAttribNodeSpecIds | ApiProjectAttribLeafSpecIds;
export type ApiGantAttribIds = EProjAttrs.WBS | string;

export type ApiProjectHeaderAttribute<T extends ApiProjectAttribAllIds | ApiGantAttribIds> = {
  [EProjHeaderProps.ID]: T;
  [EProjHeaderProps.NAME]: string;
  [EProjHeaderProps.IS_OPTIONAL4LEAF]?: boolean;
};

export type ApiProjectWork = Record<ApiProjectAttribNodeSpecIds, ApiProjectAttribValueTypes> &
  Partial<Record<ApiProjectAttribLeafSpecIds, ApiProjectAttribValueTypes>>;

export type ApiProject<T extends ApiProjectAttribAllIds | ApiGantAttribIds> = {
  [EProjProps.PROJ_START_DATE]: string;
  [EProjProps.CURR_DATE]?: string;
  [EProjProps.DATE_TEMPLATE]?: string;
  [EProjProps.IS_SUPPRESS_ZEROS]?: boolean;
  [EProjProps.HEADER_ATTRIBS]: ApiProjectHeaderAttribute<T>[];
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
  parentWorkAttr: ApiProjectAttribNodeSpecIds;
  workNode?: ProjectWorkNode;
  colId?: string;
  isHeader?: boolean;
  isEditable?: boolean;
  isNonSelectable?: boolean;
  isReadOnlyMarkDisabled?: boolean;
  level?: number;
  isLastLevel?: boolean;
} & Pick<ApiProject<T>, EProjProps.IS_SUPPRESS_ZEROS | EProjProps.DATE_TEMPLATE>;

export type UseProjectWorksTableViewMap<T extends ApiProjectAttribAllIds | ApiGantAttribIds> =
  (props: UseProjectWorksTableViewMapArg<T>) => AdvTblCellProps<AuxCompsProps>;

export type UseProjectWorksTableView = {
  header?: AdvTblCellProps<AuxCompsProps>[];
  works?: AdvTblCellProps<AuxCompsProps>[][];
  refreshView: () => void;
};
