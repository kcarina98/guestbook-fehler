import { useState, useRef } from "react";

export default function GuestbookItem({ item, setRefresh }) {
  const [edit, setEdit] = useState(false);
  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const mailRef = useRef();
  const textRef = useRef();

  // # ändern von Daten
  function save() {
    const form = new FormData();
    form.append("id", item.id);
    form.append("firstname", firstnameRef.current.innerText);
    form.append("lastname", lastnameRef.current.innerText);
    form.append("mail", mailRef.current.innerText);
    form.append("text", textRef.current.innerText);

    fetch("http://localhost:9898/api/guestbook", {
      method: "PUT",
      body: form,
    }).then((response) => setRefresh((prev) => !prev));
  }

  // # löschen
  function deleteItem() {
    console.log(item.text, "gelöscht");
    fetch("http://localhost:9898/api/guestbook", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: item.id }),
    })
      .then(() => {
        setRefresh((prev) => !prev);
      })
      .catch(() => console.log("klappt nicht"));
  }

  return (
    <div className="item">
      <img src={item.imglink} alt="Image" />
      <p ref={firstnameRef} contentEditable={edit} className="name">
        {item.firstname}
      </p>
      <p ref={lastnameRef} contentEditable={edit} className="name">
        {item.lastname}
      </p>
      <a ref={mailRef} contentEditable={edit} href={`mailto:${item.mail}`}>
        {item.mail}
      </a>
      <p>schreibt: </p>
      <p ref={textRef} contentEditable={edit}>
        {item.text}
      </p>
      <button onClick={() => setEdit((prev) => !prev)}>
        {edit ? "Abbruch" : "Edit"}
      </button>
      {edit && <button onClick={save}>Speichern</button>}
      <button onClick={deleteItem}>Löschen</button>
    </div>
  );
}
