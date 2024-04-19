"use client";
import { GlobalContext } from "@/context";
import { adminNavOptions, navOptions } from "@/utils";
import { Fragment, useContext, useEffect } from "react";
import CommonModel from "../comman";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import CartModel from "../CartModel";

function NavItems({ isModelView = false, isAdminView, router }) {
  return (
    <div
      className={`items-center justify-between w-full md:flex md:w-auto ${
        isModelView ? "" : "hidden"
      }`}
    >
      <ul
        className={`flex flex-col p-4 md:p-0 mt-4 font-medium  rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-white ${
          isModelView ? "border-none" : "border border-gray-100"
        }`}
      >
        {isAdminView
          ? adminNavOptions.map((item) => (
              <li
                className="cursor-pointer block py-2 pl-3 pr-4 text-gray-900 rounded md:p-0"
                key={item.id}
                onClick={() => router.push(item.path)}
              >
                {item.label}
              </li>
            ))
          : navOptions.map((item) => (
              <li
                className="cursor-pointer block py-2 pl-3 pr-4 text-gray-900 rounded md:p-0"
                key={item.id}
                onClick={() => router.push(item.path)}
              >
                {item.label}
              </li>
            ))}
      </ul>
    </div>
  );
}

export default function Navbar() {
  const {
    showNavModel,
    setShowNavModel,
    user,
    isAuthUser,
    setIsAuthUser,
    setUser,
    currentUpdatedProduct,
    setCurrentUpdatedProduct,
    showCartModel,
    setShowCartModel,
  } = useContext(GlobalContext);
  const router = useRouter();

  function handleLogout() {
    setIsAuthUser(false);
    setUser(null);
    Cookies.remove("token");
    localStorage.clear();
    router.push("/");
  }

  const pathName = usePathname();

  useEffect(() => {
    if (
      pathName !== "/admin-view/add-products" &&
      currentUpdatedProduct !== null
    )
      setCurrentUpdatedProduct(null);
  }, [pathName]);
  const isAdminView = pathName.includes("admin-view");
  return (
    <>
      <nav className="w-full bg-white left-0 top-0 z-20 border-b fixed border-gray-200">
        <div className="max-w-screen-xl flex flex-wrap justify-between items-center mx-auto p-4">
          <div className="items-center flex cursor-pointer">
            <span
              onClick={() => router.push("/")}
              className="font-semibold self-center text-2xl whitespace-nowrap text-black "
            >
              E-Com-ok-shiped
            </span>
          </div>
          <div className="flex md:order-2 gap-2">
            {!isAdminView && isAuthUser ? (
              <Fragment>
                <button
                  className={
                    "mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white "
                  }
                  // onClick={router.push("/account")}
                >
                  Account
                </button>
                <button
                  className={
                    "mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white "
                  }
                  onClick={() => setShowCartModel(true)}
                >
                  Cart
                </button>
              </Fragment>
            ) : null}
            {user?.role === "admin" ? (
              isAdminView ? (
                <button
                  onClick={() => router.push("/")}
                  className="mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white "
                >
                  Client View
                </button>
              ) : (
                <button
                  onClick={() => router.push("/admin-view")}
                  className="mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white "
                >
                  Admin View
                </button>
              )
            ) : (
              ""
            )}

            {isAuthUser ? (
              <button
                onClick={handleLogout}
                className="mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white "
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => router.push("/Login")}
                className="mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white "
              >
                Login
              </button>
            )}
            <button
              data-collapse-toogle="navbar-sticky"
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-100 focus:outline-none focus:ring-2 "
              aria-controls="navbar-sticky"
              aria-expanded="false"
              onClick={() => setShowNavModel(true)}
            >
              <span className="sr-only ">open main menu</span>
              |||
            </button>
          </div>
          <NavItems isAdminView={isAdminView} router={router} />
        </div>
      </nav>
      <CommonModel
        showModelTitle={false}
        show={showNavModel}
        setShow={setShowNavModel}
        mainContent={
          <NavItems
            isModelView={true}
            isAdminView={isAdminView}
            router={router}
          />
        }
      />
      {showCartModel && <CartModel />}
    </>
  );
}
