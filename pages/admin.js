import { Component } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import fetch from 'isomorphic-unfetch'

import Header from '../components/header'
import Admin_Product from '../components/admin_product'
import Transaction from '../components/admin_transaction'
import LeftNav from '../components/left_menu';

import { RingLoader } from 'react-spinners';

import style from '../src/css/style.scss';

import getConfig from 'next/config'
const {publicRuntimeConfig} = getConfig()

export default class extends Component {
  // static async getInitialProps ({ query }) {
  //   // // fetch single post detail
  //   const response = await fetch(`${publicRuntimeConfig.API_URL}/products`)
  //   const products = await response.json()
  //   return { ...products }
  // }

  constructor(props) {
    super(props);
    this.state = {
      currentView: "Products",
      transactions: [],
      products: [],
      showProductModal: false,
      editItem: {},
      formErrors: {},
      showLoading: false,
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
    this.setState({showLoading: true});
    fetch(`${publicRuntimeConfig.API_URL}/products`)
    .then(results => {
      return results.json();
    }).then(data => {
      this.setState({products: data.data, showLoading: false});
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
      let url = `${publicRuntimeConfig.API_URL}/products`;
      let method = "POST";
      if (editItem.edit) {
        url = `${publicRuntimeConfig.API_URL}/product/${editItem.id}`
        method = "PUT";
      }
      product.status = 1;
      this.postData(url, product, method)
    }
  }

  //https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  postData = (url = ``, data = {}, method) => {
  // Default options are marked with *
    this.setState({showLoading: true});
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

    this.postData(`${publicRuntimeConfig.API_URL}/product/${data.id}`, product, "PUT");
  }

  changeTransactionStatus (data, status) {
    let product = {
      status: status
    };

    this.postData(`${publicRuntimeConfig.API_URL}/transaction/${data.id}`, product, "PUT");
  }

  render () {
    let view;
    let title;
    let products;
    let transactions;
    let table;
    let tableBody;
    let totalPrice;
    let productModal;
    let addProductButton;
    if (this.state.currentView == "Products") {
      addProductButton = (<div><button className="button is-primary" onClick={() => this.showProductModalFunc(true)}>Add Product</button></div>)
      products = this.state.products;
      if (products.length > 0) {
        tableBody = (
          <tbody>
            {products.map(product => <Admin_Product {...product} editProduct={() => this.editProduct(product)} changeStatus={() => this.changeStatus(product)} currentView={this.state.currentView} key={product.id} />)}
          </tbody>
        )
      } else {
        tableBody = (
            <tbody>
              <tr>
                <td>No products found</td>
              </tr>
            </tbody>
        )
      }
        table = (
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
            {tableBody}

          </table>
        );


    } else if (this.state.currentView == "Transactions") {
      transactions = this.state.transactions;
      if (transactions.length > 0) {
        table = (
          <ol>
            {transactions.map(transaction => <li><Transaction {...transaction} changeTransactionStatus={(val) => this.changeTransactionStatus(transaction, val)} currentView={this.state.currentView} key={transaction.id} /></li>)}
          </ol>
        );
      } else {
        table = (
          <div>
            No transactions found
          </div>
        )
      }
    }



    view = (
      <div>
        {addProductButton}
        <br />
        {table}
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

        <Header view={this.state.currentView}/>
        <LeftNav items={[{title: "Products", view:"PRODUCTS"}, {title:"Transactions", view:"TRANSACTIONS"}]} changeView={this.changeView}/>

        <div className="columns" style={{marginLeft: "30px"}}>
          <div className="column">
            { view }
          </div>
        </div>


        {this.state.showProductModal && productModal}

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

function validateForm(name, value) {
  if (!value) return `${name} must not be empty`;
  if (name == "price") {
    let decimal = value.split('.');
    if (decimal[1] && decimal[1].length > 2) return "price must only have 2 decimals"
  }
}
