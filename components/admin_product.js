import Link from 'next/link'

export default props =>
  <tr>
    <td>{props.name}</td>
    <td>{props.price}</td>
    <td>{props.stock}</td>
    <td>{props.status}</td>
    <td><a><button className="button is-primary is-outlined" onClick={props.editProduct}>Edit</button></a></td>
    <td><a><button className="button is-primary is-outlined" onClick={props.changeStatus}>{props.status == "ACTIVE" ? "Deactivate" : "Activate"}</button></a></td>
  </tr>
