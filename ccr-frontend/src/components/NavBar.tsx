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

  return (
    <>
      {/* mobile view */}
      <nav className='md:hidden'>
        <div className='bg-black flex items-center justify-between'>
          <a href='#home'>
            <Logo className='size-26' />
          </a>
          <div className='mr-8'>
            <Hamburger toggled={IsOpen} toggle={setOpen} color='white' />
          </div>
        </div>

        <div
          className=
          {`fixed inset-0 bg-black z-40 ${IsOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setOpen(false)}
        />

        <div className=
          {`bg-black fixed inset-y-0 left-0 w-1/2 z-50 flex flex-col items-center rounded-r-2xl transition duration-700 ease-in-out ${IsOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div>
            <Logo className='w-full h-auto' />
          </div>
          <div className='flex-1 flex items-center'>
            <ul className='text-white flex flex-col items items-center gap-10 text-lg font-bold'>
              {navBarItems.map((item =>
                <li key={item.id}>
                  <a href={item.href}>{item.title}</a>
                </li>
              ))}
            </ul>

          </div>
        </div>
      </nav>

      {/* Desktop View */}

    </>
  )
}
export default NavBar;
