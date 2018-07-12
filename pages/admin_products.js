import { Component } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import fetch from 'isomorphic-unfetch'

import Header from '../components/header'
import Admin_Product from '../components/admin_product'
import LeftNav from '../components/left_menu';
import Loading from '../components/loading';
import ProductForm from '../components/product_form'

import style from '../src/css/style.scss';

import getConfig from 'next/config'
const {publicRuntimeConfig} = getConfig()

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    this.showProductModalFunc = this.showProductModalFunc.bind(this);
    this.editProduct = this.editProduct.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.getProducts = this.getProducts.bind(this);
  }

  componentDidMount() {
    this.getProducts();
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
      stock: editItem.stock,
      status: editItem.status
    };
    let errors = {};
    let error;
    for (var key in product) {
      error = validateForm(key, product[key]);
      if (error) errors[key] = error;
    }

    this.setState({formErrors: errors});
    if (Object.keys(errors).length == 0) {
      this.setState({showProductModal: false});
      let url = `${publicRuntimeConfig.API_URL}/products`;
      let method = "POST";
      if (editItem.edit) {
        url = `${publicRuntimeConfig.API_URL}/product/${editItem.id}`
        method = "PUT";
      }
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
    .catch(error => {
      console.error(`Fetch Error =\n`, error)
      this.setState({showLoading: false});
    });
  };

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

  render () {
    return (
      <main>
        <style dangerouslySetInnerHTML={{ __html: style }} />
        <Head>
          <title>Transactions</title>
        </Head>

        <Header view="Products"/>
        <LeftNav items={[{title: "Products", view:"admin_products"}, {title:"Transactions", view:"admin_transactions"}]} changeView={this.changeView} active={this.state.currentView}/>

        <div className="columns page_body">
          <div className="column page_inner_body">
            <div><button className="button is-primary" onClick={() => this.showProductModalFunc(true)}>Add Product</button></div>
            <Admin_Product products={this.state.products} editProduct={(product) => this.editProduct(product)} changeStatus={(product) => this.changeStatus(product)}/>
          </div>
        </div>

        {
          this.state.showProductModal && <ProductForm close={() => this.showProductModalFunc(false)} submit={this.submitForm} onChange={this.handleInputChange} editItem={this.state.editItem} formErrors={this.state.formErrors} />
        }

        <Loading show={this.state.showLoading} />

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
