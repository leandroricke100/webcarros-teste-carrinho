import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

import { IoMdAddCircle } from "react-icons/io";
import { IoRemoveCircle } from "react-icons/io5";
import { Container } from "../../components/container";

export function ItemsCart() {
  const { cart, remomeItemCart, addItemCart, total } = useContext(AuthContext);

  return (
    <Container>
      <h1 className="font-medium text-2xl text-center my-4">Meu carrinho</h1>

      {cart.map((item) => (
        <section
          key={item.uid}
          className="flex items-center justify-around bg-white p-1 rounded-lg"
        >
          <div className="flex items-center gap-4 ">
            <img className="w-28  rounded-lg" src={item.images[0].url} />
            <div className="flex flex-col items-center ">
              <h1 className="font-bold">{item.name}</h1>
              <p>Ano 2021/2022</p>
            </div>
          </div>
          <strong>R$ {item.price}</strong>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => remomeItemCart(item)}
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
          <strong className="float-right">Subtotal: {item?.total}</strong>
        </section>
      ))}

      <p className="font-bold mt-4">Total: R$ {total}</p>
    </Container>
  );
}
