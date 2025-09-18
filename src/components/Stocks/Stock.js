import styles from "./Stock.module.css";
import "../shared.css";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useState } from "react";

const Stock = ({ products, setProducts, userSession }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productUnit, setProductUnit] = useState("pcs");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (productId) => {
    try {
      await deleteDoc(
        doc(db, "users", `${userSession.uid}`, "products", productId)
      );
      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== productId)
      );
    } catch (error) {
      alert("Gagal menghapus produk!");
    }
  };

  const handleDeleteClick = (productId) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
      handleDelete(productId);
    }
  };

  const handleEdit = (productId) => {
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product);
    setIsModalOpen(true);
    setProductName(product.name);
    setProductPrice(product.price);
    setProductStock(product.stock);
    setProductUnit(product.unit || "pcs");
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const resetFormFields = () => {
    setProductName("");
    setProductPrice("");
    setProductStock("");
    setSelectedProduct(null);
    setProductUnit("pcs");
  };

  const resetAndCloseModal = () => {
    resetFormFields();
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    resetFormFields();
    setIsModalOpen(true);
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (
      productName.trim() === "" ||
      productPrice === "" ||
      productStock === ""
    ) {
      alert("Semua field harus diisi!");
      return;
    }

    const price = parseInt(productPrice, 10);
    const stock =
      productUnit === "pcs"
        ? parseInt(productStock, 10)
        : parseFloat(productStock);
    if (isNaN(price) || isNaN(stock) || price <= 0 || stock < 0) {
      alert("Harga dan stok harus berupa angka yang valid!");
      return;
    }

    const productData = {
      name: productName.trim(),
      price,
      stock,
      unit: productUnit,
    };

    try {
      setIsLoading(true);
      if (selectedProduct) {
        await updateDoc(
          doc(
            db,
            "users",
            `${userSession.uid}`,
            "products",
            selectedProduct.id
          ),
          productData
        );
        setProducts(
          products.map((product) =>
            product.id === selectedProduct.id
              ? { ...product, ...productData }
              : product
          )
        );
        alert("Produk berhasil diupdate!");
      } else {
        const docRef = await addDoc(
          collection(db, "users", `${userSession.uid}`, "products"),
          productData
        );
        const newProduct = { id: docRef.id, ...productData };
        setProducts((prevProducts) => [...prevProducts, newProduct]);
        alert("Produk berhasil ditambahkan!");
      }
      resetAndCloseModal();
      setIsLoading(false);
    } catch (error) {
      alert(
        selectedProduct
          ? "Gagal mengupdate produk!"
          : "Gagal menambahkan produk!"
      );
      setIsLoading(false);
    }
  };
  return (
    <div className="productContainer">
      <div className={styles.stockHeader}>
        <h1>Stok Produk</h1>
        <button className={styles.addProductButton} onClick={handleOpenModal}>
          +
        </button>
      </div>
      <input
        type="text"
        placeholder="Cari Produk.."
        value={searchTerm}
        onChange={handleSearch}
        className="searchBar"
      />
      {products
        .slice()
        .reverse()
        .filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((product) => (
          <div key={product.id} className="productRow">
            <div className="productInfo">
              <h2>{product.name}</h2>
              <h3>Rp {product.price.toLocaleString("id-ID")}</h3>
              <h3>
                Stock: {product.stock} {product.unit || "pcs"}
              </h3>
            </div>
            <div className="productActions">
              <button onClick={() => handleEdit(product.id)}>Edit</button>
              <button onClick={() => handleDeleteClick(product.id)}>
                Hapus
              </button>
            </div>
          </div>
        ))}

      {isModalOpen && (
        <div className={styles.overlay}>
          <div className={styles.modalContent}>
            <button
              onClick={() => resetAndCloseModal()}
              className={styles.closeButton}
            >
              X
            </button>
            <form onSubmit={handleFormSubmit} className={styles.formContent}>
              <h2>{selectedProduct ? "Edit Produk" : "Tambah Produk"}</h2>
              <span>Nama Produk</span>
              <input
                type="text"
                placeholder="Nama Produk"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              <span>Stok</span>
              <div className={styles.stockInputContainer}>
                <input
                  type="number"
                  placeholder="Stok"
                  value={productStock}
                  onChange={(e) => setProductStock(e.target.value)}
                  className={styles.stockInputField}
                  step={productUnit === "pcs" ? "1" : "0.25"}
                  min="0"
                />
                <select
                  value={productUnit}
                  onChange={(e) => setProductUnit(e.target.value)}
                >
                  <option value="pcs">pcs</option>
                  <option value="kg">kg</option>
                  <option value="ltr">ltr</option>
                </select>
              </div>
              <span>Harga</span>
              <input
                type="number"
                placeholder="Harga"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
              <button
                type="submit"
                className={styles.addProductButton}
                disabled={isLoading}
              >
                {isLoading
                  ? "Memuat..."
                  : selectedProduct
                  ? "Update"
                  : "Tambah"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stock;
