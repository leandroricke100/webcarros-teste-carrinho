import { useEffect, useState } from "react";
//import { AuthContext } from "../../contexts/AuthContext";

import { IoMdAddCircle } from "react-icons/io";
import { IoRemoveCircle } from "react-icons/io5";
import { Container } from "../../components/container";
import { Link } from "react-router-dom";

interface CartItemProps {
  id: string;
  uid: string;
  price: number;
  name: string;
  amount: number;
  total: number;
  images: string;
}

export function ItemsCart() {
  //const {} = useContext(AuthContext);
  const [cartItem, setCartItem] = useState<CartItemProps[]>([]);

  useEffect(() => {
    const myItem = localStorage.getItem("@webCarrosCart");

    setCartItem(myItem ? JSON.parse(myItem) : []);
  }, []);

  function addItemCart(item: CartItemProps) {
    const addAmount = cartItem.map((cartItem) => {
      if (cartItem.id === item.id) {
        return { ...cartItem, amount: cartItem.amount + 1 };
      }

      return cartItem;
    });

    setCartItem(addAmount);
    localStorage.setItem("@webCarrosCart", JSON.stringify(addAmount));
  }

  function removeItemCart(item: CartItemProps) {
    const removeAmount = cartItem.map((cartItem) => {
      if (cartItem.id === item.id) {
        if (cartItem.amount >= 1) {
          return { ...cartItem, amount: cartItem.amount - 1 };
        }
      }
      return cartItem;
    });

    const removeItem = removeAmount.filter((cartItem) => cartItem.amount > 0);

    setCartItem(removeItem);
    localStorage.setItem("@webCarrosCart", JSON.stringify(removeItem));
  }

  return (
    <Container>
      <h1 className="font-medium text-2xl text-center my-4">Meu carrinho</h1>

      {cartItem.length === 0 && (
        <div className="flex flex-col items-center justify-center">
          <h1 className="font-medium">Ops seu carrinho está vazio...</h1>

          <Link to="/" className="bg-red-500 text-white my-3 p-1 rounded">
            Acessar Produtos
          </Link>
        </div>
      )}

      {cartItem.map((item) => (
        <section
          key={item.id}
          className="flex items-center justify-around bg-white p-1 rounded-lg"
        >
          <div className="flex items-center gap-4 ">
            <img className="w-28  rounded-lg" src={item.images} />
            <div className="flex flex-col items-center ">
              <h1 className="font-bold">{item.name}</h1>
              <p>Ano 2021/2022</p>
            </div>
          </div>
          <strong>R$ {item.price}</strong>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => removeItemCart(item)}
              className="bg-slate-600 rounded-full text-white font-medium flex items-center justify-center"
            >
              <IoRemoveCircle size={22} />
            </button>
            {item.amount}
            <button
              onClick={() => addItemCart(item)}
              className="bg-slate-600 rounded-full text-white font-medium flex items-center justify-center"
            >
              <IoMdAddCircle size={22} />
            </button>
          </div>
          <strong className="float-right">
            Subtotal:{" "}
            {item?.total.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </strong>
        </section>
      ))}

      {cartItem.length !== 0 && (
        <p className="font-bold mt-4">Total: R$ 150.000.00</p>
      )}
    </Container>
  );
}
