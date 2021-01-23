import Link from "next/link";

const header = ({ currentUser }) => {
  const list = [
    currentUser && { href: "/auth/signout", title: "Sign Out" },
    !currentUser && { href: "/auth/signup", title: "Sign Up" },
    !currentUser && { href: "/auth/signin", title: "Sign In" },
  ]
    .filter((item) => item)
    .map((item) => (
      <li className="nav-item" key={item.href}>
        <Link href={item.href}>
          <a className="nav-link">{item.title}</a>
        </Link>
      </li>
    ));
  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">Ticketing</a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{list}</ul>
      </div>
    </nav>
  );
};

export default header;
