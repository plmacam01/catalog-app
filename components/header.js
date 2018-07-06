import Link from 'next/link'

export default props =>
  <article>
    <div className="columns is-mobile is-centered">
      <div className="column is-one-fifth">
        <Link href='/admin'>
        <a className="button is-link">Admin</a>
        </Link>
      </div>
      <div className="column is-centered">
        <Link href='/customer'>
        <a className="button is-link">Customer</a>
        </Link>
      </div>
    </div>


  </article>
