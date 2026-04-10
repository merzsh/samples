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
  COMPLETE = 'percent_complete'
}

export enum EProjProps {
  START_DATE = 'projectStartDate',
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
  CHILDREN = 'children',
}

export type ApiProjectAttribValueTypes = string | number | Date;
export type ApiProjectAttribNodeSpecIds = EProjAttrs.WBS | EProjAttrs.NAME;
export type ApiProjectAttribLeafSpecIds =  EProjAttrs.LEN |  EProjAttrs.COMPLETE;
export type ApiProjectAttribAllIds = ApiProjectAttribNodeSpecIds | ApiProjectAttribLeafSpecIds;

export type ApiProjectHeaderAttribute = {
  [EProjHeaderProps.ID]: ApiProjectAttribAllIds;
  [EProjHeaderProps.NAME]: string;
  [EProjHeaderProps.IS_OPTIONAL4LEAF]?: boolean;
};

export type ApiProjectWork = Record<ApiProjectAttribNodeSpecIds, ApiProjectAttribValueTypes> &
  Partial<Record<ApiProjectAttribLeafSpecIds, ApiProjectAttribValueTypes>>;

export type ApiProject = {
  [EProjProps.START_DATE]: string;
  [EProjProps.CURR_DATE]?: string;
  [EProjProps.DATE_TEMPLATE]?: string;
  [EProjProps.IS_SUPPRESS_ZEROS]?: boolean;
  [EProjProps.HEADER_ATTRIBS]: ApiProjectHeaderAttribute[];
  [EProjProps.WORKS_LIST]: ApiProjectWork[];
};

export type ProjectWorkNodeProps = {
  [EProjWorkNodeProps.CHILDREN]: ProjectWorkNode[];
};

export type ProjectWorkNode = ApiProjectWork & ProjectWorkNodeProps;

export type UseProjectWorksTree = {
  rootWorkNode?: ProjectWorkNode;
};

export type UseProjectWorksTableViewMapArg = {
  workAttr: ApiProjectHeaderAttribute;
  parentWorkAttr: ApiProjectAttribNodeSpecIds;
  workNode?: ProjectWorkNode;
  colId?: string;
  isHeader?: boolean;
  isEditable?: boolean;
  level?: number;
  isLastLevel?: boolean;
  isSuppressZeros?: boolean;
};

export type UseProjectWorksTableViewMap = (props: UseProjectWorksTableViewMapArg) => AdvTblCellProps<AuxCompsProps>;

export type UseProjectWorksTableView = {
  header?: AdvTblCellProps<AuxCompsProps>[];
  works?: AdvTblCellProps<AuxCompsProps>[][];
  refreshView: () => void;
};
