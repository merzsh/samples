/**
 * TrialPack is web application contains several basic samples to ease web development experience.
 * Copyright (c) 2024-2025 Andrew Miroshnichenko <merzsh@gmail.com, https://github.com/merzsh>
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

import React, {Reducer, useReducer, useRef } from 'react';

enum StateNames { INIT, RED, RED_YELLOW, GREEN, GREEN_BLINKING, YELLOW }

type Action = {
  type: StateNames
}

type State = {
  currState: StateNames,
  lightRed: boolean,
  lightYellow: boolean,
  lightGreen: boolean,
  lightGreenIsBlinking: boolean,
}

type StateValue = {
  isLightRed: boolean,
  isLightYellow: boolean,
  isLightGreen: boolean,
  countdownMs: number,
  stateName: StateNames
}

type UseStoplightResult = {
  init: () => void,
  reset: (propsInitial: typeof initSettings) => void,
  next: () => void,
  run: () => void,
  nextTact: (idleRatioMs: number, idleRatioGreenMs: number) => void,
  registerStateHandler: (onStateChange: (state: StateValue) => void) => void,
  setProps: (settings: typeof initSettings) => void,
  timestamp: string,
}

const Controls = { FULL_CYCLE_TIME_SEC: 'fullCycleTimeSec', LIGHT_PERCENT_RED: 'lightPercentRed',
  LIGHT_PERCENT_RED_YELLOW: 'lightPercentRedYellow', LIGHT_PERCENT_GREEN: 'lightPercentGreen',
  LIGHT_PERCENT_GREEN_BLINKING: 'lightPercentGreenBlinking', LIGHT_PERCENT_YELLOW: 'lightPercentYellow'
};

const initSettings = {
  [Controls.FULL_CYCLE_TIME_SEC]: 15,
  [Controls.LIGHT_PERCENT_RED]: 39,
  [Controls.LIGHT_PERCENT_RED_YELLOW]: 11,
  [Controls.LIGHT_PERCENT_GREEN]: 21,
  [Controls.LIGHT_PERCENT_GREEN_BLINKING]: 17,
  [Controls.LIGHT_PERCENT_YELLOW]: 11,
}

/**
 * Custom React hook represents finite state machine core based on stoplight (traffic lights) example.
 *
 * @licence - GPLv3
 * @author - authored by Andrey Miroshnichenko <merzsh@gmail.com, https://github.com/merzsh>
 */
function useStoplight(): UseStoplightResult {

  const initStoreObject = {
    currState: StateNames.INIT,
    lightRed: false,
    lightYellow: false,
    lightGreen: false,
    lightGreenIsBlinking: false,
  };

  const [store, dispatch] =
    useReducer<Reducer<State, Action>>(reducer, {...initStoreObject}, undefined);
  const props = useRef<typeof initSettings>(initSettings);
  const stateHandlers = useRef<((state: StateValue) => void)[]>([]);
  const counter = useRef(0);
  const countdownMs = useRef(0);
  const passedMs = useRef(0);
  const passedMsGreenBlink = useRef(0);
  const currState = useRef<StateNames>(StateNames.INIT);
  const opacityGreenRef = useRef<boolean | undefined>(undefined);
  const stateValue =
    useRef<StateValue>({isLightRed: false, isLightYellow: false,
      isLightGreen: false, countdownMs: 0, stateName: StateNames.INIT});

  // exported hook result
  const result = useRef<UseStoplightResult>({
    init: init,
    reset: reset,
    next: next,
    run: run,
    nextTact: nextTact,
    registerStateHandler: registerStateHandler,
    setProps: setProps,
    timestamp: Math.round(Math.random()*100).toString(),
  });

  // constructor
  React.useEffect(() => {
    // initializer
    init();
  },[]);

  // reacts after each state was changed
  React.useEffect(() => {
    currState.current = store.currState;
    opacityGreenRef.current = store.lightGreenIsBlinking ? true : undefined;

    stateValue.current.isLightRed = store.lightRed;
    stateValue.current.isLightYellow = store.lightYellow;
    stateValue.current.isLightGreen = store.lightGreen;
    stateValue.current.stateName = store.currState;

    if (store.currState === StateNames.INIT) countdownMs.current = 0;
    stateValue.current.countdownMs = countdownMs.current;

    stateHandlers.current.forEach((item) => {
      item({ ...stateValue.current });
    });
  }, [store]);

  /**
   * Finite state machine (stoplight) switch function checks requested input.
   *
   * @param state - current state of stoplight
   * @param action - requested next action (state)
   */
  function reducer(state: State, action: Action) {
    const STR_UNACCEPTABLE_STATE = 'Unacceptable state requested: ';

    switch (action.type) {
      case StateNames.INIT:
        return {...initStoreObject};
      case StateNames.RED:
        if (state.currState === StateNames.INIT) {
          return {...initStoreObject, lightRed: true, currState: StateNames.RED};
        }
        break;
      case StateNames.RED_YELLOW:
        if (state.currState === StateNames.RED) {
          return {...initStoreObject, lightRed: true, lightYellow: true, currState: StateNames.RED_YELLOW};
        }
        break;
      case StateNames.GREEN:
        if (state.currState === StateNames.RED_YELLOW) {
          return {...initStoreObject, lightGreen: true, currState: StateNames.GREEN};
        }
        break;
      case StateNames.GREEN_BLINKING:
        if (state.currState === StateNames.GREEN) {
          return {
            ...initStoreObject,
            lightGreen: true,
            lightGreenIsBlinking: true,
            currState: StateNames.GREEN_BLINKING
          };
        }
        break;
      case StateNames.YELLOW:
        if (state.currState === StateNames.GREEN_BLINKING) {
          return {...initStoreObject, lightYellow: true, lightGreenIsBlinking: false, currState: StateNames.YELLOW};
        }
        break;
      default:
        throw new Error(`Internal error: undefined state '${action.type}'!`);
    }

    throw new Error(STR_UNACCEPTABLE_STATE + action.type + '; current state is: ' + state.currState);
  }

  function registerStateHandler(onStateChange: (state: StateValue) => void) {
    if (!onStateChange) {
      return;
    }

    if (!stateHandlers.current.find((item) => item.toString() === onStateChange.toString())) {
      stateHandlers.current.push(onStateChange);
    }
  }

  /**
   * Gets stoplight current state due time flow period.
   *
   * @param maxTimeMs - total lifecycle length, in milliseconds
   * @param currTimeMs - current time passed from last zero, in milliseconds
   * @param idleRatioMs - milliseconds count between two tact (tics)
   * @return - current state from StateNames enum or 'StateNames.INIT' if current  state time was passed
   */
  function getStateByTimeInMs(maxTimeMs: number, currTimeMs: number, idleRatioMs: number) {
    if (!maxTimeMs || isNaN(maxTimeMs)) throw new Error('Arg maxTimeMs is not a number!');
    if (!currTimeMs || isNaN(currTimeMs)) throw new Error('Arg currTimeMs is not a number!');

    const percent = Math.round((currTimeMs / maxTimeMs) * 100);

    switch (currState.current) {
      case StateNames.INIT:
        break;
      case StateNames.RED:
        if(currTimeMs === idleRatioMs) {
          countdownMs.current = (props.current[Controls.LIGHT_PERCENT_RED] / 100) * maxTimeMs;
        }
        if (percent <= props.current[Controls.LIGHT_PERCENT_RED]) {
          countdownMs.current -= idleRatioMs;
          return StateNames.RED;
        }
        countdownMs.current = 0;
        break;
      case StateNames.RED_YELLOW:
        if (percent <= props.current[Controls.LIGHT_PERCENT_RED_YELLOW]) return StateNames.RED_YELLOW;
        break;
      case StateNames.GREEN:
        if(currTimeMs === idleRatioMs) countdownMs.current = (props.current[Controls.LIGHT_PERCENT_GREEN]/100 +
          props.current[Controls.LIGHT_PERCENT_GREEN_BLINKING]/100)*maxTimeMs;
        if (percent <= props.current[Controls.LIGHT_PERCENT_GREEN]) {
          countdownMs.current -= idleRatioMs;
          return StateNames.GREEN;
        }
        break;
      case StateNames.GREEN_BLINKING:
        if (percent <= props.current[Controls.LIGHT_PERCENT_GREEN_BLINKING]) {
          countdownMs.current -= idleRatioMs;
          return StateNames.GREEN_BLINKING;
        }
        countdownMs.current = 0;
        break;
      case StateNames.YELLOW:
        if (percent <= props.current[Controls.LIGHT_PERCENT_YELLOW]) return StateNames.YELLOW;
        break;
      default:
        throw new Error(`Internal error: unknown state ${currState.current}`);
    }

    return StateNames.INIT;
  }

  /**
   * Gets next logical state of stoplight from StateNames enum.
   *
   * @return - StateNames enum item (next state; if current last first state 'INIT' will be return)
   */
  function getNextState(): StateNames {
    type StateNamesKeys = keyof typeof StateNames;

    const len: number = Object.keys(StateNames).length;
    for(let i= 0; i<len; i++){
      if(StateNames[Object.keys(StateNames)[i] as StateNamesKeys] === currState.current){
        if(i === len-1) return StateNames.INIT;
        else return StateNames[Object.keys(StateNames)[i+1] as StateNamesKeys]
      }
    }

    throw new Error ('Internal error: unreachable state!');
  }

  /**
   * Resets all time counters.
   */
  function resetCounters() {
    counter.current = 0;
    passedMs.current = 0;
    passedMsGreenBlink.current = 0;
  }

  /**
   * Set properties
   *
   * @param settings - user custom settings to override initial settings
   */
  function setProps(settings: typeof initSettings) {
    if (settings) {
      props.current = settings;
    }
  }

  /**
   * Guides stoplight machine to its initial state.
   */
  function init() {
    resetCounters();
    dispatch({type: StateNames.INIT});
  }

  /**
   * Resets settings (machine lifecycle options) to initial values.
   * @param propsInitial - initial values
   */
  function reset(propsInitial: typeof initSettings) {
    if(!propsInitial) throw new ReferenceError('Internal error: argument propsInitial is null!');

    props.current[Controls.FULL_CYCLE_TIME_SEC] = propsInitial[Controls.FULL_CYCLE_TIME_SEC];
    props.current[Controls.LIGHT_PERCENT_RED] = propsInitial[Controls.LIGHT_PERCENT_RED];
    props.current[Controls.LIGHT_PERCENT_RED_YELLOW] = propsInitial[Controls.LIGHT_PERCENT_RED_YELLOW];
    props.current[Controls.LIGHT_PERCENT_GREEN] = propsInitial[Controls.LIGHT_PERCENT_GREEN];
    props.current[Controls.LIGHT_PERCENT_GREEN_BLINKING] = propsInitial[Controls.LIGHT_PERCENT_GREEN_BLINKING];
    props.current[Controls.LIGHT_PERCENT_YELLOW] = propsInitial[Controls.LIGHT_PERCENT_YELLOW];
  }

  /**
   * Go to stoplight next state.
   */
  function next() {
    dispatch({type: getNextState()});
  }

  /**
   * Runs stoplight
   */
  function run() {
    init();
  }

  /**
   * Handler of next machine tact. It determines to change the current state or not.
   *
   * @param idleRatioMs - milliseconds count between two tact (tics)
   * @param idleRatioGreenMs - milliseconds count between two tics of blinking green light
   */
  function nextTact(idleRatioMs: number, idleRatioGreenMs: number) {
    const strArgIdleRatioMs = 'idleRatioMs', strArgIdleRatioGreenMs = 'idleRatioGreenMs';
    let strError = `Error: function 'onNextTact' argument ${strArgIdleRatioMs} is not a number or less than 10ms (value: ${idleRatioMs})!`;
    if (!idleRatioMs || isNaN(idleRatioMs) || idleRatioMs < 10) throw new RangeError(strError);
    strError = `Error: function 'onNextTact' argument ${strArgIdleRatioGreenMs} is not a number or less than 10ms (value: ${idleRatioGreenMs})!`;
    if (!idleRatioGreenMs || isNaN(idleRatioGreenMs) || idleRatioGreenMs < 10) throw new RangeError(strError);

    passedMs.current += idleRatioMs;
    counter.current++;
    const st = getStateByTimeInMs(props.current[Controls.FULL_CYCLE_TIME_SEC] * 1000,
      passedMs.current, idleRatioMs);

    if (st === StateNames.INIT) {
      next();
      resetCounters();
    }

    stateValue.current.countdownMs = countdownMs.current;

    // if 'blinking' state was set
    if(opacityGreenRef.current !== undefined && (passedMs.current - passedMsGreenBlink.current) > idleRatioGreenMs) {
      opacityGreenRef.current = !opacityGreenRef.current;
      stateValue.current.isLightGreen = opacityGreenRef.current;
      passedMsGreenBlink.current = passedMs.current;
    }

    stateHandlers.current.forEach((item) => {
      item({ ...stateValue.current });
    });
  }

  return result.current;
}

export { useStoplight, UseStoplightResult, StateNames, StateValue };
