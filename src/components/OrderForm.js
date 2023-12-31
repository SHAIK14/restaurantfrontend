import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";
function OrdersList({ tableNumber }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/getOrders/${tableNumber}`
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }

    fetchOrders();
  }, [tableNumber]);

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:4000/api/deleteOrder/${orderId}`);

      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <div className="showdata">
      <h2>Orders List for Table {tableNumber}</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            Dish: {order.dish} - Price: {order.price}
            <button
              className="btn-del"
              onClick={() => handleDeleteOrder(order.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function OrderForm() {
  const [dish, setDish] = useState("");
  const [price, setPrice] = useState("");
  const [tableNumber, setTableNumber] = useState("1");

  const handleAddToBill = async () => {
    try {
      await axios.post("http://localhost:4000/api/addOrder", {
        dish,
        price,
        tableNumber,
      });
      alert("Order added successfully!");
    } catch (error) {
      console.error("Error adding order:", error);
    }
  };

  return (
    <div className="form">
      <h2>Add to Bill</h2>
      <div className="dish">
        <label>Dish:</label>
        <input
          type="text"
          value={dish}
          onChange={(e) => setDish(e.target.value)}
        />
      </div>
      <div className="price">
        <label>Price:</label>
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div className="table">
        <label>Table Number:</label>
        <select
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
        >
          <option value="1">Table 1</option>
          <option value="2">Table 2</option>
          <option value="3">Table 3</option>
        </select>
      </div>
      <button className="btn-add" onClick={handleAddToBill}>
        Add to Bill
      </button>
      <OrdersList tableNumber={tableNumber} />
    </div>
  );
}

export default OrderForm;
