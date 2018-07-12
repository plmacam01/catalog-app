import Link from 'next/link'

export default props =>
  <div>
    {props.products ? props.products.map(product =>
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
                <p class="title is-4">{product.name}</p>
                <p class="subtitle is-6">₱{product.price}</p>
                {props.currentView =="PRODUCTS" && <p>Available: {product.stock}</p>}
                {props.currentView =="CART" && <p>Amount: {product.amount}</p>}
                {/* render the URL as /post/:id */}
                <a>{props.currentView =="PRODUCTS" && <button className="button is-primary is-outlined" onClick={() => props.addToCart(product)}>Add to Cart</button>}
                {props.currentView =="CART" && <button className="button is-primary is-outlined" onClick={() => props.removeFromCart(product)}>Remove from Cart</button>}</a>
              </div>
            </div>
          </div>
        </div>
      </article>
    ) : "No products found"}
  </div>
