import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css'; // import the CSS file

const FoodOrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState({
    id: '',
    foodName: '',
    foodType: '',
    price: 0,
    quantity: 1,
    totalCost: 0,
    customerName: '',
    contact: '',
    address: ''
  });
  const [idToFetch, setIdToFetch] = useState('');
  const [fetchedOrder, setFetchedOrder] = useState(null);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);

  const baseUrl = `${import.meta.env.VITE_API_URL}/foodapi`;

  useEffect(() => {
    fetchAllOrders();
  }, []);

  useEffect(() => {
    setOrder(prev => ({ ...prev, totalCost: prev.price * prev.quantity }));
  }, [order.price, order.quantity]);

  const fetchAllOrders = async () => {
    try {
      const res = await axios.get(`${baseUrl}/all`);
      setOrders(res.data);
    } catch (error) {
      console.error(error);
      setMessage('Failed to fetch orders.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder(prev => ({ ...prev, [name]: name === 'price' || name === 'quantity' ? Number(value) : value }));
  };

  const validateForm = () => {
    for (let key in order) {
      if (order[key] === '' || order[key] === null) {
        setMessage(`Please fill out ${key}`);
        return false;
      }
    }
    return true;
  };

  const addOrder = async () => {
    if (!validateForm()) return;
    try {
      await axios.post(`${baseUrl}/add`, order);
      setMessage('Order added successfully.');
      fetchAllOrders();
      resetForm();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data || 'Error adding order.');
    }
  };

  const updateOrder = async () => {
    if (!validateForm()) return;
    try {
      await axios.put(`${baseUrl}/update`, order);
      setMessage('Order updated successfully.');
      fetchAllOrders();
      resetForm();
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data || 'Error updating order.');
    }
  };

  const deleteOrder = async (id) => {
    try {
      const res = await axios.delete(`${baseUrl}/delete/${id}`);
      setMessage(res.data);
      fetchAllOrders();
    } catch (error) {
      console.error(error);
      setMessage('Error deleting order.');
    }
  };

  const getOrderById = async () => {
    try {
      const res = await axios.get(`${baseUrl}/get/${idToFetch}`);
      setFetchedOrder(res.data);
      setMessage('');
    } catch (error) {
      setFetchedOrder(null);
      setMessage('Order not found.');
    }
  };

  const handleEdit = (o) => {
    setOrder(o);
    setEditMode(true);
    setMessage(`Editing order with ID ${o.id}`);
  };

  const resetForm = () => {
    setOrder({
      id: '',
      foodName: '',
      foodType: '',
      price: 0,
      quantity: 1,
      totalCost: 0,
      customerName: '',
      contact: '',
      address: ''
    });
    setEditMode(false);
  };

  const foodNames = ['Pizza', 'Burger', 'Pasta', 'Salad', 'Sandwich'];
  const foodTypes = ['Veg', 'Non-Veg', 'Vegan', 'Gluten-Free'];
  const foodPrices = [100, 200, 300, 400, 500];

  return (
    <div className="food-order-container">
      <h2 className="food-order-title">Restaurant Food Orders</h2>

      {message && (
        <div className={message.toLowerCase().includes('error') ? "food-order-error" : "food-order-success"}>
          {message}
        </div>
      )}

      <div className="food-order-card">
        <h3>{editMode ? 'Edit Order' : 'Add Order'}</h3>
        <div className="food-order-form-grid">
          <input className="food-order-input" type="number" name="id" placeholder="ID" value={order.id} onChange={handleChange} />
          <select className="food-order-select" name="foodName" value={order.foodName} onChange={handleChange}>
            <option value="">Select Food</option>
            {foodNames.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <select className="food-order-select" name="foodType" value={order.foodType} onChange={handleChange}>
            <option value="">Select Type</option>
            {foodTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="food-order-select" name="price" value={order.price} onChange={handleChange}>
            <option value="">Select Price</option>
            {foodPrices.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <input className="food-order-input" type="number" name="quantity" placeholder="Quantity" value={order.quantity} onChange={handleChange} />
          <input className="food-order-input" type="text" name="customerName" placeholder="Customer Name" value={order.customerName} onChange={handleChange} />
          <input className="food-order-input" type="text" name="contact" placeholder="Contact" value={order.contact} onChange={handleChange} />
          <input className="food-order-input" type="text" name="address" placeholder="Address" value={order.address} onChange={handleChange} />
          <input className="food-order-input" type="number" name="totalCost" placeholder="Total Cost" value={order.totalCost} readOnly />
        </div>
        <div className="food-order-btn-group">
          {!editMode ? (
            <button className="food-order-btn food-order-btn-blue" onClick={addOrder}>Add Order</button>
          ) : (
            <>
              <button className="food-order-btn food-order-btn-green" onClick={updateOrder}>Update Order</button>
              <button className="food-order-btn food-order-btn-gray" onClick={resetForm}>Cancel</button>
            </>
          )}
        </div>
      </div>

      <div className="food-order-card">
        <h3>Get Order By ID</h3>
        <input className="food-order-input" type="number" value={idToFetch} onChange={e => setIdToFetch(e.target.value)} placeholder="Enter ID" />
        <button className="food-order-btn food-order-btn-blue" onClick={getOrderById}>Fetch</button>
        {fetchedOrder && <pre className="food-order-pre">{JSON.stringify(fetchedOrder, null, 2)}</pre>}
      </div>

      <div className="food-order-card">
        <h3>All Orders</h3>
        {orders.length === 0 ? <p>No orders found.</p> : (
          <div className="food-order-table-wrapper">
            <table className="food-order-table">
              <thead>
                <tr>
                  {Object.keys(order).map(key => <th key={key}>{key}</th>)}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    {Object.keys(order).map(key => <td key={key}>{o[key]}</td>)}
                    <td>
                      <button className="food-order-btn food-order-btn-green" onClick={() => handleEdit(o)}>Edit</button>
                      <button className="food-order-btn food-order-btn-red" onClick={() => deleteOrder(o.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodOrderManager;
