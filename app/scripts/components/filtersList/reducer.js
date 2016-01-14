import {Map} from 'immutable';
import constants from '../../constants';
import {combineReducer} from '../../reducer';

function reducer(state = Map(), action) {
  switch (action.type) {
    case constants.LOAD_CATEGORIES:
      return state.set('categories', Map({items:[], loading:true}));
    case constants.LOAD_CATEGORIES_SUCCESS:
      return state.set('categories', Map({items:action.items, loading:false}));
  }
  return state;
}

export function mountReducer() {
  combineReducer(reducer);
}