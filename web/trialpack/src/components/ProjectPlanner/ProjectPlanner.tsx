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
import React, {useState} from 'react';
import AuxViews from "../AuxCommon/AuxViews";
import WorksTree from "./WorksTree";
import {GANT_CHART_ID, TREE_VIEW_ID} from "./constants";
import {castApiRawResponse} from "./utils";
import {projectSampleDataApiRawResponse} from "./fixtures";
import {useProjectWorksTree} from "./hooks/useProjectWorksTree";
import GantChart from "./GantChart";

type ProjectPlannerProps = {
  title?: string;
};

export const ProjectPlanner: React.FC<ProjectPlannerProps> = ({}) => {
  const [projectApi, setProjectApi] = useState(castApiRawResponse(projectSampleDataApiRawResponse));

  const { rootWorkNode, setWorkAttrValue } = useProjectWorksTree(projectApi);

  if (!rootWorkNode) return undefined;

  return (
    <AuxViews className={`${s['proj-plan']}`} resizerScreenAdjustmentInPx={250}>
      <WorksTree id={TREE_VIEW_ID} className={s['proj-plan__table']}
                 projectApi={projectApi} rootWorkNode={rootWorkNode}
                 onRebuildWorksTree={() => setProjectApi({ ...projectApi })}
                 onChangeWorkAttrValue={(workId, attribs) => setWorkAttrValue(workId, attribs)} />

      <GantChart id={GANT_CHART_ID} className={s['proj-plan__table']}
                 projectApi={projectApi} rootWorkNode={rootWorkNode}
                 onRebuildWorksTree={() => setProjectApi({ ...projectApi })}
                 onChangeWorkAttrValue={(workId, attribs) => setWorkAttrValue(workId, attribs)} />
    </AuxViews>
  );
};

export default ProjectPlanner;
