import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

import { IoMdAddCircle } from "react-icons/io";
import { IoRemoveCircle } from "react-icons/io5";
import { Container } from "../../components/container";
import { Link } from "react-router-dom";

import { useMediaQuery } from "react-responsive";

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
  const { addItemCart, removeItemCart, cart, total } = useContext(AuthContext);

  function addCart(item: CartItemProps) {
    addItemCart(item);
  }

  function removeCart(item: CartItemProps) {
    removeItemCart(item);
  }

  const isDesktopOrLaptop = useMediaQuery({ minWidth: 768 });

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
          //className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          className="grid grid-cols-1 gap-4  bg-white p-2 rounded-lg mb-2 md:flex items-center justify-between "
        >
          <div className="flex items-center">
            <img className="w-28  rounded-lg mr-3" src={item.images} />

            <h1 className="font-bold ">{item.name}</h1>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              {!isDesktopOrLaptop && <p className="mb-2">Preço:</p>}
              <strong>R$ {item.price}</strong>
            </div>
            <div className=" flex flex-col">
              {!isDesktopOrLaptop && <p className="mb-2">Quantidade:</p>}
              <div className="flex gap-3">
                <button
                  onClick={() => removeCart(item)}
                  className="bg-black rounded-full text-white font-medium flex items-center justify-center"
                >
                  <IoRemoveCircle size={22} />
                </button>
                <span className="font-semibold">{item.amount}</span>

                <button
                  onClick={() => addCart(item)}
                  className="bg-black rounded-full text-white font-medium flex items-center justify-center"
                >
                  <IoMdAddCircle size={22} />
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <strong className="text-slate-600">
              Total:{" "}
              {item?.total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </strong>
          </div>
        </section>
      ))}

      {cart.length !== 0 && <p className="font-bold mt-4">Total: {total}</p>}
    </Container>
  );
}
