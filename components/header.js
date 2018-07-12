import Link from 'next/link';

this.openBurger = () => {
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach( el => {
      // Get the target from the "data-target" attribute
      const target = el.dataset.target;
      const $target = document.getElementById(target);

      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      el.classList.toggle('is-active');
      $target.classList.toggle('is-active');
    });
  }
}

export default props =>
  <nav className="navbar is-info">
  <div className="navbar-brand">
    <Link href="/">
    <a className="navbar-item">
      <img src="https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX17808250.jpg" alt="Catalog app friends" width="150" height="40" />
      &nbsp;&nbsp;
      <h4 class="title is-4 navbar_title">{props.view}</h4>
    </a>
    </Link>
    <div className="navbar-burger burger" data-target="navbarExampleTransparentExample" onClick={this.openBurger}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>

  <div id="navbarExampleTransparentExample" className="navbar-menu">
    <div className="navbar-end">
      <div className="navbar-item">
        <div className="field is-grouped">
          <p className="control">
            <Link href='/admin_products'>
            <a className="button is-primary">Admin</a>
            </Link>
          </p>
          <p className="control">
            <Link href='/customer_products'>
            <a className="button is-link">Customer</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>
</nav>
