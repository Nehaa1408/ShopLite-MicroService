import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const getToken = () => localStorage.getItem("token");

const BASE = `${import.meta.env.VITE_API_URL}/api/cart`;

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // ================= FETCH CART =================
  const fetchCart = async () => {
    const token = getToken();

    // ================= GUEST USER =================
    if (!token || token === "null" || token === "undefined") {
      const guestCart =
        JSON.parse(localStorage.getItem("guest_cart")) || [];

      setCart(guestCart);

      return guestCart;
    }

    // ================= LOGGED IN USER =================
    try {
      const res = await axios.get(BASE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(res.data);

      return res.data;
    } catch (err) {
      if ([401, 403].includes(err.response?.status)) {
        console.warn("Session expired → clearing token");

        localStorage.removeItem("token");

        const guestCart =
          JSON.parse(localStorage.getItem("guest_cart")) || [];

        setCart(guestCart);

        return guestCart;
      }

      console.error("Fetch cart error:", err);

      return [];
    }
  };

  // ================= MERGE GUEST CART AFTER LOGIN =================
  const mergeGuestCartAfterLogin = async () => {
    const token = getToken();

    if (!token) return;

    const guestCart =
      JSON.parse(localStorage.getItem("guest_cart")) || [];

    // NO ITEMS
    if (guestCart.length === 0) {
      await fetchCart();
      return;
    }

    try {
      for (const item of guestCart) {
        await axios.post(
          BASE,
          {
            productId: item.productId,
            quantity: item.quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // CLEAR GUEST CART
      localStorage.removeItem("guest_cart");

      // LOAD DATABASE CART
      await fetchCart();
    } catch (err) {
      console.error("Merge cart error:", err);
    }
  };

  // ================= INITIAL LOAD =================
  useEffect(() => {
    const token = getToken();

    // LOGGED IN USER
    if (token) {
      fetchCart();
    }

    // GUEST USER
    else {
      const guestCart =
        JSON.parse(localStorage.getItem("guest_cart")) || [];

      setCart(guestCart);
    }
  }, []);

  // ================= ADD TO CART =================
  const addToCart = async (product) => {
    const token = getToken();

    // ================= GUEST USER =================
    if (!token) {
      const guestCart =
        JSON.parse(localStorage.getItem("guest_cart")) || [];

      const existingItem = guestCart.find(
        (item) => item.productId === product.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        guestCart.push({
          productId: product.id,

          productName:
            product.productName ||
            product.name,

          price:
            product.priceValue ||
            product.price,

          imageUrl:
            product.imageUrl ||
            product.image ||
            product.imagePath,

          quantity: 1,
        });
      }

      localStorage.setItem(
        "guest_cart",
        JSON.stringify(guestCart)
      );

      setCart(guestCart);

      return;
    }

    // ================= LOGGED IN USER =================
    try {
      await axios.post(
        BASE,
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
      if ([401, 403, 400].includes(err.response?.status)) {
        localStorage.removeItem("token");

        throw new Error("SESSION_EXPIRED");
      }

      throw err;
    }
  };

  // ================= REMOVE ITEM =================
  const removeFromCart = async (cartId) => {
    const token = getToken();

    // ================= GUEST USER =================
    if (!token) {
      const guestCart =
        JSON.parse(localStorage.getItem("guest_cart")) || [];

      const updatedCart = guestCart.filter(
        (item) => item.productId !== cartId
      );

      localStorage.setItem(
        "guest_cart",
        JSON.stringify(updatedCart)
      );

      setCart(updatedCart);

      return;
    }

    // ================= LOGGED IN USER =================
    try {
      await axios.delete(`${BASE}/${cartId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchCart();
    } catch (err) {
      console.error(
        "Remove cart item error:",
        err.response?.data || err
      );
    }
  };

  // ================= INCREASE QTY =================
  const increaseQty = async (cartId, currentQty) => {
    const token = getToken();

    // ================= GUEST USER =================
    if (!token) {
      const guestCart =
        JSON.parse(localStorage.getItem("guest_cart")) || [];

      const updatedCart = guestCart.map((item) =>
        item.productId === cartId
          ? {
            ...item,
            quantity: item.quantity + 1,
          }
          : item
      );

      localStorage.setItem(
        "guest_cart",
        JSON.stringify(updatedCart)
      );

      setCart(updatedCart);

      return;
    }

    // ================= LOGGED IN USER =================
    try {
      const response = await axios.put(
        `${BASE}/${cartId}`,
        {
          quantity: currentQty + 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("INCREASE RESPONSE:", response.data);

      const updatedCart = await fetchCart();

      console.log("UPDATED CART AFTER INCREASE:", updatedCart);
    } catch (err) {
      console.error(
        "INCREASE ERROR:",
        err.response?.data || err
      );
    }
  };

  // ================= DECREASE QTY =================
  const decreaseQty = async (cartId, currentQty) => {
    if (currentQty <= 1) return;

    const token = getToken();

    // ================= GUEST USER =================
    if (!token) {
      const guestCart =
        JSON.parse(localStorage.getItem("guest_cart")) || [];

      const updatedCart = guestCart.map((item) =>
        item.productId === cartId
          ? {
            ...item,
            quantity: item.quantity - 1,
          }
          : item
      );

      localStorage.setItem(
        "guest_cart",
        JSON.stringify(updatedCart)
      );

      setCart(updatedCart);

      return;
    }

    // ================= LOGGED IN USER =================
    try {
      const response = await axios.put(
        `${BASE}/${cartId}`,
        {
          quantity: currentQty - 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("DECREASE RESPONSE:", response.data);

      const updatedCart = await fetchCart();

      console.log("UPDATED CART AFTER DECREASE:", updatedCart);
    } catch (err) {
      console.error(
        "DECREASE ERROR:",
        err.response?.data || err
      );
    }
  };

  // ================= CLEAR CART =================
  const clearCart = async () => {
    const token = getToken();

    // ================= GUEST USER =================
    if (!token) {
      localStorage.removeItem("guest_cart");

      setCart([]);

      return;
    }

    // ================= LOGGED IN USER =================
    try {
      await axios.delete(`${BASE}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart([]);
    } catch (err) {
      console.error(
        "Clear cart error:",
        err.response?.data || err
      );
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
        fetchCart,
        mergeGuestCartAfterLogin,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};