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
  ApiProjectAttribNodeSpecIds,
  ApiProjectWork,
  ProjectWorkNode, ProjectWorkNodeProps,
  UseProjectWorksTree,
} from "../types";
import {useEffect, useState} from "react";
import {addTreeNode} from "../../../utils/utils";
import {getParentWbs} from "../utils";

export const useProjectWorksTree = (rootWork: ApiProjectWork, rootWorkChildren: ApiProjectWork[],
                                    parentWorkAttr: ApiProjectAttribNodeSpecIds,
                                    childrenProp: keyof ProjectWorkNodeProps): UseProjectWorksTree => {

  const [rootWorkNode, setRootWorkNode] = useState<ProjectWorkNode>();

  useEffect(() => {
    if (!rootWork) return;

    const root: ProjectWorkNode = {
      ...rootWork,
      children: [],
    };

    rootWorkChildren.forEach(work => {
      const newNode: ProjectWorkNode = {
        ...work,
        children: [],
      }

      addTreeNode<ProjectWorkNode>(root, newNode, {
        [parentWorkAttr]: getParentWbs(newNode[parentWorkAttr].toString())
      }, childrenProp);
    });

    setRootWorkNode(root);
  }, [rootWork]);

  if (!rootWorkNode) return { };

  return {
    rootWorkNode,
  };
};
