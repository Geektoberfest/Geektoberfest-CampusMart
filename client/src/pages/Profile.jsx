import { useEffect, useState } from "react";
import { myListings } from "../services/itemService";
import { useAuth } from "../context/AuthContext";
export default function Profile() {
  const { user } = useAuth();
  const [count, setCount] = useState({ active: 0, sold: 0 });
  useEffect(() => {
    myListings().then((r) => {
      const x = r.data.data.listings;
      setCount({
        active: x.filter((i) => i.status === "Available").length,
        sold: x.filter((i) => i.status === "Sold").length,
      });
    });
  }, []);
  return (
    <section className="section narrow">
      <span className="eyebrow">PROFILE</span>
      <h1>{user.name}</h1>
      <div className="profile-card">
        <p>
          <b>College email</b>
          <br />
          {user.email}
        </p>
        <p>
          <b>Department</b>
          <br />
          {user.department}
        </p>
        <p>
          <b>Year</b>
          <br />
          {user.year}
        </p>
        <div className="stats">
          <div>
            <strong>{count.active}</strong>
            <span>Active listings</span>
          </div>
          <div>
            <strong>{count.sold}</strong>
            <span>Sold items</span>
          </div>
        </div>
      </div>
    </section>
  );
}
