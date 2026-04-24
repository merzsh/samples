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

import * as s from './AuxViews.modules.scss';
import React, {PropsWithChildren, useEffect, useRef, useState} from "react";
import clsx from 'clsx';
import {AuxOnColumnResize, AuxViewsProps} from "../types";
import {onResize} from "../utils";
import {NUM_VIEW_SEPARATOR_WIDTH} from "../constants";

const AuxViews: React.FC<PropsWithChildren<AuxViewsProps>> = ({children, className,
                                                                resizerScreenAdjustmentInPx}) => {

  const [childrenArr, setChildrenArr] = useState(React.Children.toArray(children));
  const resizeHandlersRef = useRef(new Map<string, AuxOnColumnResize>());

  useEffect(() => {
    setChildrenArr(React.Children.toArray(children));
  }, [children]);

  return (
    <div className={clsx(className, s['aux-views'])}>
      {childrenArr.map((child, index) => {
        if (index === childrenArr.length-1) return child;

        const id1 = `splitter-${index}`;
        const id2 = 'container-' + id1;

        let resizeHandler;
        if (!(resizeHandler = resizeHandlersRef.current.get(id1))) {
          resizeHandler = onResize(id1, (target) =>
            target?.parentElement?.firstElementChild?.firstElementChild?.getBoundingClientRect().width ?? 1024,
            resizerScreenAdjustmentInPx);
          resizeHandlersRef.current.set(id1, resizeHandler);
        }

        return (
          <div id={id2} key={id2} className={s['aux-views-container']}>
            {child}
            {index === childrenArr.length - 1
              ? undefined
              : (<div id={id1} key={id1} style={{ width: NUM_VIEW_SEPARATOR_WIDTH - 1}}
                      className={s['aux-views-container__splitter']}
                      onMouseDown={resizeHandler}/>)
            }
          </div>
        );
      })}
    </div>
  );
};

export default AuxViews;
