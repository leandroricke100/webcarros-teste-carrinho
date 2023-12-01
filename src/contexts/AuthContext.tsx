import { ReactNode, createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../services/firebaseConnection";
import { collection, getDocs } from "firebase/firestore";

type AuthContextData = {
  signed: boolean;
  loadingAuth: boolean;
  handleInfoUser: ({ name, email, uid }: UserProps) => void;
  user: UserProps | null;
  cartAmount: number;
  cart: CartProps[];
  addItemCart: (newCar: CartProps) => void;
  remomeItemCart: (product: CartProps) => void;
  total: string;
};

interface CartProps {
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
  const [total, setTotal] = useState(" ");

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
    function loadCars() {
      const carsRef = collection(db, "cars");

      getDocs(carsRef).then((snapshot) => {
        const listcars = [] as CartProps[];

        snapshot.forEach((doc) => {
          const carData = doc.data();

          const amount = carData.amount !== undefined ? carData.amount : 1;
          const total = carData.total !== undefined ? 0 : carData.price;

          listcars.push({
            uid: doc.id,
            name: carData.name,
            images: carData.images,
            price: carData.price,
            amount: amount,
            total: total,
          });
        });
        setCart(listcars);
      });
    }

    loadCars();
  }, []);

  function addItemCart(newCar: CartProps) {
    const indexCar = cart.findIndex((item) => item.uid === newCar.uid);

    if (indexCar !== -1) {
      const itemList = cart;

      itemList[indexCar].amount = itemList[indexCar].amount + 1;
      itemList[indexCar].total =
        itemList[indexCar].amount * itemList[indexCar].price;

      setCart(itemList);
      totalResultPrice(itemList);
      return;
    }
    const data = {
      uid: newCar.uid,
      price: Number(newCar.price),
      name: newCar.name,
      amount: 1,
      total: Number(newCar.price),
      images: [],
    };

    setCart((items) => [...items, data]);
    totalResultPrice([...cart, data]);
  }

  function remomeItemCart(product: CartProps) {
    const indexItem = cart.findIndex((item) => item.uid === product.uid);

    if (cart[indexItem]?.amount > 1) {
      const cartList = cart;

      cartList[indexItem].amount = cartList[indexItem].amount - 1;
      cartList[indexItem].total =
        cartList[indexItem].total - cartList[indexItem].price;

      setCart(cartList);
      totalResultPrice(cartList);
      return;
    }

    const removeItem = cart.filter((item) => item.uid !== product.uid);
    setCart(removeItem);
    totalResultPrice(removeItem);
  }

  function totalResultPrice(item: CartProps[]) {
    const myCart = item;

    const result = myCart.reduce((acc, obj) => {
      return acc + obj.total;
    }, 0);

    const resultFormated = result.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    setTotal(resultFormated);
  }

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
        remomeItemCart,
        cart,
        total,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
