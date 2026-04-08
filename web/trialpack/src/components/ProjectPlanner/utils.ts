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
  EProjAttrs,
  EProjHeaderProps,
  EProjProps,
  UseProjectWorksTableViewMap
} from "./types";
import {prop} from "../../utils/utils";
import {BORDER_FULL, INIT_TEXT_BOX_CELL_PROPS} from "./constants";
import {AdvTblCellProps, EAdvTblBackground} from "../AuxCommon/AdvancedTable/types";
import {AuxTextBoxProps, EAuxAlignH, EAuxSize, EColID} from "../AuxCommon/types";

export function getParentWbs(wbsInDottedTemplate: string, splitter = '.'): string {
  if (!wbsInDottedTemplate) return '';

  const parts = wbsInDottedTemplate.split(splitter);
  if (parts.length === 1) return '';

  return parts.slice(0, parts.length - 1).join(splitter);
}

export function castApiRawResponse(rawAnswerObject: any): ApiProject {
  const result: ApiProject = {
    [EProjProps.START_DATE]: '',
    [EProjProps.HEADER_ATTRIBS]: [],
    [EProjProps.WORKS_LIST]: [],
  };

  result[EProjProps.START_DATE] = prop(rawAnswerObject, EProjProps.START_DATE, ''.toString()) ?? '';
  result[EProjProps.CURR_DATE] = prop(rawAnswerObject, EProjProps.CURR_DATE, ''.toString()) ?? '';
  result[EProjProps.DATE_TEMPLATE] = prop(rawAnswerObject, EProjProps.DATE_TEMPLATE, ''.toString()) ?? '';

  result[EProjProps.WORKS_LIST] = prop(rawAnswerObject, EProjProps.WORKS_LIST, []) ?? [];

  const headerAttrsArr = prop(rawAnswerObject, EProjProps.HEADER_ATTRIBS, []) ?? [];
  headerAttrsArr.forEach(item => {
    const res: ApiProjectHeaderAttribute = {
      attrId: EProjAttrs.WBS,
      attrName: EProjAttrs.NAME,
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
                                                       isLastLevel} ):
  AdvTblCellProps<AuxTextBoxProps> => {

  const result: AdvTblCellProps<AuxTextBoxProps> = { ...INIT_TEXT_BOX_CELL_PROPS };

  const attr = workAttr.attrId as keyof typeof workNode;
  const extData = {
    [attr]: '',
    [parentWorkAttr]: workNode ? workNode[parentWorkAttr] : '',
  };

  const value: string = workNode ? workNode[attr] : '';

  return {
    ...result,
    id: colId ?? '',
    background: isHeader ? EAdvTblBackground.HEADER : undefined,
    border: BORDER_FULL,
    componentProps: {
      id: workAttr.attrId,
      value: isHeader ? workAttr.attrName : value,
      extData,
      props: {
        isNonSelectable: true,
        fontSize: EAuxSize.M,
        isEditable: isHeader ? false : isEditable,
        isBold: isHeader ? true : !isLastLevel,
        alignH: EAuxAlignH.L,
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
