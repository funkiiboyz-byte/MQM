import { Link, useLocation } from 'react-router-dom';

const cards = [

];

export default function Layout({ user, onLogout, children }) {
  const { pathname } = useLocation();

      <main>{children}</main>
    </div>
  );
}
