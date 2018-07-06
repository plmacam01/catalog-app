import Link from 'next/link'

export default props =>
  <article>
    <p>Name: {props.name}</p>
    <p>Price: {props.price}</p>
    {props.currentView =="PRODUCTS" && <p>Available: {props.stock}</p>}
    {props.currentView =="CART" && <p>Amount: {props.amount}</p>}
    {/* render the URL as /post/:id */}
    <a><button className="button is-primary is-outlined" onClick={props.currentView =="PRODUCTS" ? props.addToCart : props.removeFromCart}>{props.currentView =="PRODUCTS" ? "Add to Cart" : "Remove"}</button></a>
  </article>
