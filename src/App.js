import React, { useState, useEffect } from "react";

function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("inventory");
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    cost: "",
    threshold: "",
    date: ""
  });

  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("inventory", JSON.stringify(items));
  }, [items]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addItem = () => {
    if (!formData.name || !formData.quantity || !formData.cost || !formData.date) return;
    setItems([
      ...items,
      {
        ...formData,
        quantity: +formData.quantity,
        cost: +formData.cost,
        threshold: +formData.threshold
      }
    ]);
    setFormData({ name: "", quantity: "", cost: "", threshold: "", date: "" });
  };

  const deleteItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => sum + item.quantity * item.cost, 0);
  const lowStockCount = items.filter((item) => item.quantity <= item.threshold).length;

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.date.includes(search)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input name="name" value={formData.name} onChange={handleChange} className="input" placeholder="Enter item name" />
          <input name="quantity" value={formData.quantity} onChange={handleChange} className="input" placeholder="Enter quantity" />
          <input name="cost" value={formData.cost} onChange={handleChange} className="input" placeholder="Enter cost" />
          <input name="threshold" value={formData.threshold} onChange={handleChange} className="input" placeholder="Low stock alert level" />
          <input name="date" type="date" value={formData.date} onChange={handleChange} className="input" />
        </div>
        <button onClick={addItem} className="mt-4 px-4 py-2 bg-blue-700 text-white rounded">Add Item</button>
      </div>

      <input type="text" placeholder="Search by item name or purchase date..." value={search} onChange={(e) => setSearch(e.target.value)} className="input w-full" />

      <div className="grid md:grid-cols-2 gap-4">
        {filteredItems.map((item, index) => (
          <div key={index} className={`p-4 rounded shadow ${item.quantity <= item.threshold ? "bg-red-50" : "bg-green-50"}`}>
            <h3 className="text-lg font-bold">{item.name}{" "}
              <span className={`text-sm font-medium ${item.quantity <= item.threshold ? "text-red-600" : "text-green-600"}`}>
                {item.quantity <= item.threshold ? "Low Stock" : "In Stock"}
              </span>
            </h3>
            <p>Quantity: <strong>{item.quantity}</strong></p>
            <p>Cost: ₹{item.cost}</p>
            <p>Threshold: {item.threshold}</p>
            <p>Purchase Date: {item.date}</p>
            <button onClick={() => deleteItem(index)} className="mt-2 px-3 py-1 bg-red-500 text-white rounded">Delete</button>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Inventory Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>Total Items: <strong>{items.length}</strong></div>
          <div>Total Quantity: <strong>{totalQuantity}</strong></div>
          <div>Total Value: <strong>₹{totalValue}</strong></div>
          <div>Low Stock Items: <strong>{lowStockCount}</strong></div>
        </div>
      </div>
    </div>
  );
}

export default App;