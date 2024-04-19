import Cookies from "js-cookie";

export const AddToCart = async (formData) => {
  try {
    const res = await fetch("/api/cart/add-to-cart", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });
    const data = res.json();
    return data;
  } catch (error) {
    console.log("catch ", error);
  }
};

export const GetAllCartItems = async (id) => {
  try {
    const res = await fetch(`/api/cart/all-cart-items?id=${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    const data = res.json();
    return data;
  } catch (error) {
    console.log("catch ", error);
  }
};

export const DeleteFromCart = async (id) => {
  try {
    const res = await fetch(`/api/cart/delete-from-cart?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    const data = res.json();
    return data;
  } catch (error) {
    console.log("catch ", error);
  }
};
