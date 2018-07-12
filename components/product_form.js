
export default props =>
  <div className="modal is-active">
    <div className="modal-background"></div>
    <div className="modal-card">
      <header className="modal-card-head">
        <p className="modal-card-title">{props.editItem.edit ? "Edit" : "Add"} Product</p>
      </header>
      <section className="modal-card-body">
        <label className="label">Name</label>
        <form name="product" onSubmit={(e) => this.submitForm(e, props.editProductForm.edit)}>
          <input className="input" name="status" value={props.editItem.status} type="hidden"/>
          <div className="control">
            <input className="input" name="name" value={props.editItem.name} type="text" onChange={props.onChange} />
            {props.formErrors.name && <p class="help is-danger">{props.formErrors.name}</p>}
          </div>
          <label className="label">Price</label>
          <div className="control">
            <input className="input" name="price" value={props.editItem.price} type="number" onChange={props.onChange} min="0" step="0.01"/>
            {props.formErrors.price && <p class="help is-danger">{props.formErrors.price}</p>}
          </div>
          <label className="label">Available</label>
          <div className="control">
            <input className="input" name="stock" value={props.editItem.stock} type="number" onChange={props.onChange} min="0" step="1"/>
            {props.formErrors.stock && <p class="help is-danger">{props.formErrors.stock}</p>}
          </div>
        </form>
      </section>
      <footer className="modal-card-foot">
        <div class="column"></div>
        <button className="button" onClick={props.close}>Cancel</button>
        <button className="button is-success" onClick={props.submit}>Save</button>
      </footer>
    </div>
  </div>
