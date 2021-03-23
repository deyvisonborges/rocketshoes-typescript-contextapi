import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number, product: Product) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    let storagedCart = localStorage.getItem("@RocketShoes:cart");
    if (storagedCart) return JSON.parse(storagedCart);
    return [];
  });

  console.log(cart);

  const addProduct = async (productId: number, product: Product) => {
    try {
      let tmpCart = cart;
      let wasSelected = cart.filter((item) => {
        if (item.id === product.id) {
          product.amount++;
          return item;
        }
      });

      if (wasSelected) {
        setCart([product]);
      }

      tmpCart.push(product);
      setCart(tmpCart);

      localStorage.setItem("@RocketShoes:cart", JSON.stringify(cart));
    } catch (err) {
      console.log(err);
    }
  };

  const removeProduct = (productId: number) => {
    try {
      let cartUpdated = cart.filter((item) => item.id !== productId);
      setCart(cartUpdated);
      localStorage.setItem("@RocketShoes:cart", JSON.stringify(cartUpdated));
    } catch (err) {
      console.log(err);
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      cart.filter((item) => (item.amount = amount));
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
