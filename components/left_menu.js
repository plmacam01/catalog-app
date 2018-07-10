import Link from 'next/link'

export default props =>
  <aside className="menu side_menu" >
  <ul className="menu-list">
    {props.items.map(item => <li>
      <a onClick={() => props.changeView(item.title)}>{item.title}</a>
    </li>)}
  </ul>
</aside>
