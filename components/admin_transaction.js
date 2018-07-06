import Link from 'next/link'

export default props =>
  <article>
    <p>Date Created: {props.date_created}</p>
    <p>Date Shipped: {props.date_shipped}</p>
    <p>Date Arrived: {props.date_arrived}</p>
    <p>Total: {props.total}</p>
    <p>Products: </p>
    <table className="table is-fullwidth">
      <thead>
        <th>Name</th>
        <th>Price</th>
        <th>Amount</th>
      </thead>
      <tbody>
        {props.products.map(product => <tr><td>{product.name}</td><td>{product.price}</td><td>{product.amount}</td></tr>)}
      </tbody>

    </table>
    <div>Set Status: {props.status == "CREATED" && <a><button className="button is-primary is-outlined" onClick={() => props.changeTransactionStatus(2)}>Shipped</button></a>}{` `}
    {["CREATED", "ONGOING"].indexOf(props.status) > -1  && <a><button className="button is-primary is-outlined" onClick={() => props.changeTransactionStatus(3)}>Arrived</button></a>}</div>


  </article>
