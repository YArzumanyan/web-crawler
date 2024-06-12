import { Link } from "react-router-dom";
import { Nav, NavItem, NavLink, Navbar, NavbarBrand } from "reactstrap";

export const Navigation = () => {
  return (
    <div>
      <Navbar color="dark" dark>
        <NavbarBrand href="/">Crawler</NavbarBrand>
        <Nav className="me-auto d-flex flex-row" navbar>
          <NavItem className="p-2">
            <NavLink tag={Link} data-target="home" to="/">
              Home
            </NavLink>
          </NavItem>
          <NavItem className="p-2">
            <NavLink tag={Link} data-target="websites" to="/websites">
              Websites
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    </div>
  );
};
