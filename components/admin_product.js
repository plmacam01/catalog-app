import Link from 'next/link'

export default props =>
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
  {props.products ? props.products.map(product => <tr>
    <td>{product.name}</td>
    <td>{product.price}</td>
    <td>{product.stock}</td>
    <td>{product.status}</td>
    <td><a><button className="button is-primary is-outlined" onClick={() => props.editProduct(product)}>Edit</button></a>{` `}
    <a><button className="button is-primary is-outlined" onClick={() => props.changeStatus(product)}>{product.status == "ACTIVE" ? "Deactivate" : "Activate"}</button></a></td>
  </tr>) : <tr><td>No products found</td></tr>}
</table>
