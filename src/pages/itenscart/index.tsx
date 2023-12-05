import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

import { IoMdAddCircle } from "react-icons/io";
import { IoRemoveCircle } from "react-icons/io5";
import { Container } from "../../components/container";
import { Link } from "react-router-dom";

export interface CartItemProps {
  id: string;
  uid: string;
  price: number;
  name: string;
  amount: number;
  total: number;
  images: string;
}

export function ItemsCart() {
  const { addItemCart, removeItemCart, cart } = useContext(AuthContext);

  function addCart(item: CartItemProps) {
    addItemCart(item);
  }

  function removeCart(item: CartItemProps) {
    removeItemCart(item);
  }

  return (
    <Container>
      <h1 className="font-medium text-2xl text-center my-4">Meu carrinho</h1>

      {cart.length === 0 && (
        <div className="flex flex-col items-center justify-center">
          <h1 className="font-medium">Ops seu carrinho está vazio...</h1>

          <Link to="/" className="bg-red-500 text-white my-3 p-1 rounded">
            Acessar Produtos
          </Link>
        </div>
      )}

      {cart.map((item) => (
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
              onClick={() => removeCart(item)}
              className="bg-slate-600 rounded-full text-white font-medium flex items-center justify-center"
            >
              <IoRemoveCircle size={22} />
            </button>
            {item.amount}
            <button
              onClick={() => addCart(item)}
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

      {cart.length !== 0 && (
        <p className="font-bold mt-4">Total: R$ 150.000.00</p>
      )}
    </Container>
  );
}
