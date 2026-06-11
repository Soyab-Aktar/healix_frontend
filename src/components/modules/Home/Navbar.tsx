import { getUserinfo } from "@/services/auth.services";
import NavbarClient from "./NavbarClient";

// Server component — reads cookies and passes user to client navbar
const Navbar = async () => {
  const user = await getUserinfo();
  return <NavbarClient user={user} />;
};

export default Navbar;