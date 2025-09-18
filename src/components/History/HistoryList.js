import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import style from "./HistoryList.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const HistoryList = ({ userSession }) => {
  const [history, setHistory] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchHistory = async () => {
      setLoadingList(true);
      try {
        const sortedTransactionsQuery = query(
          collection(db, "users", `${userSession.uid}`, "transactions"),
          orderBy("timestamp", "desc")
        );
        const allTransactions = await getDocs(sortedTransactionsQuery);

        const transactionList = allTransactions.docs.map((doc) => ({
          id: doc.id,
          date: doc.data().date,
          total: doc.data().total,
        }));
        setHistory(transactionList);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoadingList(false);
      }
    };

    fetchHistory();
  }, [userSession.uid]);

  const handleTransactionClick = (id) => {
    navigate(`/history/${id}`);
  };
  if (loadingList) {
    return (
      <div className="loading-container">
        <ClipLoader color="#1e3a8a" size={50} />
      </div>
    );
  }
  return (
    <div>
      <div className={style.historyTitle}>
        <h1>Riwayat Transaksi</h1>
      </div>
      <div className={style.historyContainer}>
        {history.map((item) => (
          <div
            key={item.id}
            className={style.historyCard}
            onClick={() => handleTransactionClick(item.id)}
          >
            <p className={style.dateText}>Tanggal: {item.date}</p>
            <p className={style.totalText}>
              Total: Rp {item.total.toLocaleString("id-ID")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
