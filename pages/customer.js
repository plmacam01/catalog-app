import { Component } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';

import Header from '../components/header';
import LeftNav from '../components/left_menu';
import Product from '../components/product';
import Transaction from '../components/transaction';

import style from '../src/css/style.scss';

import { RingLoader } from 'react-spinners';

import getConfig from 'next/config'
const {publicRuntimeConfig} = getConfig()

export default class extends Component {
  // static async getInitialProps ({ query }) {
  //   // fetch single post detail
  //   const response = await fetch(`${publicRuntimeConfig.API_URL}/products`)
  //   const products = await response.json()
  //   return { ...products }
  // }

  constructor(props) {
    super(props);
    this.state = {
      currentView: "Products",
      cartItems: [],
      totalPrice: 0,
      showCheckoutModal: false,
      transactions: [],
      products: [],
    };

    // This binding is necessary to make `this` work in the callback
    this.addToCart = this.addToCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.changeView = this.changeView.bind(this);
    this.checkoutItems = this.checkoutItems.bind(this);
    this.showCheckout = this.showCheckout.bind(this);
    this.tableBody = this.tableBody.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.getTransactions = this.getTransactions.bind(this);
  }

  componentDidMount() {
    this.getProducts();
    this.getTransactions();
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

  getTransactions() {
    this.setState({showLoading: true});
    fetch(`${publicRuntimeConfig.API_URL}/transactions`)
    .then(results => {
      return results.json();
    }).then(data => {
      this.setState({transactions: data.data, showLoading: false});
    }).catch(() => {
      this.setState({transactions: [], showLoading: false});
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

  changeView (view) {
    this.setState({currentView: view})
  }

  showCheckout (data) {
    this.setState({showCheckoutModal: data})
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

  tableBody(data, view) {
    let tableBody;
    if (data.length > 0) {
      tableBody = (
        <div>
          {data.map(product => <Product {...product} addToCart={() => this.addToCart(product)} removeFromCart={() => this.removeFromCart(product)} currentView={view} key={product.id} />)}
        </div>
      );
    } else {
      tableBody = (
        <div>
          No products found
        </div>
      )
    }
    return tableBody;
  };

  render () {
    let productsView;
    let cartView;
    let transactionsView;
    let view;
    let title;
    let totalPrice;
    let checkoutModal;
    let products = this.state.products;
    let transactions = this.state.transactions;

    let cartProducts = this.state.cartItems;
    totalPrice = (
      <div>
        <h5 class="title is-5">Total: {this.state.totalPrice}</h5>
        {this.state.totalPrice > 0 && <div><button className="button is-primary" onClick={() => this.showCheckout(true)}>Checkout</button></div>}
      </div>
    )


    if (this.state.currentView == "Products") {
      productsView = (
        <div>
          {this.tableBody(products, "PRODUCTS")}
        </div>
      )
    } else if (this.state.currentView == "Cart") {
      cartView = (
        <div>
          {this.tableBody(cartProducts, "CART")}
          <br />
          {totalPrice}
        </div>
      )
    } else if (this.state.currentView == "Transactions") {
      if (transactions.length > 0) {
        transactionsView = (
          <ol>
            {transactions.map(transaction => <li><Transaction {...transaction} editProduct={() => this.editProduct(transaction)} disableProduct={() => this.disableProduct(transaction)} currentView={this.state.currentView} key={transaction.id} /></li>)}
          </ol>
        );
      } else {
        transactionsView = (
          <div>
            No transactions found
          </div>
        )
      }


    }

    view =(
      <div class="columns is-mobile is-centered view_container">
        <div class="column">
          { productsView}
          { cartView }
          { transactionsView }
        </div>
      </div>
    )

    checkoutModal = (
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
    )


    return (
      <main>
        <style dangerouslySetInnerHTML={{ __html: style }} />
        <Head>
          <title>Customer</title>
        </Head>
        <Header view={this.state.currentView}/>
        <LeftNav items={[{title: "Products", view:"PRODUCTS"}, {"title":"Cart", view:"CART"}, {title:"Transactions", view:"TRANSACTIONS"}]} changeView={this.changeView}/>

        { view }

        {this.state.showCheckoutModal && checkoutModal}

        {
          this.state.showLoading &&
          <div className="modal is-active">
            <div className="modal-background"></div>
            <RingLoader loading={true} color="#FFFFFF" size="200"/>
          </div>
        }

      </main>
    )
  }
}
