import { Component } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';

import Header from '../components/header';
import LeftNav from '../components/left_menu';
import Products from '../components/product';
import Loading from '../components/loading';

import style from '../src/css/style.scss';

import { RingLoader } from 'react-spinners';

import getConfig from 'next/config'
const {publicRuntimeConfig} = getConfig()

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems: [],
      totalPrice: 0,
      showCheckoutModal: false,
    };

    // This binding is necessary to make `this` work in the callback
    this.addToCart = this.addToCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.showCart = this.showCart.bind(this);
    this.checkoutItems = this.checkoutItems.bind(this);
    this.showCheckout = this.showCheckout.bind(this);
    this.getProducts = this.getProducts.bind(this);
  }

  componentDidMount() {
    this.getProducts();
  }

  //https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  postData = (url = ``, data = {}, method) => {
    this.setState({showLoading: true});
  // Default options are marked with *
    return fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, same-origin, *omit
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
    .then(response => response.json()) // parses response to JSON
    .then(() => this.getProducts())
    .then(() => this.getTransactions())
    .catch(error => {
      console.error(`Fetch Error =\n`, error)
      this.setState({showLoading: false});
    });
  };

  getProducts() {
    this.setState({showLoading: true});
    fetch(`${publicRuntimeConfig.API_URL}/products`)
    .then(results => {
      return results.json();
    }).then(data => {
      let products = data.data.filter((value) => {
        return value.status == "ACTIVE" && value.stock > 0
      })
      this.setState({products: products, showLoading: false});
    }).catch(() => {
      this.setState({products: [], showLoading: false});
    })
  }

  addToCart (data) {
    if (data.stock > 0) {
      let cartItems = this.state.cartItems;
      let cartIndex=cartItems.map(function(x){ return x.id; }).indexOf(data.id);
      if (cartIndex == -1) {
        data.amount = 1;
        cartItems.push(data);
      } else {
        cartItems[cartIndex].amount++;
      }

      let products = this.state.products;
      let productIndex=cartItems.map(function(x){ return x.id; }).indexOf(data.id);
      products[productIndex].stock--;
      this.setState({products: products});

      let totalPrice = parseFloat(this.state.totalPrice);
      totalPrice += parseFloat(data.price);
      this.setState({cartItems: cartItems, totalPrice: parseFloat(totalPrice).toFixed(2)});
    }
  }

  removeFromCart (data) {
    let cartItems = this.state.cartItems;
    let cartIndex=cartItems.map(function(x){ return x.id; }).indexOf(data.id);

    let products = this.state.products;
    let productIndex=products.map(function(x){ return x.id; }).indexOf(data.id);
    products[productIndex].stock += data.amount;
    this.setState({products: products});

    let totalPrice = this.state.totalPrice;
    totalPrice -= parseFloat(data.price)*data.amount;
    cartItems.splice(cartIndex,1);
    this.setState({cartItems: cartItems, totalPrice: parseFloat(totalPrice).toFixed(2)});
  }

  showCart (data) {
    this.setState({showCartModal: data})
  }

  showCheckout (data) {
    this.setState({showCheckoutModal: data, showCartModal: !data})
  };

  checkoutItems (data) {

    let cartItems = this.state.cartItems;
    let products = [];
    cartItems.forEach((item) => {
      products.push({
        "id": item.id,
        "amount": item.amount
      })
    });
    let transaction = {products: products};

    console.log('transactions', transaction);
    this.setState({cartItems: [], totalPrice: 0});

    this.setState({showCheckoutModal: false});
    let url = `${publicRuntimeConfig.API_URL}/transactions`;

    this.postData(url, transaction, 'POST')
  };

  render () {
    return (
      <main>
        <style dangerouslySetInnerHTML={{ __html: style }} />
        <Head>
          <title>Customer</title>
        </Head>
        <Header view={this.state.currentView}/>
        <LeftNav items={[{title: "Products", view:"customer_products"}, {title:"Transactions", view:"customer_transactions"}]} changeView={this.changeView}/>



        <div className="columns page_body">
          <div className="column page_inner_body">
            <div><button className="button is-primary right" onClick={() => this.showCart(true)}>View Cart</button></div>
            <Products products={this.state.products} addToCart={(product) => this.addToCart(product)} removeFromCart={(product) => this.removeFromCart(product)} currentView="PRODUCTS"/>
          </div>
        </div>

        {this.state.showCheckoutModal &&
          <div class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title">Checkout</p>
              </header>
              <section class="modal-card-body">
                Are you sure you want to checkout your cart?
              </section>
              <footer class="modal-card-foot">
                <div class="column"></div>
                <button class="button" onClick={() => this.showCheckout(false)}>Cancel</button>
                <button class="button is-success" onClick={() => this.checkoutItems()}>Yes</button>
              </footer>
            </div>
          </div>
        }

        {this.state.showCartModal &&
          <div class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title">Cart</p>
                <button class="delete" aria-label="close" onClick={() => this.showCart(false)}></button>
              </header>
              <section class="modal-card-body">
                <Products products={this.state.cartItems} addToCart={(product) => this.addToCart(product)} removeFromCart={(product) => this.removeFromCart(product)} currentView="CART"/>
              </section>
              <footer class="modal-card-foot">
                <div class="column"></div>
                <p>Total: {this.state.totalPrice} </p>
                <button class="button is-primary" onClick={() => this.showCheckout(true)}>Checkout</button>
              </footer>
            </div>
          </div>
        }

        <Loading show={this.state.showLoading} />

      </main>
    )
  }
}
