import { useState, useEffect, useContext } from "react";
import { Container } from "../../components/container";
import { DashboardHeader } from "../../components/panelheader";

import {
  collection,
  getDocs,
  where,
  query,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db, storage } from "../../services/firebaseConnection";
import { deleteObject, ref } from "firebase/storage";
import { AuthContext } from "../../contexts/AuthContext";

import { FiTrash2 } from "react-icons/fi";

interface CarProps {
  id: string;
  name: string;
  year: string;
  price: number | string;
  city: string;
  km: string;
  images: ImageCarProps[];
  uid: string;
}

interface ImageCarProps {
  uid: string;
  name: string;
  url: string;
}

export function Dashboard() {
  const [cars, setCars] = useState<CarProps[]>([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    function loadCars() {
      if (!user) {
        return;
      }

      const carsRef = collection(db, "cars");
      const queryRef = query(carsRef, where("uid", "==", user.uid));

      getDocs(queryRef).then((snapshot) => {
        const listcars = [] as CarProps[];

        snapshot.forEach((doc) => {
          listcars.push({
            id: doc.id,
            name: doc.data().name,
            year: doc.data().year,
            km: doc.data().km,
            city: doc.data().city,
            images: doc.data().images,
            price: doc.data().price,
            uid: doc.data().uid,
          });
        });
        console.log(listcars);
        setCars(listcars);
      });
    }

    loadCars();
  }, [user]);

  async function handleDeleteCar(car: CarProps) {
    const itemsCar = car;

    const docRef = doc(db, "cars", itemsCar.id);
    await deleteDoc(docRef);

    itemsCar.images.map(async (image) => {
      const imagePath = `images/${image.uid}/${image.name}`;
      const imageRef = ref(storage, imagePath);

      try {
        await deleteObject(imageRef);
        setCars(cars.filter((car) => car.id !== itemsCar.id));
      } catch (erro) {
        /* empty */
      }
    });
  }

  return (
    <Container>
      <DashboardHeader />
      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <section key={car.id} className="w-full bg-white rounded-lg relative">
            <button
              className="absolute bg-white  w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow"
              onClick={() => handleDeleteCar(car)}
            >
              <FiTrash2 size={26} color="#000" />
            </button>
            <img
              className="w-full rounded-lg mb-2 max-h-70"
              src={car.images[0].url}
            />
            <p className="font-bold mt-1 px-2 mb-2">{car.name}</p>

            <div className="flex flex-col px-2">
              <span className="text-zinc-500">
                Ano {car.year} | {car.km} km
              </span>
              <strong>R$ {car.price}</strong>
            </div>

            <div className=" w-full h-px bg-slate-200 my-2"></div>
            <div className="px-2 pb-2">
              <span className="text-black">{car.city}</span>
            </div>
          </section>
        ))}
      </main>
    </Container>
  );
}
