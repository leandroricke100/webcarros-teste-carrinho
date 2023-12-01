import { ReactNode, createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../services/firebaseConnection";
import { CarsProps } from "../pages/home/index";
import { collection, getDocs } from "firebase/firestore";

type AuthContextData = {
  signed: boolean;
  loadingAuth: boolean;
  handleInfoUser: ({ name, email, uid }: UserProps) => void;
  user: UserProps | null;
  cartAmount: number;
  cart: CartProps[];
  addItemCart: (newCar: CarsProps) => void;
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
          listcars.push({
            uid: doc.id,
            name: doc.data().name,
            images: doc.data().images,
            price: doc.data().price,
            amount: doc.data().amount,
            total: doc.data().total,
          });
        });

        setCart(listcars);
      });
    }

    loadCars();
  }, []);

  function addItemCart(newCar: CarsProps) {
    const indexCar = cart.findIndex((item) => item.uid === newCar.id);

    if (indexCar !== -1) {
      const itemList = cart;

      itemList[indexCar].amount = itemList[indexCar].amount + 1;
      itemList[indexCar].total =
        itemList[indexCar].amount * itemList[indexCar].price;

      setCart(itemList);
      return;
    }
    const data = {
      uid: newCar.id,
      price: Number(newCar.price),
      name: newCar.name,
      amount: 1,
      total: newCar.price,
      images: [],
    };

    setCart((items) => [...items, data]);
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
        cart,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
