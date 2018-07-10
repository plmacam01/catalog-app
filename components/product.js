import Link from 'next/link'

export default props =>
  <article style={{ marginBottom: '20px' }}>
    <div class="card">
      <div class="card-content">
        <div class="media">
          <div class="media-left">
            <figure class="image is-128x128">
              <img src="https://bulma.io/images/placeholders/256x256.png" alt="Placeholder image" />
            </figure>
          </div>
          <div class="media-content">
            <p class="title is-4">{props.name}</p>
            <p class="subtitle is-6">P {props.price}</p>
            {props.currentView =="PRODUCTS" && <p>Available: {props.stock}</p>}
            {props.currentView =="CART" && <p>Amount: {props.amount}</p>}
            {/* render the URL as /post/:id */}
            <a><button className="button is-primary is-outlined" onClick={props.currentView =="PRODUCTS" ? props.addToCart : props.removeFromCart}>{props.currentView =="PRODUCTS" ? "Add to Cart" : "Remove"}</button></a>
          </div>
        </div>
      </div>
    </div>
  </article>
