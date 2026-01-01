import Logo from './Logo.tsx'
import Hamburger from 'hamburger-react'
import { useState } from 'react'

function NavBar() {
  const navBarItems = [
    { title: 'Services', href: '#services', id: 1 },
    { title: 'Gallary', href: "#gallary", id: 2 },
    { title: 'Locations', href: "#locations", id: 3 },
    { title: 'Contact', href: "contact", id: 4 },
  ];

  const [IsOpen, setOpen] = useState(false);

  function changeSetOpen() {
    setOpen(prev => !prev)
  }
  return (
    <>
      {/* mobile view */}
      <div className='bg-black flex items-center justify-between rounded-b-lg'>
        <a href='#home'>
          <Logo className='size-26' />
        </a>
        <div className='mr-8'>
          <Hamburger toggled={IsOpen} toggle={changeSetOpen} color='white' />
        </div>
      </div>

      <ul>
        {navBarItems.map(item => (
          <li key={item.id}>
            <a href={item.href}>
              {item.title}
            </a>
          </li>
        ))}
      </ul>

      {/* desktop view */}
      {/* <nav className="bg-black flex">
        <div>
          <a href='#home'>
            <img className='size-20' src={logo} alt='car collison center navigation bar logo.' />
          </a>
        </div>
        <ul className='flex'>
          {navBarItems.map(items =>
            <li key={items.id}
              className="text-white">
              <a href={items.href}>{items.title}</a>
            </li>
          )}
        </ul>
      </nav> */}
    </>
  )
}
export default NavBar;
