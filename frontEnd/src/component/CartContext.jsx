import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const getProductId = (product) =>
  product?.id || product?._id || "";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("ectoo-cart");
      const parsedCart = savedCart
        ? JSON.parse(savedCart)
        : [];

      return Array.isArray(parsedCart)
        ? parsedCart
        : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "ectoo-cart",
        JSON.stringify(cartItems)
      );
    } catch {
      return;
    }
  }, [cartItems]);

  const addToCart = (product) => {
    const productId = getProductId(product);

    if (!productId) {
      return;
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => getProductId(item) === productId
      );

      if (existingItem) {
        return currentItems.map((item) =>
          getProductId(item) === productId
            ? {
                ...item,
                id: productId,
                quantity:
                  Number(item.quantity || 0) + 1,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          id: productId,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) => getProductId(item) !== productId
      )
    );
  };

  const updateQuantity = (
    productId,
    quantity
  ) => {
    const safeQuantity = Number(quantity);

    if (
      !Number.isFinite(safeQuantity) ||
      safeQuantity <= 0
    ) {
      removeFromCart(productId);
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        getProductId(item) === productId
          ? {
              ...item,
              id: productId,
              quantity: safeQuantity,
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total +
          Number(item.quantity || 0),
        0
      ),
    [cartItems]
  );

  const cartSubtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total +
          Number(item.price || 0) *
            Number(item.quantity || 0),
        0
      ),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      cartSubtotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [cartItems, cartCount, cartSubtotal]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
};

export default CartContext;
