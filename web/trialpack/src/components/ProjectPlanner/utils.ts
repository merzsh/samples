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
  ApiProjectHeaderAttribute,
  ApiProjectWork,
  EProjAttrs,
  EProjHeaderProps,
  EProjProps,
  EProjWorkNodeProps,
  ProjectWorkNode,
  UseProjectWorksTableViewMap
} from "./types";
import {prop} from "../../utils/utils";
import {BORDER_FULL} from "./constants";
import {AdvTblCellProps, EAdvTblBackground} from "../AuxCommon/AdvancedTable/types";
import {AuxCompExtData, AuxTextBoxProps, EAuxAlignH, EAuxSize, EAuxTextBoxType, EColID} from "../AuxCommon/types";
import {BOOL_INIT, NUM_INIT, STR_INIT} from "../AuxCommon/constants";
import {INIT_TEXT_BOX_CELL_PROPS} from "../AuxCommon/AdvancedTable/constants";
import {format} from "date-fns";
import {STR_ISO_DATE_TEMPLATE} from "../../utils/constants";

export function getParentWbs(wbsInDottedTemplate: string, splitter = '.'): string {
  if (!wbsInDottedTemplate) return STR_INIT;

  const parts = wbsInDottedTemplate.split(splitter);
  if (parts.length === 1) return STR_INIT;

  return parts.slice(0, parts.length - 1).join(splitter);
}

export function getWbsLevelNum(wbsInDottedTemplate: string, splitter = '.'): number {
  if (!wbsInDottedTemplate) return 0;

  let result = 1, wbs = wbsInDottedTemplate;
  while (wbs = getParentWbs(wbs, splitter)) {
    result++;
  }
  return result;
}

export function castApiRawResponse(rawAnswerObject: any): ApiProject {
  const result: ApiProject = {
    [EProjProps.PROJ_START_DATE]: STR_INIT,
    [EProjProps.HEADER_ATTRIBS]: [],
    [EProjProps.WORKS_LIST]: [],
  };

  result[EProjProps.PROJ_START_DATE] = prop(rawAnswerObject, EProjProps.PROJ_START_DATE, STR_INIT) ?? STR_INIT;
  result[EProjProps.CURR_DATE] = prop(rawAnswerObject, EProjProps.CURR_DATE, STR_INIT) ?? STR_INIT;
  result[EProjProps.DATE_TEMPLATE] = prop(rawAnswerObject, EProjProps.DATE_TEMPLATE, STR_INIT) ?? STR_INIT;
  result[EProjProps.IS_SUPPRESS_ZEROS] = prop(rawAnswerObject, EProjProps.IS_SUPPRESS_ZEROS, BOOL_INIT) ?? BOOL_INIT;

  const works = prop(rawAnswerObject, EProjProps.WORKS_LIST, []) ?? [];
  works.forEach(item => {
    const res: ApiProjectWork = {
      [EProjAttrs.WBS]: STR_INIT,
      [EProjAttrs.NAME]: STR_INIT,
    };

    res[EProjAttrs.WBS] = prop(item, EProjAttrs.WBS, STR_INIT) ?? STR_INIT;
    res[EProjAttrs.NAME] = prop(item, EProjAttrs.NAME, STR_INIT) ?? STR_INIT;
    res[EProjAttrs.LEN] = prop(item, EProjAttrs.LEN, NUM_INIT) ?? NUM_INIT;
    res[EProjAttrs.COMPLETE] = prop(item, EProjAttrs.COMPLETE, NUM_INIT) ?? NUM_INIT;

    const prev = prop(item, EProjAttrs.PREV, []);
    res[EProjAttrs.PREV] = prev && Array.isArray(prev) && prev.length && prev.every(
      item => typeof item === 'string') ? prev : [];

    result[EProjProps.WORKS_LIST].push(res);
  });

  const headerAttrsArr = prop(rawAnswerObject, EProjProps.HEADER_ATTRIBS, []) ?? [];
  headerAttrsArr.forEach(item => {
    const res: ApiProjectHeaderAttribute = {
      [EProjHeaderProps.ID]: EProjAttrs.WBS,
      [EProjHeaderProps.NAME]: EProjAttrs.NAME,
    };

    res[EProjHeaderProps.ID] = prop(item, EProjHeaderProps.ID, EProjAttrs.WBS) ?? EProjAttrs.WBS;
    res[EProjHeaderProps.NAME] = prop(item, EProjHeaderProps.NAME, ''.toString()) ?? '';
    res[EProjHeaderProps.IS_OPTIONAL4LEAF] = prop(item, EProjHeaderProps.IS_OPTIONAL4LEAF, false);

    result[EProjProps.HEADER_ATTRIBS].push(res);
  });

  return result;
}

export const mapCell: UseProjectWorksTableViewMap = ({workAttr, parentWorkAttr,
                                                       workNode, colId,
                                                       isHeader, isEditable,
                                                       isNonSelectable, isLastLevel,
                                                       isSuppressZeros, dateDisplayTemplate} ):
  AdvTblCellProps<AuxTextBoxProps> => {

  const result: AdvTblCellProps<AuxTextBoxProps> = { ...INIT_TEXT_BOX_CELL_PROPS };
  const extData: AuxCompExtData = { };

  let value = STR_INIT, type = EAuxTextBoxType.TEXT,
    alignH = EAuxAlignH.L, level = 0;

  if (workNode) {
    extData.currColumnName = workAttr.attrId;
    extData.keyColumnValue = workNode ? workNode[parentWorkAttr].toString() : STR_INIT;
    level = getWbsLevelNum(extData.keyColumnValue);

    const attrValue = workNode[workAttr.attrId];

    if (typeof attrValue === 'string') {
      value = attrValue;
    } else if (Array.isArray(attrValue)) {
      value = attrValue.join(',');
    } else if (typeof attrValue === 'number') {
      value = attrValue.toString();
      type = EAuxTextBoxType.NUM;
      alignH = EAuxAlignH.R;
    } else if (attrValue instanceof Date) {
      try {
        value = format(attrValue, STR_ISO_DATE_TEMPLATE);
      } catch (err) {
        console.warn(`Date to string by template '${STR_ISO_DATE_TEMPLATE}' formatting error`, err);
      }
      type = EAuxTextBoxType.DATE;
      alignH = EAuxAlignH.C;
    }
  }

  return {
    ...result,
    id: colId ?? '',
    background: isHeader ? EAdvTblBackground.HEADER : undefined,
    border: BORDER_FULL,
    componentProps: {
      id: colId ?? '',
      value: isHeader ? workAttr.attrName : value,
      type,
      level,
      extData,
      props: {
        fontSize: EAuxSize.M,
        isEditable: isHeader ? false : isEditable,
        isBold: isHeader ? true : !isLastLevel,
        alignH,
        isNonSelectable,
        isSuppressZeros,
        dateDisplayTemplate,
      },
    }
  };
}

export function getDefaultSortColumn(attrs: ApiProjectHeaderAttribute[], attribId: EProjAttrs) {
  let result = EColID.A;

  const found = attrs.find(item => item.attrId === attribId);
  if (found) {
    const index = attrs.indexOf(found);
    result = Object.values(EColID)[index];
  }

  return result;
}

export const mapWorkAttrBasic: UseProjectWorksTableViewMap = (props) => {
  const result = mapCell(props);

  return {
    ...result,
    componentProps: {
      ...result.componentProps,
      props: {
        ...result.componentProps.props,
      }
    }
  };
};

export function calcWorkNodeDates(node: ProjectWorkNode, defaultDate?: Date):
  [Date | undefined, Date | undefined] {

  let startDate: Date | undefined, finishDate: Date | undefined;

  if (!node.predecessors.length) startDate = new Date(defaultDate ?? new Date());
  else {
    startDate = new Date(Math.max(...node.predecessors.map (pred =>
      pred.finish_date instanceof Date ? pred.finish_date.getTime() : 0)));
    startDate.setDate(startDate.getDate() + 1);
  }

  if (startDate) {
    const len = typeof node.length === 'number' && !isNaN(node.length) ? node.length : 0;
    finishDate = new Date(startDate);
    finishDate.setDate(finishDate.getDate() + len - 1);
  } else {
    finishDate = new Date(defaultDate ?? new Date());
  }

  return [
    startDate,
    finishDate,
  ];
}

export function createMilestone(node: ProjectWorkNode, isStart = true): [ProjectWorkNode, Map<string, ProjectWorkNode[]>] {
  const note = `${isStart ? 'start' : 'finish'}Milestone`;
  const milestoneChildrenField = isStart ? EProjWorkNodeProps.FOLLOWERS : EProjWorkNodeProps.PREDECESSORS;
  const subChildrenField = isStart ? EProjWorkNodeProps.PREDECESSORS : EProjWorkNodeProps.FOLLOWERS;
  const test: (child: ProjectWorkNode) => boolean = (child) => !child[subChildrenField].length || child[subChildrenField].every(
    pred => getParentWbs(pred.wbs_code.toString()) !== getParentWbs(child.wbs_code.toString()));

  const milestone: ProjectWorkNode = { wbs_code: note, work_name: note, children: [], followers: [], predecessors: [] };

  milestone[milestoneChildrenField] = [...node.children.filter(test)];
  milestone[subChildrenField] = [];

  const savedRefs = new Map<string, ProjectWorkNode[]>();

  milestone[milestoneChildrenField].forEach(follower => {
    savedRefs.set(follower.wbs_code.toString(), follower[subChildrenField]);
    follower[subChildrenField] = [milestone];
  });

  return [milestone, savedRefs];
}

export function calcLenDates4SumNode(node: ProjectWorkNode, nodes: Map<string, ProjectWorkNode>,
                                     onCalc: (node: ProjectWorkNode, milestone: ProjectWorkNode) => void) {

  const [_, startMilestoneSavedRefs] = createMilestone(node, true);
  const [finishMilestone, finishMilestoneSavedRefs] = createMilestone(node, false);

  onCalc(node, finishMilestone);

  [...startMilestoneSavedRefs.keys()].forEach(nodeId => {
    const subNode = nodes.get(nodeId);
    if (subNode) {
      subNode.predecessors = startMilestoneSavedRefs.get(nodeId) ?? [];
    }
  });

  [...finishMilestoneSavedRefs.keys()].forEach(nodeId => {
    const subNode = nodes.get(nodeId);
    if (subNode) {
      subNode.followers = finishMilestoneSavedRefs.get(nodeId) ?? [];
    }
  });
}
