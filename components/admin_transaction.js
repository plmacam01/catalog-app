import Link from 'next/link'

import moment from 'moment';

export default props =>
<table className="table is-fullwidth">
  <thead>
    <tr>
      <th>ID</th>
      <th>Date Created</th>
      <th>Date Shipped</th>
      <th>Date Arrived</th>
      <th>Total</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {props.transactions ? props.transactions.map(transaction => <tr>
      <td>{transaction.id}</td>
      <td>{transaction.date_created != "None" ? moment(transaction.date_created).format("LLL") : ""}</td>
      <td>{transaction.date_shipped != "None" ? moment(transaction.date_shipped).format("LLL") : ""}</td>
      <td>{transaction.date_arrived != "None" ? moment(transaction.date_arrived).format("LLL") : ""}</td>
      <td>{transaction.total}</td>
      <td>{transaction.status == "CREATED" && <a><button className="button is-primary is-outlined" onClick={() => props.changeTransactionStatus(transaction.id , 2)}>Ship</button></a>}{` `}
      {transaction.status == "ONGOING"  && <a><button className="button is-primary is-outlined" onClick={() => props.changeTransactionStatus(transaction.id , 3)}>Arrived</button></a>}</td>
    </tr>) : <tr><td>No transactions found</td></tr>}
  </tbody>
</table>
