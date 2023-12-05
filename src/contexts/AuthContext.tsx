import { ReactNode, createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseConnection";

type AuthContextData = {
  signed: boolean;
  loadingAuth: boolean;
  handleInfoUser: ({ name, email, uid }: UserProps) => void;
  user: UserProps | null;
  cartAmount: number;
  cart: CartItemProps[];
  addItemCart: (newCar: CartItemProps) => void;
  removeItemCart: (product: CartItemProps) => void;
  //total: string;
};

interface CartItemProps {
  id: string;
  uid: string;
  price: number;
  name: string;
  amount: number;
  total: number;
  images: string;
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
  const [cart, setCart] = useState<CartItemProps[]>([]);
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

  useEffect(() => {
    const myItem = localStorage.getItem("@webCarrosCart");

    setCart(myItem ? JSON.parse(myItem) : []);
  }, []);

  function addItemCart(item: CartItemProps) {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (!existingItem) {
      const newItem = {
        ...item,
        amount: 1,
      };

      setCart([...cart, newItem]);
      localStorage.setItem(
        "@webCarrosCart",
        JSON.stringify([...cart, newItem])
      );
    } else {
      const updateCart = cart.map((cartItem) => {
        if (cartItem.id === item.id) {
          return {
            ...cartItem,
            amount: cartItem.amount + 1,
            total: cartItem.amount * cartItem.price,
          };
        }

        return cartItem;
      });

      setCart(updateCart);
      localStorage.setItem("@webCarrosCart", JSON.stringify(updateCart));
    }
  }

  function removeItemCart(item: CartItemProps) {
    const removeAmount = cart.map((cartItem) => {
      if (cartItem.id === item.id) {
        if (cartItem.amount >= 1) {
          return { ...cartItem, amount: cartItem.amount - 1 };
        }
      }
      return cartItem;
    });

    const removeItem = removeAmount.filter((cartItem) => cartItem.amount > 0);

    setCart(removeItem);
    localStorage.setItem("@webCarrosCart", JSON.stringify(removeItem));
  }

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
        removeItemCart,
        cart,
        //total,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
