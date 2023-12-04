import { useState, useEffect, useContext } from "react";
import { Container } from "../../components/container";
import { Link } from "react-router-dom";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { BsCartPlus } from "react-icons/bs";
import { db } from "../../services/firebaseConnection";
import { CgSpinner } from "react-icons/cg";
import { AuthContext } from "../../contexts/AuthContext";

export interface CarsProps {
  id: string;
  name: string;
  year: string;
  uid: string;
  price: number;
  city: string;
  km: string;
  images: CarImageProps[];
}

interface CarImageProps {
  name: string;
  uid: string;
  url: string;
}

export function Home() {
  const { addItemCart } = useContext(AuthContext);
  const [cars, setCars] = useState<CarsProps[]>([]);
  const [loadImages, setLoadImages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    loadCars();
  }, []);

  function loadCars() {
    const carsRef = collection(db, "cars");
    const queryRef = query(carsRef, orderBy("created", "desc"));

    getDocs(queryRef).then((snapshot) => {
      const listcars = [] as CarsProps[];

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

      setCars(listcars);
    });
  }

  function handleImageLoad(id: string) {
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id]);
  }

  async function handleSearchCAr() {
    if (input == "") {
      loadCars();
      return;
    }

    setCars([]);
    setLoadImages([]);

    const q = query(
      collection(db, "cars"),
      where("name", ">=", input.toUpperCase()),
      where("name", "<=", input.toUpperCase() + "\uf8ff")
    );

    const querySnapshot = await getDocs(q);

    const listcars = [] as CarsProps[];

    querySnapshot.forEach((doc) => {
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

    setCars(listcars);
  }

  function handleAddCartItem(car: CarsProps) {
    addItemCart(car);
  }

  return (
    <Container>
      <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
        <input
          className="w-full border-2 rounded-lg h-9 px-3 outline-none"
          placeholder="Digite o nome do carro"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleSearchCAr}
          className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg"
        >
          Buscar
        </button>
      </section>

      <h1 className="font-bold text-center mt-6 text-2xl mb-4">
        Carros novos e usados em todo o Brasil
      </h1>

      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <div key={car.id}>
            <section className="w-full bg-white rounded-lg">
              <Link to={`/car/${car.id}`}>
                <div
                  className="w-full h-72 flex items-center justify-center rounded-lg bg-slate-200"
                  style={{
                    display: loadImages.includes(car.id) ? "none" : "visible",
                  }}
                >
                  <CgSpinner size={60} className="animate-spin " />
                </div>
                <img
                  className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
                  src={car.images[0].url}
                  alt="carro"
                  onLoad={() => handleImageLoad(car.id)}
                />
                <p className="font-bold mt-1 mb-2 px-2">{car.name}</p>
              </Link>

              <div className="flex flex-col px-2">
                <span className="text-zinc-500 mb-6">
                  Ano {car.year} | {car.km} km
                </span>
                <strong className="text-black font-medium text-xl">
                  R${" "}
                  {car.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </strong>

                <button
                  className="bg-red-600 p-1 hover:opacity-80 rounded flex items-center justify-center my-2"
                  onClick={() => handleAddCartItem(car)}
                >
                  <BsCartPlus size={20} color="#fff" />
                </button>
              </div>

              <div className="w-full h-px bg-slate-200 my-2"></div>

              <div className="px-2 pb-2">
                <span className="text-zinc-500">{car.city}</span>
              </div>
            </section>
          </div>
        ))}
      </main>
    </Container>
  );
}
