import { Component } from 'react'
import Head from 'next/head'
import fetch from 'isomorphic-unfetch'
import Link from 'next/link'

import Post from '../components/post'
import Header from '../components/header'

import style from '../src/css/style.scss';

export default class extends Component {
  static async getInitialProps () {
    // fetch list of posts
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_page=1')
    const postList = await response.json()
    return { postList }
  }

  render () {
    return (
      <main>
        <Head>
          <title>Catalog App</title>
        </Head>
        <style dangerouslySetInnerHTML={{ __html: style }} />

        <Header />

        <h2>Welcome to Swerl</h2>
        <h4>To start, click Admin or Customer button on top of page</h4>
      </main>
    )
  }
}
