import { useEffect, useState } from "react";
import "./App.css";
import AddItem from "./components/AddItem";
import GuestbookItem from "./components/GuestbookItem";
import { v4 } from "uuid";

function App() {
  const [items, setItems] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetch("http://localhost:9898/api/guestbook")
      .then((response) => response.json())
      .then((data) => setItems(data));
  }, [refresh]);

  return (
    <>
      <AddItem setRefresh={setRefresh} />
      <section className="grid">
        {items.map((item) => (
          <GuestbookItem item={item} key={v4()} setRefresh={setRefresh} />
        ))}
      </section>
    </>
  );
}

export default App;
