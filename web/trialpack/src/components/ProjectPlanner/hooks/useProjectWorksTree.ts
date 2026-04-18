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
  ApiProject, ApiProjectWork, EProjAttrs,
  EProjWorkNodeProps,
  ProjectWorkNode,
  UseProjectWorksTree,
} from "../types";
import {useCallback, useEffect, useRef, useState} from "react";
import {calcLenDates4SumNode, calcWorkNodeDates, getParentWbs} from "../utils";
import {STR_INIT} from "../../AuxCommon/constants";
import {findTreeNode} from "../../../utils/utils";
import {ROOT_WBS_CODE} from "../constants";

export const useProjectWorksTree = (project: ApiProject): UseProjectWorksTree => {
  const [refreshCalcTrigger, setRefreshCalcTrigger] = useState<any>();
  const [rootWorkNode, setRootWorkNode] = useState<ProjectWorkNode>();
  const [worksTreeMap, setWorksTreeMap] = useState<Map<string, ProjectWorkNode>>();
  const worksTreeMapRef = useRef<Map<string, ProjectWorkNode>>();

  useEffect(() => {
    if (!project.projectWorksList.find(work => work.wbs_code === ROOT_WBS_CODE)) return;

    const workTreeInt = new Map<string, ProjectWorkNode>(
      project.projectWorksList.map(work => [work.wbs_code.toString(), {
        ...work,
        children: [],
        predecessors: [],
        followers: [],
      }])
    );

    // build tree
    [...workTreeInt.values()]
      .filter(node => node.wbs_code  !== STR_INIT)
      .forEach(node => {
        const parentNode = workTreeInt.get(getParentWbs(node.wbs_code.toString()));
        if (parentNode) {
          parentNode.children.push(node);
          node.parent = parentNode;
        }

        if (node.prev_works && Array.isArray(node.prev_works) && node.prev_works.length) {
          node.prev_works.forEach(prevId => {
            const prevNode = workTreeInt.get(prevId);
            if (prevNode) {
              prevNode.followers.push(node);
              node.predecessors.push(prevNode);
            }
          });
        }
      });

    worksTreeMapRef.current = workTreeInt;
    setRefreshCalcTrigger({ });
  }, [project]);

  useEffect(() => {
    if (refreshCalcTrigger === undefined || !worksTreeMapRef.current) return;

    const projStartDate = new Date(project.projectStartDate);

    // calc non-summary works dates
    [...worksTreeMapRef.current.values()]
      .filter(edgeNode => !edgeNode.children.length && !edgeNode.followers.length)
      .forEach(edgeNode => {
        findTreeNode(edgeNode, {}, EProjWorkNodeProps.PREDECESSORS, (node) => {
          const [startDate, finishDate] = calcWorkNodeDates(node, projStartDate);
          if (startDate) node.start_date = startDate;
          if (finishDate) node.finish_date = finishDate;
        });
      });

    // calc lengths and dates for summary tasks
    [...worksTreeMapRef.current.values()]
      .filter(node => node.children.length)
      .sort((a,b) =>
        a.wbs_code < b.wbs_code ? 1 : a.wbs_code > b.wbs_code ? -1 : 0)
      .forEach(node => {
        if (!worksTreeMapRef.current) return;

        calcLenDates4SumNode(node, worksTreeMapRef.current, (node, milestone) => {
          let minDate = new Date(projStartDate), maxDate = new Date(0);
          minDate.setFullYear(projStartDate.getFullYear() + 25);

          findTreeNode(milestone, {}, EProjWorkNodeProps.PREDECESSORS, (node) => {
            if (node.start_date instanceof Date && node.start_date.getTime() < minDate.getTime()) {
              minDate = node.start_date;
            }
            if (node.finish_date instanceof Date && node.finish_date.getTime() > maxDate.getTime()) {
              maxDate = node.finish_date;
            }
          });

          node.start_date = minDate;
          node.finish_date = maxDate;

          const deltaMs = Math.abs(maxDate.getTime() - minDate.getTime());
          node.length = Math.floor(deltaMs / (1000 * 60 * 60 * 24)) + 1;
        });
      });

    const rootNode = worksTreeMapRef.current.get(ROOT_WBS_CODE);
    setRootWorkNode(rootNode ? { ...rootNode } : undefined);
    setWorksTreeMap(new Map<string, ProjectWorkNode>(worksTreeMapRef.current));
  }, [refreshCalcTrigger]);

  const setWorkAttrValue = useCallback((nodeId: string, attribs: Partial<ApiProjectWork>)=> {
    if (!worksTreeMapRef.current) return;
    else if (attribs.length && typeof attribs.length !== 'number' || attribs.length && typeof attribs.length === 'number' && attribs.length < 0) return;

    let node = worksTreeMapRef.current.get(nodeId);
    if (node) {
      if (node.children.length) return;
    } else {
      node = {
        wbs_code: STR_INIT,
        work_name: STR_INIT,
        children: [],
        predecessors: [],
        followers: [],
      }
      worksTreeMapRef.current.set(nodeId, node);
    }

    Object.keys(attribs).forEach(key => {
      if (!worksTreeMapRef.current) return;

      const attribKey = key as keyof ApiProjectWork;
      const attribVal = attribs[attribKey];
      if (!attribVal) return;

      if (attribKey === EProjAttrs.WBS) {
        const newId = attribs[attribKey];
        if (!newId) return;

        const newParentId = getParentWbs(newId.toString());
        const newParent = worksTreeMapRef.current.get(newParentId);

        if (newParent) {
          if (node.parent) {
            node.parent.children = node.parent.children.filter(child => child.wbs_code !== node.wbs_code);
          }

          newParent.children.push(node);
          node.parent = newParent;

          node.followers.forEach(follower => {
            if (Array.isArray(follower.prev_works)) {
              follower.prev_works = follower.prev_works.filter(prev => prev !== nodeId);
              follower.prev_works.push(newId.toString());
            }
          });
        }

        worksTreeMapRef.current.delete(nodeId);
        worksTreeMapRef.current.set(newId.toString(), node);

      } else if (attribKey === EProjAttrs.PREV && Array.isArray(attribVal)) {
        node.predecessors.forEach(predecessor => {
          predecessor.followers = predecessor.followers.filter(follower => follower.wbs_code !== node.wbs_code);
        });
        node.predecessors = [];

        attribVal.forEach(newPredId => {
          if (!worksTreeMapRef.current) return;

          const newPred = worksTreeMapRef.current.get(newPredId);
          if (newPred) {
            node.predecessors.push(newPred);
            newPred.followers.push(node);
          }
        });
      }

      node[attribKey] = attribVal;
    });

    setRefreshCalcTrigger({ });
  }, []);

  if (!rootWorkNode) return { setWorkAttrValue };

  return {
    rootWorkNode,
    worksTreeMap,
    setWorkAttrValue,
  };
};
