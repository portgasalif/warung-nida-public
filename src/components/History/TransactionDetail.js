import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import style from "./TransactionDetail.module.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const TransactionDetail = ({ products, userSession }) => {
  const [detailTransaction, setDetailTransaction] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchTransactionDetail = async () => {
      try {
        const transactionData = doc(
          db,
          "users",
          `${userSession.uid}`,
          "transactions",
          id
        );
        const transactionSnapshot = await getDoc(transactionData);

        if (transactionSnapshot.exists()) {
          setDetailTransaction(transactionSnapshot.data());
        }
      } catch (error) {
        console.error("Error fetching transaction detail:", error);
      }
    };
    fetchTransactionDetail();
  }, [id, userSession.uid]);

  const getTransactionProductId = (productId) => {
    const product = products.find((item) => item.id === productId);
    return product ? product : null;
  };

  if (!detailTransaction) {
    return (
      <div className="loading-container">
        <ClipLoader color="#1e3a8a" size={50} />
      </div>
    );
  }

  return (
    <div className={style.historyContainer}>
      <div className={style.historyTitle}>
        <h1>Detail Transaksi</h1>
      </div>
      <div className={style.historyCard}>
        <p className={style.dateText}>Tanggal: {detailTransaction.date}</p>

        <h3 className={style.sectionHeader}>Produk yang dibeli:</h3>
        {detailTransaction.items ? (
          Object.entries(detailTransaction.items)
            .filter(([productId, quantity]) => quantity > 0)
            .map(([productId, quantity]) => {
              const product = getTransactionProductId(productId);
              if (!product) {
                return null;
              }
              return (
                <div key={productId} className={style.productItem}>
                  <span>
                    {product.name} - {quantity} {product.unit || "pcs"}
                  </span>
                  <span className={style.subTotal}>
                    Rp {(product.price * quantity).toLocaleString("id-ID")}
                  </span>
                </div>
              );
            })
        ) : (
          <p>Detail produk tidak tersedia untuk transaksi lama</p>
        )}

        <p className={style.totalText}>
          Total: Rp {detailTransaction.total.toLocaleString("id-ID")}
        </p>
      </div>
    </div>
  );
};

export default TransactionDetail;
