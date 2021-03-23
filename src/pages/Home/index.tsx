import React, { useState, useEffect } from "react";
import { MdAddShoppingCart } from "react-icons/md";

import { ProductList } from "./styles";
import { api } from "../../services/api";
import { useCart } from "../../hooks/useCart";
import { log } from "node:console";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    sumAmount[product.id] += product.amount;
    return sumAmount;
  }, {} as CartItemsAmount);

  useEffect(() => {
    async function loadProducts() {
      const res = await api.get("/products");
      setProducts(res.data);
    }
    loadProducts();
  }, []);

  function handleAddProduct(id: number, product: Product) {
    addProduct(id, {
      ...product,
      amount: 0,
    });
  }

  return (
    <ProductList>
      {products.map((product) => (
        <li>
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>R$ {product.price}</span>
          <button
            type="button"
            data-testid="add-product-button"
            onClick={() => handleAddProduct(product.id, product)}
          >
            <div data-testid="cart-product-quantity">
              <MdAddShoppingCart size={16} color="#FFF" />
            </div>
            {cartItemsAmount[product.id] || 0}
            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
};

export default Home;
