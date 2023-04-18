import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Icon({ icon, className }) {
  return (
    <FontAwesomeIcon icon={icon} className={className} />
  )
}

export default Icon