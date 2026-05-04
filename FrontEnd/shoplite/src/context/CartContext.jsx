import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const getToken = () => localStorage.getItem("token");

const BASE = "http://localhost:8080/api/cart";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    const token = getToken();
    if (!token || token === "null" || token === "undefined") return;

    try {
      const res = await axios.get(BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      console.warn("Session expired → clearing token");
      localStorage.removeItem("token");
      return;
    }

    console.error("Fetch cart error:", err);
  }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (product) => {
    const token = getToken();
    if (!token) throw new Error("NOT_LOGGED_IN");

    try {
      await axios.post(
        `${BASE}/add`,
        {
          productId: product.id,
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await fetchCart();
    } catch (err) {
      if ([401, 403, 400].includes(err.response?.status)) {
        localStorage.removeItem("token");
        throw new Error("SESSION_EXPIRED");
      }
      throw err;
    }
  };

  const removeFromCart = async (productId) => {
    const token = getToken();
    if (!token) return;

    await axios.delete(`${BASE}/remove/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchCart();
  };

  const increaseQty = async (productId, currentQty) => {
    const token = getToken();
    if (!token) return;

    await axios.put(
      `${BASE}/update`,
      { productId, quantity: currentQty + 1 },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchCart();
  };

  const decreaseQty = async (productId, currentQty) => {
    if (currentQty <= 1) return;

    const token = getToken();
    if (!token) return;

    await axios.put(
      `${BASE}/update`,
      { productId, quantity: currentQty - 1 },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchCart();
  };

  const clearCart = async () => {
    const token = getToken();
    if (!token) return;

    await axios.delete(`${BASE}/clear`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};