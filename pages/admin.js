import { Component } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import fetch from 'isomorphic-unfetch'

import Header from '../components/header'
import Admin_Product from '../components/admin_product'
import Transaction from '../components/admin_transaction'

import style from '../src/css/style.scss';

export default class extends Component {
  static async getInitialProps ({ query }) {
    // fetch single post detail
    const response = await fetch(`http://127.0.0.1:5000/products`)
    const products = await response.json()
    return { ...products }
  }

  constructor(props) {
    super(props);
    this.state = {
      currentView: "PRODUCTS",
      transactions: [],
      products: [],
      showProductModal: false,
      editItem: {},
      formErrors: {}
    };

    // This binding is necessary to make `this` work in the callback
    this.handleInputChange = this.handleInputChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.postData = this.postData.bind(this);
    this.changeView = this.changeView.bind(this);
    this.showProductModalFunc = this.showProductModalFunc.bind(this);
    this.editProduct = this.editProduct.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.getProducts = this.getProducts.bind(this);
    this.getTransactions = this.getTransactions.bind(this);
  }

  componentDidMount() {
    this.getProducts();
    this.getTransactions();
  }

  getProducts() {
    fetch(`http://127.0.0.1:5000/products`)
    .then(results => {
      return results.json();
    }).then(data => {
      this.setState({products: data.data});
    })
  }

  getTransactions() {
    fetch(`http://127.0.0.1:5000/transactions`)
    .then(results => {
      return results.json();
    }).then(data => {
      this.setState({transactions: data.data});
    })
  }

  handleInputChange(event) {
    event.preventDefault();
    const target = event.target;
    let value = target.value;
    const name = target.name;

    let editItem = this.state.editItem;
    if (name == "stock") value = parseInt(value);
    editItem[name]= value;

    this.setState({
      editItem
    });
  }


  submitForm (event) {
    event.preventDefault();

    let editItem = this.state.editItem;
    let product = {
      name: editItem.name,
      price: editItem.price,
      stock: editItem.stock
    };
    let errors = {};
    let error;
    for (var key in product) {
      error = validateForm(key, product[key]);
      if (error) errors[key] = error;
    }

    this.setState({formErrors: errors});
    if (Object.keys(errors).length == 0) {
      this.setState({showProductModal: false})
      let url = "http://127.0.0.1:5000/products";
      let method = "POST";
      if (editItem.edit) {
        url = `http://127.0.0.1:5000/product/${editItem.id}`
        method = "PUT";
      }
      product.status = 1;
      this.postData(url, product, method)
    }
  }

  //https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  postData = (url = ``, data = {}, method) => {
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
    .catch(error => console.error(`Fetch Error =\n`, error));
  };

  changeView (view) {
    this.setState({currentView: view})
  }

  showProductModalFunc (data) {
    this.setState({showProductModal: data, editItem: {}})
  };
  editProduct (data) {
    data.edit = true;
    this.setState({showProductModal: true, editItem: data})
  };
  changeStatus (data) {
    let status = data.status == "ACTIVE" ? 2 : 1;
    let product = {
      name: data.name,
      price: data.price,
      stock: data.stock,
      status: status
    };

    this.postData(`http://127.0.0.1:5000/product/${data.id}`, product, "PUT");
  }

  changeTransactionStatus (data, status) {
    let product = {
      status: status
    };

    this.postData(`http://127.0.0.1:5000/transaction/${data.id}`, product, "PUT");
  }

  render () {
    let view;
    let title;
    let products;
    let transactions;
    let tableBody;
    let totalPrice;
    let productModal;
    let addProductButton;
    if (this.state.currentView == "PRODUCTS") {
      title = "Products";
      addProductButton = (<div><button className="button is-primary" onClick={() => this.showProductModalFunc(true)}>Add Product</button></div>)
      products = this.state.products;
      if (products.length > 0) {
        tableBody = (
          <table className="table is-fullwidth">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Available</th>
                <th>Status</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => <Admin_Product {...product} editProduct={() => this.editProduct(product)} changeStatus={() => this.changeStatus(product)} currentView={this.state.currentView} key={product.id} />)}
            </tbody>

          </table>
        );
      } else {
        tableBody = (
          <div>
            No products found
          </div>
        )
      }
    } else if (this.state.currentView == "TRANSACTIONS") {
      title = "Transactions";
      transactions = this.state.transactions;
      if (transactions.length > 0) {
        tableBody = (
          <ol>
            {transactions.map(transaction => <li><Transaction {...transaction} changeTransactionStatus={(val) => this.changeTransactionStatus(transaction, val)} currentView={this.state.currentView} key={transaction.id} /></li>)}
          </ol>
        );
      } else {
        tableBody = (
          <div>
            No transactions found
          </div>
        )
      }
    }



    view = (
      <div>
        <h4 className="title is-4">{title}</h4>
        {addProductButton}
        <br />
        {tableBody}
        <br />
        {totalPrice}
      </div>
    )

    productModal = (
      <div className="modal is-active">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{this.state.editItem.edit ? "Edit" : "Add"} Product</p>
          </header>
          <section className="modal-card-body">
            <label className="label">Name</label>
            <form name="product" onSubmit={(e) => this.submitForm(e, this.state.editProductForm.edit)}>
              <div className="control">
                <input className="input" name="name" value={this.state.editItem.name} type="text" onChange={this.handleInputChange} />
                {this.state.formErrors.name && <p class="help is-danger">{this.state.formErrors.name}</p>}
              </div>
              <label className="label">Price</label>
              <div className="control">
                <input className="input" name="price" value={this.state.editItem.price} type="number" onChange={this.handleInputChange} min="0" step="0.01"/>
                {this.state.formErrors.price && <p class="help is-danger">{this.state.formErrors.price}</p>}
              </div>
              <label className="label">Available</label>
              <div className="control">
                <input className="input" name="stock" value={this.state.editItem.stock} type="number" onChange={this.handleInputChange} min="0" step="1"/>
                {this.state.formErrors.stock && <p class="help is-danger">{this.state.formErrors.stock}</p>}
              </div>
            </form>
          </section>
          <footer className="modal-card-foot">
            <div class="column"></div>
            <button className="button" onClick={() => this.showProductModalFunc(false)}>Cancel</button>
            <button className="button is-success" onClick={this.submitForm}>Save</button>
          </footer>
        </div>
      </div>
    )


    return (
      <main>
        <style dangerouslySetInnerHTML={{ __html: style }} />
        <Head>
          <title>Admin</title>
        </Head>

        <Header />
        <div className="columns">
          <div className="column">
            <div className="columns is-mobile is-centered">
              <div className="column is-one-fifth"><button className="button is-primary" onClick={() => this.changeView("PRODUCTS")}>Products</button></div>
              <div className="column"><button className="button is-primary" onClick={() => this.changeView("TRANSACTIONS")}>Transactions</button></div>
            </div>
          </div>
        </div>

        <div className="columns" style={{marginLeft: "30px"}}>
          <div className="column">
            { view }
          </div>
        </div>


        {this.state.showProductModal && productModal}

      </main>
    )
  }
}

function validateForm(name, value) {
  if (!value) return `${name} must not be empty`;
  if (name == "price") {
    let decimal = value.split('.');
    if (decimal[1] && decimal[1].length > 2) return "price must only have 2 decimals"
  }
}
