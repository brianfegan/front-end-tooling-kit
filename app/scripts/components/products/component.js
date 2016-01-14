import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import iso from '../../isomorphic';
import {getStore} from '../../store';
import {loadProducts} from './actionCreators';
import {mountReducer} from './reducer';

let ProductItem = React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    const image = '/img/'+this.props.product.image;
    const price = 'Price.......$'+this.props.product.price;
    return (
      <li>
        <a href="#">
          <img alt="" src={image} />
          <h3>{ this.props.product.name }</h3>
          <span>{price}</span>
        </a>
      </li>
    );
  }
});

let Products = React.createClass({
  mixins: [PureRenderMixin],
  componentWillMount: function() {
    mountReducer();
    this.subscribeId = iso.subscribeAsyncFn((path, params, query, callbackFn) => {
      loadProducts(params.categoryId, query.sort, callbackFn);
    });
  },
  componentDidMount: function() {
    iso.unsubscribeAsyncFn(this.subscribeId);
    let store = getStore();
    let state = store.getState().toJS();
    if (!state.products) loadProducts(state.url.params.categoryId, state.url.query.sort);
    store.subscribe(() => {
      let state = store.getState().toJS();
      loadProducts(state.url.params.categoryId, state.url.query.sort);
    });
  },
  render: function() {
    let items = [];
    this.props.products.forEach(product => {
      items.push(<ProductItem key={product.id} product={product} />);
    });
    return (
      <ul className="products clearfix">
        {items}
      </ul>
    );
  }
});

function select(state) {
  state = state.toJS();
  return {
    products: ((state.products) ? state.products.items : []),
    loading: ((state.products) ? state.products.loading : false)
  };
}

export default connect(select)(Products);