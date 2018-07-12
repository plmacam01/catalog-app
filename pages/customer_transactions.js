import { Component } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import fetch from 'isomorphic-unfetch';

import Header from '../components/header';
import LeftNav from '../components/left_menu';
import Transaction from '../components/transaction';
import Loading from '../components/loading';

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
    };
    this.getTransactions = this.getTransactions.bind(this);
  }

  componentDidMount() {
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
    .then(() => this.getTransactions())
    .catch(error => {
      console.error(`Fetch Error =\n`, error)
      this.setState({showLoading: false});
    });
  };

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

  render () {
    return (
      <main>
        <style dangerouslySetInnerHTML={{ __html: style }} />
        <Head>
          <title>Customer</title>
        </Head>
        <Header view="Transactions"/>
        <LeftNav items={[{title: "Products", view:"customer_products"}, {title:"Transactions", view:"customer_transactions"}]} changeView={this.changeView}/>

        <div className="columns page_body">
          <div className="column page_inner_body">
            <Transaction transactions={this.state.transactions}/>
          </div>
        </div>

        <Loading show={this.state.showLoading} />

      </main>
    )
  }
}
