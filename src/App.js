import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "./components/Header/Navbar";
import ProductTable from "./components/Product/ProductTable";
import Stock from "./components/Stocks/Stock";
import HistoryList from "./components/History/HistoryList";
import TransactionDetail from "./components/History/TransactionDetail";
import LoginForm from "./components/Auth/LoginForm";
import { ClipLoader } from "react-spinners";
function App() {
  const [products, setProducts] = useState([]);
  const [userSession, setUserSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserSession(user);
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userSession) return;
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const querySnapshot = await getDocs(
          collection(db, "users", `${userSession.uid}`, "products")
        );
        const fetchedProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [userSession]);

  if (checkingAuth) {
    return (
      <div className="loading-container">
        <ClipLoader color="#1e3a8a" loading={checkingAuth} size={50} />
      </div>
    );
  }
  if (!userSession) {
    return <LoginForm setUser={setUserSession} />;
  }

  if (loadingProducts) {
    return (
      <div className="loading-container">
        <ClipLoader color="#1e3a8a" loading={loadingProducts} size={50} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <Router>
        <Navbar setUser={setUserSession} />
        <Routes>
          <Route
            path="/"
            element={
              <ProductTable
                products={products}
                setProducts={setProducts}
                userSession={userSession}
              />
            }
          />

          <Route
            path="/stocks"
            element={
              <Stock
                products={products}
                setProducts={setProducts}
                userSession={userSession}
              />
            }
          />
          <Route
            path="/history"
            element={<HistoryList userSession={userSession} />}
          />
          <Route
            path="/history/:id"
            element={
              <TransactionDetail
                products={products}
                userSession={userSession}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
