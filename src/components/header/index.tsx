import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import logoImg from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import { FiUser, FiLogIn, FiShoppingCart } from "react-icons/fi";

export function Header() {
  const { signed, loadingAuth, cartAmount } = useContext(AuthContext);

  return (
    <div className="w-full flex items-center justify-center h-16 bg-white drop-shadow mb-4 ">
      <header className="flex w-full max-w-7xl items-center justify-between px-4 mx-auto ">
        <Link to="/">
          <img src={logoImg} alt="Logo do site" />
        </Link>
        <Link className="relative" to="/itemcart">
          <div>
            <FiShoppingCart size={22} color="#000" />
            {cartAmount > 0 && (
              <span className="absolute -top-3 -right-3 px-2.5b bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-sm">
                {cartAmount}
              </span>
            )}
          </div>
        </Link>

        {!loadingAuth && signed && (
          <Link to="/dashboard">
            <div className="border-2 rounded-full p-1 border-gray-900">
              <FiUser size={22} color="#000" />
            </div>
          </Link>
        )}

        {!loadingAuth && !signed && (
          <Link to="/login">
            <div className="border-2 rounded-full p-1 border-gray-900">
              <FiLogIn size={22} color="#000" />
            </div>
          </Link>
        )}
      </header>
    </div>
  );
}
