import {Link} from 'react-router-dom'

const Header = () => {

  return (
    <header className="Header">
            <h1>Redux Blog</h1>
            <nav>
                <ul>
                    <li><Link className="link" to="/">Home</Link></li>
                    <li><Link className="link" to="post">Post</Link></li>
                    <li><Link className="link" to="user">Users</Link></li>
                </ul>
            </nav>
    </header>
  )
}

export default Header