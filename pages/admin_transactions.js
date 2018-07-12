import { Component } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import fetch from 'isomorphic-unfetch'

import Header from '../components/header'
import Transaction from '../components/admin_transaction'
import LeftNav from '../components/left_menu';
import Loading from '../components/loading';

import style from '../src/css/style.scss';

import getConfig from 'next/config'
const {publicRuntimeConfig} = getConfig()

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showProductModal: false,
      showLoading: false,
    };

    // This binding is necessary to make `this` work in the callback
    this.postData = this.postData.bind(this);
    this.getTransactions = this.getTransactions.bind(this);
    this.changeTransactionStatus = this.changeTransactionStatus.bind(this);
  }

  componentDidMount() {
    this.getTransactions();
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
    .then(() => this.getTransactions())
    .catch(error => {
      console.error(`Fetch Error =\n`, error)
      this.setState({showLoading: false});
    });
  };

  changeTransactionStatus (id, status) {
    let product = {
      status: status
    };

    this.postData(`${publicRuntimeConfig.API_URL}/transaction/${id}`, product, "PUT");
  }

  render () {
    return (
      <main>
        <style dangerouslySetInnerHTML={{ __html: style }} />
        <Head>
          <title>Products</title>
        </Head>

        <Header view="Transactions"/>
        <LeftNav items={[{title: "Products", view:"admin_products"}, {title:"Transactions", view:"admin_transactions"}]} changeView={this.changeView} active="Transactions"/>

        <div className="columns page_body">
          <div className="column page_inner_body">
            <Transaction transactions={this.state.transactions} changeTransactionStatus={this.changeTransactionStatus}/>
          </div>
        </div>

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
