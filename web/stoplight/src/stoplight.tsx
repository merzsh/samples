/**
 * This file is completely authored by Andrey Miroshnichenko at 2024-01-05 and distributed under GPL-2.0 license
 * (merzsh@gmail.com, https://github.com/merzsh).
 */

import React, {Reducer, useReducer, useRef, useState} from 'react';
require('./stoplight.jpg');
require('./stoplight.css');

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

type StoplightResult = {
  init: () => void,
  reset: (propsInitial: typeof initSettings) => void,
  next: () => void,
  run: () => void,
  nextTact: (idleRatioMs: number, idleRatioGreenMs: number) => void,
  onStateChange: (stateValue: StateValue) => void
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

const STR_OPACITY_OFF = '0.3';
const STR_OPACITY_ON = '0.8';

/**
 * Custom React hook represents finite state machine core based on stoplight (traffic lights) example.
 *
 * @param props - finite state machine settings
 *
 * @licence - GPL-2.0
 * @author - authored by Andrey Miroshnichenko (merzsh@gmail.com, https://github.com/merzsh)
 */
function useStoplight(props = initSettings): StoplightResult {
  const strError = `Error: hook 'useStoplight' constructor argument 'props' is null or undefined!`;
  if (!props) throw new ReferenceError(strError);

  const initStoreObject = {
    currState: StateNames.INIT,
    lightRed: false,
    lightYellow: false,
    lightGreen: false,
    lightGreenIsBlinking: false,
  };

  const [store, dispatch] =
    useReducer<Reducer<State, Action>>(reducer, {...initStoreObject}, undefined);
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
  const result: StoplightResult = {
    init: init,
    reset: reset,
    next: next,
    run: run,
    nextTact: nextTact,
    onStateChange: (stateValue: StateValue) => { if(!stateValue) return; }
  }

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
    stateValue.current.countdownMs = countdownMs.current;
    stateValue.current.stateName = store.currState;

    result.onStateChange({...stateValue.current});
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
          countdownMs.current = (props[Controls.LIGHT_PERCENT_RED] / 100) * maxTimeMs;
        }
        if (percent <= props[Controls.LIGHT_PERCENT_RED]) {
          countdownMs.current -= idleRatioMs;
          return StateNames.RED;
        }
        countdownMs.current = 0;
        break;
      case StateNames.RED_YELLOW:
        if (percent <= props[Controls.LIGHT_PERCENT_RED_YELLOW]) return StateNames.RED_YELLOW;
        break;
      case StateNames.GREEN:
        if(currTimeMs === idleRatioMs) countdownMs.current = (props[Controls.LIGHT_PERCENT_GREEN]/100 +
          props[Controls.LIGHT_PERCENT_GREEN_BLINKING]/100)*maxTimeMs;
        if (percent <= props[Controls.LIGHT_PERCENT_GREEN]) {
          countdownMs.current -= idleRatioMs;
          return StateNames.GREEN;
        }
        break;
      case StateNames.GREEN_BLINKING:
        if (percent <= props[Controls.LIGHT_PERCENT_GREEN_BLINKING]) {
          countdownMs.current -= idleRatioMs;
          return StateNames.GREEN_BLINKING;
        }
        countdownMs.current = 0;
        break;
      case StateNames.YELLOW:
        if (percent <= props[Controls.LIGHT_PERCENT_YELLOW]) return StateNames.YELLOW;
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

    props[Controls.FULL_CYCLE_TIME_SEC] = propsInitial[Controls.FULL_CYCLE_TIME_SEC];
    props[Controls.LIGHT_PERCENT_RED] = propsInitial[Controls.LIGHT_PERCENT_RED];
    props[Controls.LIGHT_PERCENT_RED_YELLOW] = propsInitial[Controls.LIGHT_PERCENT_RED_YELLOW];
    props[Controls.LIGHT_PERCENT_GREEN] = propsInitial[Controls.LIGHT_PERCENT_GREEN];
    props[Controls.LIGHT_PERCENT_GREEN_BLINKING] = propsInitial[Controls.LIGHT_PERCENT_GREEN_BLINKING];
    props[Controls.LIGHT_PERCENT_YELLOW] = propsInitial[Controls.LIGHT_PERCENT_YELLOW];
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
    const st = getStateByTimeInMs(props[Controls.FULL_CYCLE_TIME_SEC] * 1000,
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

    result.onStateChange({...stateValue.current});
  }

  return result;
}

/**
 * React GUI client calls custom hook represents stoplight finite state machine.

 * @licence - GPL-2.0
 * @author - authored by Andrey Miroshnichenko (merzsh@gmail.com, https://github.com/merzsh)
 */
function Stoplight() {

  const [settings, setSettings] = useState(initSettings);
  const stoplightController = useStoplight(settings);
  if(!stoplightController) throw new ReferenceError('Error: stoplightController is null!');
  stoplightController.onStateChange = onStateChange;

  const [isSettingsDisabled, setIsSettingsDisabled] = useState(false);
  const [message, setMessage] = useState('');
  const [opacityRed, setOpacityRed] = useState(STR_OPACITY_OFF);
  const [opacityYellow, setOpacityYellow] = useState(STR_OPACITY_OFF);
  const [opacityGreen, setOpacityGreen] = useState(STR_OPACITY_OFF);
  const [countdownStr, setCountdownStr] = useState('');
  const [stateName, setStateName] =
    useState<StateNames>(StateNames.INIT);

  // Hook useRef not causes re-render of referred component but useState does.
  // With useRef u can refer to HTML component by ref="refVariable" attribute.
  const INT_TIMER_INCREMENT_MS = 100;
  const INT_TIMER_DELAY_GREEN_BLINK_MS = 200;
  const timerInitial = setInterval(onTimer, 10000000);
  const timer = useRef(timerInitial);

  // cals when UI blocked/unblocked (run/stop commands)
  React.useEffect(() => {
    clearInterval(timer.current);
    if(isSettingsDisabled) {
      timer.current = setInterval(onTimer, INT_TIMER_INCREMENT_MS);
    }
  }, [isSettingsDisabled]);

  /**
   * 'Initialize state' button handler. Guides stoplight to its initial state.
   */
  function onClickInit() {
    if(stoplightController) stoplightController.init();
  }

  /**
   * 'Reset settings' button handler. Resets stoplight all lifecycle options to its initial values.
   */
  function onClickReset() {
    if(stoplightController) {
      stoplightController.reset(initSettings);
      setSettings(initSettings);
    }
  }

  /**
   * 'Go to next state' button handler. Guides stoplight to its next state.
   */
  function onClickNext() {
    if(stoplightController) stoplightController.next();
  }

  /**
   * 'Run' button handler. Runs stoplight work.
   */
  function onClickRun() {
    if(stoplightController) {
      setIsSettingsDisabled(true);
      stoplightController.run();
    }
  }

  /**
   * 'Stop' button handler. Finishes stoplight work.
   */
  function onClickStop() {
    setIsSettingsDisabled(false);
    if(stoplightController) {
      stoplightController.init();
    }
  }

  /**
   * Handler of timer tics (tact).
   */
  function onTimer() {
    stoplightController.nextTact(INT_TIMER_INCREMENT_MS, INT_TIMER_DELAY_GREEN_BLINK_MS);
  }

  /**
   * Finite state machine (stoplight) changing each state event handler.
   * It helps to detect moment when UI have to be refreshed.
   *
   * @param stateValue - payload value of each state
   */
  function onStateChange(stateValue: StateValue) {
    if(!stateValue) throw new ReferenceError('Error: state value is initial!');

    setOpacityRed(stateValue.isLightRed ? STR_OPACITY_ON : STR_OPACITY_OFF);
    setOpacityYellow(stateValue.isLightYellow ? STR_OPACITY_ON : STR_OPACITY_OFF);
    setOpacityGreen(stateValue.isLightGreen ? STR_OPACITY_ON : STR_OPACITY_OFF);

    const countdownSec = Math.round(stateValue.countdownMs / 1000);
    const countdownSecStr = countdownSec < 10 ? '0' + countdownSec : countdownSec.toString();

    setCountdownStr(stateValue.countdownMs >= 1000 ? countdownSecStr :
      stateValue.countdownMs > 0 && stateValue.countdownMs < 1000 ? '--' : '');

    setStateName(stateValue.stateName);
  }

  /**
   * Validates user input.
   *
   * @param value - input value
   */
  function onChangeEditBoxValue(value: any) {
    setMessage('');
    switch(value.target.name){
      case Controls.FULL_CYCLE_TIME_SEC:
        if(value.target.valueAsNumber <= 0 || value.target.valueAsNumber > 3600)
          setMessage('Error, set full cycle time within range [1-3600] in seconds!');
        setSettings({...settings, [Controls.FULL_CYCLE_TIME_SEC]: value.target.valueAsNumber});
        break;
      case Controls.LIGHT_PERCENT_RED:
      case Controls.LIGHT_PERCENT_RED_YELLOW:
      case Controls.LIGHT_PERCENT_GREEN:
      case Controls.LIGHT_PERCENT_GREEN_BLINKING:
      case Controls.LIGHT_PERCENT_YELLOW:
        if(value.target.valueAsNumber < 0 || value.target.valueAsNumber > 100)
          setMessage('Error, set part of full cycle time [0-100] in %!');
        setSettings({...settings, [value.target.name]: value.target.valueAsNumber});
        break;
      default:
        throw new Error(`Dev error: there is no edit control with name '${value.target.name}'!`);
    }
  }

  // React TSX-HTML component view of UI
  return <div id={'st-root'} className={'st-root'}>
      <header>
        <h3>Stoplight lifecycle with simple finite state machine implemented under</h3>
      </header>
      <main>
        <aside className={'st-sidebar-left'}>
        </aside>
        <aside className={'st-sidebar-right'}>
        </aside>
        <div className={'st-whitespace'}></div>
        <div className={'st-image'}>
          <div className={'st-image-red'} style={{opacity: opacityRed}}></div>
          <div className={'st-image-yellow'} style={{opacity: opacityYellow,
            color: opacityRed === STR_OPACITY_OFF ? 'green' : 'red'}}>
            {countdownStr}
          </div>
          <div className={'st-image-green'} style={{opacity: opacityGreen}}></div>
          <img src={'./img/stoplight.jpg'} alt={'Image was here and fly away :)'} />
        </div>
        <div className={'st-whitespace'}></div>
        <div className={'st-toolbar'}>
          <fieldset className={'st-toolbar-diagram'}>
            <legend>State diagram</legend>
            <table>
              <tbody><tr style={stateName === StateNames.INIT ? {background: "wheat"} : {}} >
                <td className={'td-ptr'}>{stateName === StateNames.INIT ? '>' : ''}</td>
                <td className={'td-pic'}><div id={'INIT'}></div></td>
                <td className={'td-state'}>INIT</td>
              </tr><tr style={stateName === StateNames.RED ? {background: "wheat"} : {}} >
                <td className={'td-ptr'}>{stateName === StateNames.RED ? '>' : ''}</td>
                <td className={'td-pic'}><div id={'RED'}></div></td>
                <td className={'td-state'}>RED</td>
              </tr><tr style={stateName === StateNames.RED_YELLOW ? {background: "wheat"} : {}} >
                <td className={'td-ptr'}>{stateName === StateNames.RED_YELLOW ? '>' : ''}</td>
                <td className={'td-pic'}><div id={'RED_YELLOW'}></div></td>
                <td className={'td-state'}>RED_YELLOW</td>
              </tr><tr style={stateName === StateNames.GREEN ? {background: "wheat"} : {}} >
                <td className={'td-ptr'}>{stateName === StateNames.GREEN ? '>' : ''}</td>
                <td className={'td-pic'}><div id={'GREEN'}></div></td>
                <td className={'td-state'}>GREEN</td>
              </tr><tr style={stateName === StateNames.GREEN_BLINKING ? {background: "wheat"} : {}} >
                <td className={'td-ptr'}>{stateName === StateNames.GREEN_BLINKING ? '>' : ''}</td>
                <td className={'td-pic'}><div id={'GREEN_BLINKING'}></div></td>
                <td className={'td-state'}>GREEN_BLINKING</td>
              </tr><tr style={stateName === StateNames.YELLOW ? {background: "wheat"} : {}} >
                <td className={'td-ptr'}>{stateName === StateNames.YELLOW ? '>' : ''}</td>
                <td className={'td-pic'}><div id={'YELLOW'}></div></td>
                <td className={'td-state'}>YELLOW</td>
              </tr></tbody>
              <tfoot><tr>
                <th colSpan={3} style={{textAlign: "left"}}>Timer value: {countdownStr}</th>
              </tr></tfoot>
            </table>
          </fieldset>
          <fieldset className={'st-toolbar-control'}>
            <legend>Control bar</legend><br/>
            <button className={'st-toolbar-control-btn-init'} onClick={onClickInit} disabled={isSettingsDisabled}>
              Initialize state O
            </button>
            <button className={'st-toolbar-control-btn-reset'} onClick={onClickReset} disabled={isSettingsDisabled}>
              Reset settings X
            </button><br/>
            <button className={'st-toolbar-control-btn-next'} onClick={onClickNext} disabled={isSettingsDisabled}>
              Go to next state &gt;
            </button><br/>
            <button className={'st-toolbar-control-btn-start'} onClick={onClickRun} disabled={isSettingsDisabled}>
              Run &gt;|
            </button>
            <button className={'st-toolbar-control-btn-stop'} onClick={onClickStop} disabled={!isSettingsDisabled}>
              Stop []
            </button><br/>
            <div className={'st-toolbar-control-full-time'}>
              <label>Cycle full time, sec.
                <input type={'number'} name={Controls.FULL_CYCLE_TIME_SEC} value={settings[Controls.FULL_CYCLE_TIME_SEC]}
                       onChange={onChangeEditBoxValue} size={7} min={1} max={3600} step={1}></input>
              </label>
            </div>
            <div className={'st-toolbar-control-red-percent'}>
              <label>Red light, % of time
                <input type={'number'} name={Controls.LIGHT_PERCENT_RED} value={settings[Controls.LIGHT_PERCENT_RED]}
                       onChange={onChangeEditBoxValue} size={7} min={1} max={100} step={1}></input>
              </label>
            </div>
            <div className={'st-toolbar-control-red-yellow-percent'}>
              <label>Red & Yellow lights, % of time
                <input type={'number'} name={Controls.LIGHT_PERCENT_RED_YELLOW} value={settings[Controls.LIGHT_PERCENT_RED_YELLOW]}
                       onChange={onChangeEditBoxValue} size={7} min={1} max={100} step={1}></input>
              </label>
            </div>
            <div className={'st-toolbar-control-green-percent'}>
              <label>Green light, % of time
                <input type={'number'} name={Controls.LIGHT_PERCENT_GREEN} value={settings[Controls.LIGHT_PERCENT_GREEN]}
                       onChange={onChangeEditBoxValue} size={7} min={1} max={100} step={1}></input>
              </label>
            </div>
            <div className={'st-toolbar-control-green-blinking-percent'}>
              <label>Green light blinking, % of time
                <input type={'number'} name={Controls.LIGHT_PERCENT_GREEN_BLINKING} value={settings[Controls.LIGHT_PERCENT_GREEN_BLINKING]}
                       onChange={onChangeEditBoxValue} size={7} min={1} max={100} step={1}></input>
              </label>
            </div>
            <div className={'st-toolbar-control-yellow-percent'}>
              <label>Yellow light, % of time
                <input type={'number'} name={Controls.LIGHT_PERCENT_YELLOW} value={settings[Controls.LIGHT_PERCENT_YELLOW]}
                       onChange={onChangeEditBoxValue} size={7} min={1} max={100} step={1}></input>
              </label>
            </div>
          </fieldset>
          <textarea name="text" placeholder="Status bar ..." value={message}
                    rows={1} disabled  ></textarea>
        </div>
      </main>
      <footer>
        <div>
          <span>All rights reserved. Lorem ipsum dolor sit amet.</span>
          <nav>
            <ul className={'st-footer-links'}>
              <li><a href="">About us</a></li>
              <li><a href="">Contacts</a></li>
            </ul>
          </nav>
        </div>

      </footer>
  </div>;
}

export default Stoplight;