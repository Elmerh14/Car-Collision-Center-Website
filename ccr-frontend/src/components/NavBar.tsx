
function NavBar() {
  const navBarItems = [
    { title: 'Services', href: '#services', id: 1 },
    { title: 'Gallary', href: "#gallary", id: 2 },
    { title: 'Locations', href: "#locations", id: 3 },
    { title: 'Contact', href: "contact", id: 4 },
  ]
  return (
    <>
      <nav className="bg-black">
        <ul>
          {navBarItems.map(items =>
            <li key={items.id}
              className="text-white">
              <a href={items.href}>{items.title}</a>
            </li>
          )}
        </ul>
      </nav>
    </>
  )
}
export default NavBar;
