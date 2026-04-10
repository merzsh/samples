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
  ApiProject, ApiProjectAttribValueTypes,
  ApiProjectHeaderAttribute, ApiProjectWork,
  EProjAttrs,
  EProjHeaderProps,
  EProjProps,
  UseProjectWorksTableViewMap
} from "./types";
import {prop} from "../../utils/utils";
import {BORDER_FULL} from "./constants";
import {AdvTblCellProps, EAdvTblBackground} from "../AuxCommon/AdvancedTable/types";
import {AuxCompExtData, AuxTextBoxProps, EAuxAlignH, EAuxSize, EAuxTextBoxType, EColID} from "../AuxCommon/types";
import {BOOL_INIT, NUM_INIT, STR_INIT} from "../AuxCommon/constants";
import {INIT_TEXT_BOX_CELL_PROPS} from "../AuxCommon/AdvancedTable/constants";

export function getParentWbs(wbsInDottedTemplate: string, splitter = '.'): string {
  if (!wbsInDottedTemplate) return STR_INIT;

  const parts = wbsInDottedTemplate.split(splitter);
  if (parts.length === 1) return STR_INIT;

  return parts.slice(0, parts.length - 1).join(splitter);
}

export function castApiRawResponse(rawAnswerObject: any): ApiProject {
  const result: ApiProject = {
    [EProjProps.START_DATE]: STR_INIT,
    [EProjProps.HEADER_ATTRIBS]: [],
    [EProjProps.WORKS_LIST]: [],
  };

  result[EProjProps.START_DATE] = prop(rawAnswerObject, EProjProps.START_DATE, STR_INIT) ?? STR_INIT;
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
                                                       isLastLevel, isSuppressZeros} ):
  AdvTblCellProps<AuxTextBoxProps> => {

  const result: AdvTblCellProps<AuxTextBoxProps> = { ...INIT_TEXT_BOX_CELL_PROPS };

  const attr = workAttr.attrId as keyof typeof workNode;
  const extData: AuxCompExtData = {
    currColumnName: attr,
    keyColumnValue: workNode ? workNode[parentWorkAttr].toString() : STR_INIT,
  };

  let value = STR_INIT, type = EAuxTextBoxType.TEXT;
  const attrValue: ApiProjectAttribValueTypes = workNode?.[attr] ?? STR_INIT;

  if (typeof workNode?.[attr] === 'string') {
    value = attrValue;
  } else if (typeof workNode?.[attr] === 'number') {
    value = attrValue.toString();
    type = EAuxTextBoxType.NUM;
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
      extData,
      props: {
        isNonSelectable: true,
        fontSize: EAuxSize.M,
        isEditable: isHeader ? false : isEditable,
        isBold: isHeader ? true : !isLastLevel,
        alignH: EAuxAlignH.L,
        isSuppressZeros,
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
