import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const getToken = () => localStorage.getItem("token");

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);


  const fetchCart = async () => {
    const token = getToken();

    if (!token) return;

    try {
      const res = await axios.get("http://localhost:8080/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(res.data);
    } catch (err) {
      console.error("Fetch cart error:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

 
  const addToCart = async (product) => {
    const token = getToken();

    // ❗ DO NOT redirect here
    if (!token) {
      throw new Error("NOT_LOGGED_IN");
    }

    try {
      await axios.post(
        "http://localhost:8080/cart/add",
        {
          productId: product.id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchCart();
    } catch (err) {
     
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        throw new Error("SESSION_EXPIRED");
      }

      console.error("Add error:", err.response?.data || err.message);
      throw err;
    }
  };

  
  const removeFromCart = async (productId) => {
    const token = getToken();
    if (!token) return;

    try {
      await axios.delete(
        `http://localhost:8080/cart/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCart();
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

 
  const increaseQty = async (productId, currentQty) => {
    const token = getToken();
    if (!token) return;

    try {
      await axios.put(
        "http://localhost:8080/cart/update",
        {
          productId,
          quantity: currentQty + 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCart();
    } catch (err) {
      console.error("Increase error:", err);
    }
  };

  
  const decreaseQty = async (productId, currentQty) => {
    if (currentQty <= 1) return;

    const token = getToken();
    if (!token) return;

    try {
      await axios.put(
        "http://localhost:8080/cart/update",
        {
          productId,
          quantity: currentQty - 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCart();
    } catch (err) {
      console.error("Decrease error:", err);
    }
  };

  
  const clearCart = async () => {
    const token = getToken();
    if (!token) return;

    try {
      await axios.delete("http://localhost:8080/cart/clear", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart([]);
    } catch (err) {
      console.error("Clear cart error:", err);
    }
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