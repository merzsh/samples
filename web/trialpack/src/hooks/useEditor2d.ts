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

import { Map, Record } from 'immutable';
import * as React from 'react';
import { Reducer, useReducer, useRef } from 'react';
import {checkArgIsNotNull} from '../utils/utils';

/** Controller init props */
type UseEditor2dInitProps = {
  fileName: string;
};

/** Controller methods external accessed */
type UseEditor2dResult = {
  initiate: (props: UseEditor2dInitProps) => boolean;
  nextState: (props: UseEditor2dInitProps) => boolean;
  terminate: () => void;
  registerStateHandler: (onStateChange: (state: StateExt) => void) => void;
};

/** Available controller states */
enum States {
  INITIAL,
  FILE_EDIT,
  OPTIONS_EDIT,
  SOMETHING_ELSE,
  TERMINAL,
}

/** Controller states count */
const NUM_STABLE_STATES_COUNT = 4;

/** Internal controller state */
type StateInt = {
  // metadata
  currentState: States;
  previousState: States;
  errors: Map<string, Error[]>;

  // payload data
  data: UseEditor2dInitProps;
};

/** External controller state */
type StateExt = {
  // metadata
  currentState: States;
  previousState: States;
  errors: Map<string, Error[]>;

  // payload data
  data: StateExtData;
};

type StateExtData = {
  fileName: string;
};

/** Actions list to manage controller */
enum Actions {
  INITIATE,
  NEXT_STATE,
  TERMINATE,
}

/** Action payload data */
type ActionPayload = {
  data: UseEditor2dInitProps;
};

/** Action */
type Action = {
  type: Actions;
  payload: ActionPayload | null;
};

/** Controller component name */
const STR_COMPONENT_NAME = 'editor2d/hooks/useEditor2d';

function useEditor2d(): UseEditor2dResult {

  const initStoreObject: StateInt = {
    currentState: States.TERMINAL,
    previousState: States.TERMINAL,
    errors: Map<string, Error[]>(),
    data: { fileName: '' },
  }

  // Reducer state core
  const [store, dispatch] =
    useReducer<Reducer<StateInt, Action>>(reducer, { ...initStoreObject }, undefined);

  // transitioning states semaphore (monitor) to avoid next state running before previous completed
  const semaphore = useRef<boolean>(false);
  // external state master object
  const stateExt = useRef<StateExt>(cloneStateExt());
  // external state client handlers
  const stateHandlers = useRef<((state: StateExt) => void)[]>([]);

  // Controller exported result - client interface to manage
  const result: UseEditor2dResult = {
    initiate: initiate,
    nextState: nextState,
    terminate: terminate,
    registerStateHandler: registerStateHandler,
  };

  React.useEffect(() => {
    return () => {
      terminate();
    };
  }, []);

  // Controller state change handler
  React.useEffect(() => {
    onStoreChange(store).then().catch(error => {
      console.log(`Internal error: exception occurs due '${STR_COMPONENT_NAME}.onStoreChange(store)' ` +
        `function calling, while state is changing, with message: ${(error as Error).message} `, error);
    });
  }, [store]);

  /**
   * Actions sent from outside handler.
   *
   * @param state - controller current internal state
   * @param action - client requested action
   */
  function reducer(state: StateInt, action: Action): StateInt {

    switch (action.type) {
      case Actions.INITIATE:
        // initialization
        if (state.currentState === States.TERMINAL && action.payload?.data) {
          return {
            ...initStoreObject,
            currentState: States.INITIAL,
            previousState: States.INITIAL,
            data: action.payload.data,
          };
        }
        break;

      case Actions.NEXT_STATE:
        // next state (data loading)
        if (action.payload?.data) {
          if (state.currentState === States.INITIAL) {
            // request new state
            return { ...state, currentState: States.FILE_EDIT, previousState: state.currentState };
          } else if (state.currentState === States.FILE_EDIT) {
            if (state.errors.size) {
              // if waz errors - finalizing
              return { ...state, currentState: States.TERMINAL, previousState: States.FILE_EDIT };
            } else {
              // if no errors - go to next state
              return { ...state, currentState: States.OPTIONS_EDIT, previousState: state.currentState,
                data: { ...state.data, fileName: action.payload.data.fileName } };
            }
          } else if (state.currentState === States.OPTIONS_EDIT) {
            if (state.errors.size) {
              return { ...state, currentState: States.TERMINAL, previousState: States.OPTIONS_EDIT };
            } else {
              return { ...state, currentState: States.SOMETHING_ELSE, previousState: state.currentState,
                data: { ...state.data, fileName: action.payload.data.fileName } };
            }
          } else if (state.currentState === States.SOMETHING_ELSE) {
            // if request shutdown
            return { ...state, currentState: States.TERMINAL, previousState: state.currentState,
              data: { ...state.data } };
          }
        }
        break;

      case Actions.TERMINATE:
        // termination - manual shutdown of all processes and go to final state
        return { ...state, currentState: States.TERMINAL, previousState: state.currentState };

      default:
        throw new RangeError(
          `Internal error: undefined action '${action.type}' detected in ` + `${STR_COMPONENT_NAME}.reducer() method!`
        );
    }

    return state;
  }

  /**
   * Initializes controller
   *
   * @param props - init data
   * @return - true - successfully completes, false - not started cause previous request in progress
   */
  function initiate(props: UseEditor2dInitProps): boolean {
    if (semaphore.current) {
      return false;
    }

    checkAndInitiateProps('initiate', props);
    stateExt.current = cloneStateExt();
    dispatch({ type: Actions.INITIATE, payload: { data: props } });
    return true;
  }

  /**
   * Functional stub (go to next state)
   * @param props
   */
  function nextState(props: UseEditor2dInitProps): boolean {
    if (semaphore.current) {
      return false;
    }

    //checkAndInitiateProps('initiate', props);
    stateExt.current = cloneStateExt();
    dispatch({ type: Actions.NEXT_STATE, payload: { data: props } });
    return true;
  }

  /**
   * Forced controller shutdown (all running requests terminate), free resources
   */
  function terminate(): void {
    dispatch({ type: Actions.TERMINATE, payload: null });
  }

  /**
   * Registers external state handler from outside client
   * @param onStateChange
   */
  function registerStateHandler(onStateChange: (state: StateExt) => void) {
    if (!onStateChange) {
      return;
    }

    if (!stateHandlers.current.find((item) => item.toString() === onStateChange.toString())) {
      stateHandlers.current.push(onStateChange);
    }
  }

  /**
   * Controller state handler
   *
   * @param store - new controller state
   */
  async function onStoreChange(store: StateInt) {
    if (!store) {
      return;
    }

    stateExt.current.currentState = store.currentState;
    stateExt.current.previousState = store.previousState;

    switch (store.currentState) {
      case States.INITIAL:
        break;

      case States.TERMINAL:
        semaphore.current = false;
        break;

      case States.FILE_EDIT:
      case States.OPTIONS_EDIT:
      case States.SOMETHING_ELSE:
        if (!semaphore.current) {
          // monitor is not occupied - go into and lock
          semaphore.current = true;

          if (store.currentState === States.FILE_EDIT) {
            try {
              //const answer = await someFileEditMethod(store.data.fileName);
              stateExt.current.data.fileName = store.data.fileName;
              //stateExt.current.data.someFileEditMethodResult = answer;
            } catch(error) {
              // processErrors(store, error as Error);
            }

          } else if (store.currentState === States.OPTIONS_EDIT) {
            try {
              //const answer = await someFileEditMethod(store.data.fileName);
              stateExt.current.data.fileName = store.data.fileName;
              //stateExt.current.data.someFileEditMethodResult = answer;
            } catch(error) {
              // processErrors(store, error as Error);
            }

          } else if (store.currentState === States.SOMETHING_ELSE) {
            try {
              //const answer = await someFileEditMethod(store.data.fileName);
              stateExt.current.data.fileName = store.data.fileName;
              //stateExt.current.data.someFileEditMethodResult = answer;
            } catch(error) {
              // processErrors(store, error as Error);
            }
          }

          if (store.errors.size) {
            // if errors occurs stop further activities and request for shutdown (TERMINAL state) with monitor unlocking
            terminate();
          } else {
            // We in separate Promise thread where used synchronous calls ('await' command),
            // so here data request has completed already -
            // leave this section unlock monitor not to block other requests
            semaphore.current = false;
          }
        }
        break;

      default:
        throw new Error(`unknown state requested: ${store.currentState}`);
    }

    const stateExtClientInstance = cloneStateExt(stateExt.current);
    stateHandlers.current.forEach((item) => {
      item({ ...stateExtClientInstance });
    });
  }

  /**
   * Clones (makes deep copy) external state object
   *
   * @param state - cloneable object; if not specified, new object with empty fields created
   * @return - result object
   */
  function cloneStateExt(state?: StateExt): StateExt {
    if (!state) {
      state = {
        currentState: States.TERMINAL,
        previousState: States.TERMINAL,
        errors: Map<string, Error[]>(),
        data: {
          fileName: '',
        },
      }
    } else {
      state = {
        currentState: state.currentState,
        previousState: state.previousState,
        errors: Array.from(state.errors.keys())
          .reduce<Map<string, Error[]>>(
            (accum, curr) => {
              const keyNew = curr;
              const valNew = state?.errors?.get(keyNew)?.slice() ?? [];
              return accum.set(keyNew, valNew);
            }, Map<string, Error[]>()),
        data: {
          fileName: state.data.fileName,
        },
      }
    }

    return state;
  }

  /**
   * Check for initial properties
   *
   * @param funcName - function name
   * @param props - argument value
   */
  function checkAndInitiateProps(funcName: string, props: UseEditor2dInitProps): UseEditor2dInitProps {
    const STR_FIELD_PROPS = 'props';
    const STR_FIELD_PROPS_FILE_NAME = 'props.fileName';

    checkArgIsNotNull(STR_COMPONENT_NAME, funcName, STR_FIELD_PROPS, props);

    // some  other checks

    return props;
  }

  return result;
}

export { useEditor2d, UseEditor2dResult, UseEditor2dInitProps, States, StateExt };