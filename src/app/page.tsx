"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase-config";

import LastPosts from "@/app/LastPosts";
import AllPosts from "@/app/AllPosts";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Importa react-select para el multi-select
import Select from "react-select";

interface Post {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  timestamp: { seconds: number; nanoseconds: number };
  thumbnailUrl: string;
  categories: string[];
  authorUid: string;
}

interface FilterState {
  title: string;
  categories: string[];
  startDate: string;
  endDate: string;
}

const POSTS_PER_PAGE = 6; // Posts por página para paginación (para el listado principal)

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Estados temporales para los filtros (mientras se editan)
  const [tempTitle, setTempTitle] = useState("");
  const [tempCategories, setTempCategories] = useState<string[]>([]);
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");

  // Estados aplicados (se usan para filtrar)
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    title: "",
    categories: [],
    startDate: "",
    endDate: "",
  });

  // Estado para la página actual (paginación para el listado principal)
  const [currentPage, setCurrentPage] = useState(1);

  // Mapa de datos de autores (se llena en fetchPosts)
  const [authorsMap, setAuthorsMap] = useState<{
    [uid: string]: { username: string; linkedIn?: string };
  }>({});

  const fetchPosts = async (reset = false) => {
    setLoading(true);
    setError("");
    try {
      const postsRef = collection(db, "posts");
      let q = query(
        postsRef,
        orderBy("timestamp", "desc"),
        limit(POSTS_PER_PAGE)
      );

      if (!reset && lastVisible) {
        q = query(
          postsRef,
          orderBy("timestamp", "desc"),
          startAfter(lastVisible),
          limit(POSTS_PER_PAGE)
        );
      }

      const snapshot = await getDocs(q);
      const newPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];

      setPosts((prevPosts) => (reset ? newPosts : [...prevPosts, ...newPosts]));
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === POSTS_PER_PAGE);

      // Extraer UIDs únicos de los posts recién cargados
      const uids = Array.from(new Set(newPosts.map((post) => post.authorUid)));
      if (uids.length > 0) {
        const usersRef = collection(db, "users");
        // Nota: La consulta "in" soporta hasta 10 elementos
        const qUsers = query(usersRef, where("uid", "in", uids));
        const usersSnapshot = await getDocs(qUsers);
        const newAuthors: {
          [uid: string]: { username: string; linkedIn?: string };
        } = {};
        usersSnapshot.forEach((doc) => {
          const data = doc.data();
          newAuthors[data.uid] = {
            username: data.username,
            linkedIn: data.linkedIn,
          };
        });
        setAuthorsMap((prev) => ({ ...prev, ...newAuthors }));
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("There was an error loading the posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(true);
  }, []);

  // Función para filtrar posts según filtros aplicados
  const filteredPosts = posts.filter((post) => {
    const matchesTitle =
      appliedFilters.title.trim() === "" ||
      post.title.toLowerCase().includes(appliedFilters.title.toLowerCase());

    // Si no se seleccionó ninguna categoría, se muestran todos.
    // Si se seleccionaron, se verifica que al menos una categoría del post
    // coincida (condición OR).
    const matchesCategory =
      appliedFilters.categories.length === 0 ||
      appliedFilters.categories.some((selectedCat) =>
        post.categories.some((cat) =>
          cat.toLowerCase().includes(selectedCat.toLowerCase())
        )
      );

    // Verificar si la fecha del post está dentro del intervalo (si se definieron ambas)
    let matchesDate = true;
    if (appliedFilters.startDate && appliedFilters.endDate) {
      const postDate = new Date(post.timestamp.seconds * 1000);
      const start = new Date(appliedFilters.startDate);
      const end = new Date(appliedFilters.endDate);
      matchesDate = postDate >= start && postDate <= end;
    }
    return matchesTitle && matchesCategory && matchesDate;
  });

  // Para el carrusel, usamos los 4 primeros posts
  const carouselPosts = posts.slice(0, 4);

  // Para el listado principal, usamos el resto y aplicamos paginación
  const mainPosts = filteredPosts.slice(4);
  const totalPages = Math.ceil(mainPosts.length / POSTS_PER_PAGE);
  const currentPosts = mainPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // Opciones fijas para el select múltiple de categorías
  const categoryOptions = [
    { value: "Technology", label: "Technology" },
    { value: "Health", label: "Health" },
    { value: "Finance", label: "Finance" },
    { value: "Education", label: "Education" },
    { value: "Entertainment", label: "Entertainment" },
    { value: "News", label: "News" },
    { value: "Tutorials", label: "Tutorials" },
    { value: "Projects", label: "Projects" },
    { value: "Guides", label: "Guides" },
    { value: "Tips", label: "Tips" },
  ];

  // Sidebar links (dummy data)
  const sidebarLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Archive", href: "/archive" },
    { name: "LinkedIn", href: "https://www.linkedin.com/company/nova-devs-eu/" },
    { name: "GitHub", href: "https://github.com/novadevseu" },
    { name: "Our Website", href: "https://your-portfolio.com" },
  ];

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Función que se llama al pulsar "Apply Filters"
  const applyFilters = () => {
    setAppliedFilters({
      title: tempTitle,
      categories: tempCategories,
      startDate: tempStartDate,
      endDate: tempEndDate,
    });
    setCurrentPage(1); // Reinicia a la página 1 al aplicar filtros
  };

  const clearFilters = () => {
    setTempTitle("");
    setTempCategories([]);
    setTempStartDate("");
    setTempEndDate("");
    setAppliedFilters({
      title: "",
      categories: [],
      startDate: "",
      endDate: "",
    });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen">
      {/* Banner Section */}
      <h2
        className="font-semibold text-center font-sans mb-8 border-t-2 border-b-2 border-white"
        id="title"
      >
        Coffee<span style={{ color: "#E0C600" }}>Script</span> & Chill
      </h2>

      {/* Carousel Section */}
      <LastPosts
        posts={carouselPosts}
        authorsMap={authorsMap}
        loading={loading && posts.length === 0}
      />

      {/* Filtros */}
      <div className="container mx-auto px-4 py-4">
        <h3 className="text-xl font-semibold mb-4">Filter Posts</h3>
        <div className="flex flex-wrap gap-4 items-end">
          {/* Filtro por título */}
          <div>
            <label className="block mb-1">Title</label>
            <input
              type="text"
              placeholder="Filter by title"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              className="text-black px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          {/* Filtro por categorías usando react-select */}
          <div className="min-w-[200px]">
            <label className="block mb-1">Categories</label>
            <Select
              isMulti
              options={categoryOptions}
              value={categoryOptions.filter((opt) =>
                tempCategories.includes(opt.value)
              )}
              onChange={(selected) =>
                setTempCategories(selected.map((option) => option.value))
              }
              className="text-black"
            />
          </div>

          {/* Filtro por intervalo de fecha */}
          <div>
            <label className="block mb-1">Start Date</label>
            <input
              type="date"
              value={tempStartDate}
              onChange={(e) => setTempStartDate(e.target.value)}
              className="text-black px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">End Date</label>
            <input
              type="date"
              value={tempEndDate}
              onChange={(e) => setTempEndDate(e.target.value)}
              className="text-black px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          {/* Botones para aplicar/limpiar filtros */}
          <div className="flex gap-2">
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Listado de posts con paginación */}
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Left Column (Posts) */}
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-bold mb-4">Posts</h2>
          {loading && posts.length === 0 ? (
            <Skeleton count={6} height={200} />
          ) : (
            <AllPosts
              posts={currentPosts}
              authorsMap={authorsMap}
              loading={loading && posts.length === 0}
            />
          )}

          {/* Controles de paginación */}
          <div className="flex justify-center items-center mt-8 gap-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  prev < totalPages ? prev + 1 : prev
                )
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Right Column (Sticky Sidebar) */}
        <div className="w-full md:w-1/2">
          <div className="p-4 sticky top-0">
            <h3 className="text-xl font-semibold mb-4">Learn More</h3>
            <ul className="space-y-2">
              {sidebarLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-blue-600 hover:underline">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <button
                onClick={scrollToTop}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Back to Top
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-center text-red-500">{error}</p>}
    </div>
  );
};

export default HomePage;
