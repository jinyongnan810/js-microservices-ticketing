import Link from "next/link";

const header = ({ currentUser }) => {
  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">Ticketing</a>
      </Link>
      <div className="d-flex justify-content-end">
        {currentUser ? (
          <ul className="nav d-flex align-items-center">
            <Link href="/auth/signout">
              <a className="navbar-brand">Sign Out</a>
            </Link>
          </ul>
        ) : (
          <ul className="nav d-flex align-items-center">
            <Link href="/auth/signup">
              <a className="navbar-brand">Sign Up</a>
            </Link>
            <Link href="/auth/signin">
              <a className="navbar-brand">Sign in</a>
            </Link>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default header;
