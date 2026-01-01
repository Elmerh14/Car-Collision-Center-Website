import logo from '../assets/logo.svg'

interface Props {
  className?: string
}

function Logo({ className }: Props) {
  return (
    <img src={logo} alt='car collision center logo' className={className} />
  )
}

export default Logo;

