import Link from 'next/link'

import moment from 'moment';

export default props =>

<ol>
  {props.transactions ? props.transactions.map(transaction => <li key={transaction.id}>
    <p>Date Created: {transaction.date_created != "None" ? moment(transaction.date_created).format("LLL") : ""}</p>
    <p>Date Shipped: {transaction.date_shipped != "None" ? moment(transaction.date_shipped).format("LLL") : ""}</p>
    <p>Date Arrived: {transaction.date_arrived != "None" ? moment(transaction.date_arrived).format("LLL") : ""}</p>
    <p>Total: {transaction.total}</p>
    <p>Products: </p>
    <table className="table is-fullwidth">
      <thead>
        <th>Name</th>
        <th>Price</th>
        <th>Quantity</th>
      </thead>
      <tbody>
        {transaction.products.map(product => <tr><td>{product.name}</td><td>{product.price}</td><td>{product.amount}</td></tr>)}
      </tbody>

    </table></li>
  ) : "No transactions found"}
</ol>
