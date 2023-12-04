import { ReactNode, createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseConnection";

type AuthContextData = {
  signed: boolean;
  loadingAuth: boolean;
  handleInfoUser: ({ name, email, uid }: UserProps) => void;
  user: UserProps | null;
  cartAmount: number | null;
  cart: CartProps[];
  addItemCart: (newCar: CartProps) => void;
  //removeItemCart: (product: CartProps) => void;
  //total: string;
};

interface CartProps {
  id: string;
  uid: string;
  price: number;
  name: string;
  amount: number;
  total: number;
  images: ImagesCarProps[];
}

interface ImagesCarProps {
  name: string;
  uid: string;
  url: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface UserProps {
  uid: string;
  name: string | null;
  email: string | null;
}

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [cart, setCart] = useState<CartProps[]>([]);
  //const [total, setTotal] = useState(" ");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          name: user?.displayName,
          email: user?.email,
        });

        setLoadingAuth(false);
      } else {
        setUser(null);
        setLoadingAuth(false);
      }
    });

    return () => {
      unsub();
    };
  }, []);

  function addItemCart(newCar: CartProps) {
    const myCart = localStorage.getItem("@webCarrosCart");

    const saveCart = myCart ? JSON.parse(myCart) : [];

    const indexCar = saveCart.findIndex(
      (item: CartProps) => item.id === newCar.id
    );

    if (indexCar !== -1) {
      saveCart[indexCar].amount += 1;
      saveCart[indexCar].total =
        saveCart[indexCar].amount * saveCart[indexCar].price;
    } else {
      const data = {
        id: newCar.id,
        price: Number(newCar.price),
        name: newCar.name,
        amount: 1,
        total: Number(newCar.price),
        images: newCar.images[0].url,
      };
      saveCart.push(data);
    }
    setCart(saveCart);
    localStorage.setItem("@webCarrosCart", JSON.stringify(saveCart));
  }

  // function removeItemCart(product: CartProps) {
  //   const indexItem = cart.findIndex((item) => item.uid === product.uid);

  //   if (cart[indexItem]?.amount > 1) {
  //     const cartList = cart;

  //     cartList[indexItem].amount = cartList[indexItem].amount - 1;
  //     cartList[indexItem].total =
  //       cartList[indexItem].total - cartList[indexItem].price;

  //     setCart(cartList);
  //     totalResultPrice(cartList);
  //     return;
  //   }

  //   const removeItem = cart.filter((item) => item.uid !== product.uid);
  //   setCart(removeItem);
  //   totalResultPrice(removeItem);
  // }

  // function totalResultPrice(item: CartProps[]) {
  //   const myCart = item;

  //   const result = myCart.reduce((acc, obj) => {
  //     return acc + obj.total;
  //   }, 0);

  //   const resultFormated = result.toLocaleString("pt-BR", {
  //     style: "currency",
  //     currency: "BRL",
  //   });

  //   setTotal(resultFormated);
  // }

  function handleInfoUser({ name, email, uid }: UserProps) {
    setUser({
      name,
      email,
      uid,
    });
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        loadingAuth,
        handleInfoUser,
        user,
        cartAmount: cart.length,
        addItemCart,
        //removeItemCart,
        cart,
        //total,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
