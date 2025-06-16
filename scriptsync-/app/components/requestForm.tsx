'use client'


import { useState, useEffect } from "react";

interface User {
  id: string;
  username: string;
}


const RequestForm = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [recipientId, setRecipientId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [script, setScript] = useState("");

  useEffect(() => {
    // Fetch users to populate the recipient dropdown
      const fetchUsers = async () => {
        const response = await fetch("/api/users", {
          method: "GET",
        });
        const data = await response.json();
        console.log("Users fetched:", data); 
        setUsers(data);
      };
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipientId, date, time, script }),
    });
    if (!response.ok) {
      console.log("Error fetching users!");
    } else {
      console.log("Request sent!");
    }
  };

  return (
    
       <form onSubmit={handleSubmit}>
      <label>
      Recipient:
        <select
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
          required
        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username || "User Not Found"}
            </option>
          ))}
        </select>
      </label>

      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>

      <label>
        Time:
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </label>

      <label>
        Script:
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          required
        />
      </label>

      <button type="submit">Send Request</button>
    </form> 
  )
 };
//verify data structure is being returned by the fetch, test this endpoint in postman 
//
export default RequestForm;

