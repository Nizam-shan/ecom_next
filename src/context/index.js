"use client";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export const GlobalContext = createContext(null);

export const initialCheckoutFormData = {
  shippingAddress: {},
  paymentMethod: "",
  totalPrice: 0,
  isPaid: false,
  paidAt: new Date(),
  isProcessing: true,
};

const protectedRoutes = [
  "/cart",
  "/orders",
  "/checkout",
  "/account",
  "/admin-view",
  "/admin-view/add-product",
  "/admin-view/all-products",
];

const protectedAdminRoutes = [
  "/admin-view",
  "/admin-view/add-products",
  "/admin-view/all-products",
];

export default function GlobalState({ children }) {
  const [showNavModel, setShowNavModel] = useState(false);
  const [pageLevelLoader, setPageLevelLoader] = useState(true);
  const [isAuthUser, setIsAuthUser] = useState(null);
  const [user, setUser] = useState(null);
  const [componentLevelLoader, setComponentLevelLoader] = useState({
    loading: false,
    id: "",
  });
  const [showCartModel, setShowCartModel] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();
  const pathName = usePathname();
  const [currentUpdatedProduct, setCurrentUpdatedProduct] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [addressFormData, setAddressFormData] = useState({
    fullName: "",
    city: "",
    country: "",
    postalCode: "",
    address: "",
  });
  const [allOrdersForUser, setAllOrdersForUser] = useState([]);

  const [checkOutFormData, setCheckOutFormData] = useState(
    initialCheckoutFormData
  );

  useEffect(() => {
    if (Cookies.get("token") !== undefined) {
      setIsAuthUser(true);
      const userData = JSON.parse(localStorage.getItem("user")) || {};
      const getCartItems = JSON.parse(localStorage.getItem("CartItems")) || [];
      setUser(userData);
      setCartItems(getCartItems);
    } else {
      setIsAuthUser(false);
      setUser({}); // no data in user i.e user is unauthenticated
    }
  }, [Cookies]);

  useEffect(() => {
    if (
      user &&
      Object.keys(user).length === 0 &&
      protectedRoutes.indexOf(pathName) > -1
    )
      router.push("/Login");
  }, [user, pathName]);

  useEffect(() => {
    if (
      user !== null &&
      user &&
      Object.keys(user).length > 0 &&
      user?.role !== "admin" &&
      protectedAdminRoutes.indexOf(pathName) > -1
    )
      router.push("/unAuthorizedPage");
  }, [user, pathName]);
  return (
    <GlobalContext.Provider
      value={{
        showNavModel,
        setShowNavModel,
        pageLevelLoader,
        setPageLevelLoader,
        isAuthUser,
        setIsAuthUser,
        user,
        setUser,
        componentLevelLoader,
        setComponentLevelLoader,
        currentUpdatedProduct,
        setCurrentUpdatedProduct,
        showCartModel,
        setShowCartModel,
        cartItems,
        setCartItems,
        addresses,
        setAddresses,
        addressFormData,
        setAddressFormData,
        checkOutFormData,
        allOrdersForUser,
        setAllOrdersForUser,
        setCheckOutFormData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
