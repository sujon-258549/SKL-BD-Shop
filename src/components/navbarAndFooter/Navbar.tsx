import "./nav.css";
import { FaShoppingBag } from "react-icons/fa";
import { useAppSelector } from "@/redux/fetures/hooks";
import { orderSelector } from "@/redux/fetures/card/shippingSlice";
import { Link } from "react-router-dom";

export default function Navbar() {
  const productLength = useAppSelector(orderSelector);

  return (
    <section className="border-b px-4 sticky top-0 z-40 md:px-8 bg-cyan-900">
      <header className="max-w-6xl mx-auto lg:px-3">
        <div className="flex h-16 items-center justify-between">
          {/* Logo (no route) */}
          <Link to={"/"}>
            <div className="flex items-center">
              <img src="/logo.png" alt="Logo" className="w-[100px]" />
            </div>
          </Link>
          {/* Right: Cart + Auth + Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Cart Icon */}
            <Link to={"/shipping"}>
              {" "}
              <div className="relative inline-flex items-center">
                <FaShoppingBag className="text-2xl mr-2 text-white" />
                <span className="absolute -top-2 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {productLength.length}
                </span>
              </div>
            </Link>

            {/* Mobile Hamburger */}
          </div>
        </div>
      </header>
    </section>
  );
}
