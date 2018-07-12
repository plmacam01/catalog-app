import Link from 'next/link'

export default props =>
  <aside className="menu side_menu" >
  <ul className="menu-list">
    {props.items.map(item => <li key={item.title}>
      <Link href={`/${item.view}`}><a class={`${props.active == item.title && 'is-active'}`} onClick={() => item.display && props.changeView(item.display)}>{item.title}</a></Link>
    </li>)}
  </ul>
</aside>
