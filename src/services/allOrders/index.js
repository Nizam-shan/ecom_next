import Cookies from "js-cookie";

export const CreateOrder = async (formData) => {
  try {
    const res = await fetch("/api/order/create_order", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const getAllOrderForUser = async (id) => {
  try {
    const res = await fetch(`/api/order/user_all_orders?id=${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    const data = await res.json();

    return data;
  } catch (e) {
    console.log("list", e);
  }
};

export const getOrderDetails = async (id) => {
  try {
    const res = await fetch(`/api/order/order-details?id=${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error", error);
  }
};
