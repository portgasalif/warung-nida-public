import { useState } from "react";
import { updateDoc, doc, addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import styles from "./ProductTable.module.css";
import "../shared.css";

const ProductTable = ({ products, setProducts, userSession }) => {
  const [cart, setCart] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const total = Object.entries(cart).reduce((accumulator, [id, qty]) => {
    const product = products.find((p) => p.id === id);
    return accumulator + (product?.price * qty || 0);
  }, 0);

  const handleIncrease = (productId) => {
    const product = products.find((p) => p.id === productId);
    const currentQty = cart[productId] || 0;

    if (product && currentQty < product.stock) {
      setCart((prevCart) => ({
        ...prevCart,
        [productId]: (prevCart[productId] || 0) + 1,
      }));
    } else {
      alert("Stok tidak mencukupi!");
    }
  };

  const handleDecrease = (productId) => {
    const currentQty = cart[productId] || 0;
    if (currentQty > 0) {
      setCart((prevCart) => ({
        ...prevCart,
        [productId]: Math.max((prevCart[productId] || 0) - 1, 0),
      }));
    } else {
      alert("Jumlah produk tidak bisa kurang dari 0!");
    }
  };

  const handleCheckout = async () => {
    if (Object.keys(cart).length === 0) {
      alert("Keranjang belanja kosong!");
      return;
    }

    try {
      setIsLoading(true);
      await Promise.all(
        Object.entries(cart).map(async ([productId, qty]) => {
          const product = products.find((p) => p.id === productId);
          return updateDoc(
            doc(db, "users", `${userSession.uid}`, "products", productId),
            {
              stock: product.stock - qty,
            }
          );
        })
      );

      await addDoc(
        collection(db, "users", `${userSession.uid}`, "transactions"),
        {
          items: cart,
          total: total,
          timestamp: new Date(),
          date: new Date().toLocaleString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        }
      );

      setProducts((prevProducts) =>
        prevProducts.map((product) => {
          const cartQty = cart[product.id] || 0;
          return cartQty > 0
            ? {
                ...product,
                stock: product.stock - cartQty,
              }
            : product;
        })
      );
      setCart({});
      alert("Checkout berhasil!");
      setIsLoading(false);
    } catch (error) {
      alert("Gagal melakukan checkout!");
      setIsLoading(false);
    }
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  return (
    <>
      <div className={styles.productContainer}>
        <div className={styles.header}>
          <h1>Warung Nida</h1>
        </div>
        <input
          type="text"
          placeholder="Cari Produk.."
          value={searchTerm}
          onChange={handleSearch}
          className="searchBar"
        />
        {products
          .filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((product) => (
            <div key={product.id} className="productRow">
              <div className="productInfo">
                <h2>{product.name}</h2>
                <h3>Rp {product.price.toLocaleString("id-ID")}</h3>
                <h3>Stock: {product.stock - (cart[product.id] || 0)}</h3>
              </div>
              <div className="productActions">
                {cart[product.id] > 0 && (
                  <button onClick={() => handleDecrease(product.id)}>-</button>
                )}
                <input
                  type="number"
                  min="0"
                  max={product.stock}
                  value={cart[product.id] || 0}
                  onChange={(e) => {
                    const unit = Math.max(
                      0,
                      Math.min(parseInt(e.target.value) || 0, product.stock)
                    );
                    setCart((prevCart) => ({
                      ...prevCart,
                      [product.id]: unit,
                    }));
                  }}
                  className={styles.quantityInput}
                />
                <button onClick={() => handleIncrease(product.id)}>+</button>
              </div>
            </div>
          ))}
      </div>
      {total > 0 && (
        <div className={styles.total}>
          <span>Total: Rp {total.toLocaleString("id-ID")}</span>
          <button
            className={styles.checkoutButton}
            onClick={handleCheckout}
            disabled={isLoading}
          >
            {isLoading ? "Proses..." : "Bayar"}
          </button>
        </div>
      )}
    </>
  );
};

export default ProductTable;
