import { useState } from "react";

export default function AddItem({ props, setRefresh }) {
  const [err, setErr] = useState(null);

  function senden(event) {
    event.preventDefault();
    const form = new FormData(event.target);

    fetch("http://localhost:9898/api/guestbook", {
      method: "POST",
      body: form,
    }).then((response) => {
      if (response.ok) {
        console.log("response okay");
        props.setRefresh((prev) => !prev);
        event.target.reset();
      } else {
        response.json().then((data) => setErr(data));
      }
    });
  }

  return (
    <>
      <form className="form" onSubmit={senden}>
        {err && <div className="error-meldung">{err.message}</div>}
        <label htmlFor="firstname">Vorname</label>
        <input type="text" name="firstname" id="firstname" />
        <label htmlFor="lastname">Nachname</label>
        <input type="text" name="lastname" id="lastname" />
        <label htmlFor="mail">E-Mail</label>
        <input type="email" name="mail" id="mail" />
        <label htmlFor="text">Nachricht</label>
        <input type="text" name="text" id="text" />
        <input type="file" name="imglink" id="imglink" />
        <input className="button" type="submit" value="senden" />
      </form>
    </>
  );
}
