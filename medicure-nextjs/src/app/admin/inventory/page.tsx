"use client";

import { useState } from "react";
import { Package, ShoppingCart, Activity, AlertCircle, PlusCircle } from "lucide-react";

export default function Inventory() {
    const [activeTab, setActiveTab] = useState("stock");

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
                <div className="flex bg-white rounded-lg p-1 shadow-sm border">
                    <button
                        onClick={() => setActiveTab("stock")}
                        className={`px-4 py-2 rounded-md transition-colors ${activeTab === "stock" ? "bg-blue-100 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                        Current Stock
                    </button>
                    <button
                        onClick={() => setActiveTab("order")}
                        className={`px-4 py-2 rounded-md transition-colors ${activeTab === "order" ? "bg-blue-100 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                        Order Medicine
                    </button>
                </div>
            </div>

            {activeTab === "stock" ? <StockView /> : <OrderMedicineView />}
        </div>
    );
}

function StockView() {
    // Dummy Data
    const stockItems = [
        { id: 1, name: "Paracetamol", composition: "Acetaminophen 500mg", type: "Tablet", quantity: 2400, status: "In Stock" },
        { id: 2, name: "Amoxicillin", composition: "Amoxicillin 250mg", type: "Capsule", quantity: 500, status: "Low Stock" },
        { id: 3, name: "Ibuprofen", composition: "Ibuprofen 400mg", type: "Tablet", quantity: 1200, status: "In Stock" },
        { id: 4, name: "Cetirizine", composition: "Cetirizine 10mg", type: "Tablet", quantity: 0, status: "Out of Stock" },
        { id: 5, name: "Cough Syrup", composition: "Dextromethorphan", type: "Syrup", quantity: 150, status: "In Stock" },
    ];

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4">Medicine Name</th>
                            <th className="px-6 py-4">Composition</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4 text-center">Quantity</th>
                            <th className="px-6 py-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {stockItems.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Package className="w-4 h-4" />
                                    </div>
                                    {item.name}
                                </td>
                                <td className="px-6 py-4">{item.composition}</td>
                                <td className="px-6 py-4">{item.type}</td>
                                <td className="px-6 py-4 text-center font-bold">{item.quantity}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${item.status === "In Stock" ? "bg-green-100 text-green-700" :
                                            item.status === "Low Stock" ? "bg-yellow-100 text-yellow-700" :
                                                "bg-red-100 text-red-700"
                                        }
                  `}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function OrderMedicineView() {
    const [order, setOrder] = useState({
        name: "",
        composition: "",
        quantity: "",
        comment: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setOrder({ ...order, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Order submitted (Mock)");
        setOrder({ name: "", composition: "", quantity: "", comment: "" });
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Place Medicine Order</h2>
                    <p className="text-gray-500 text-sm">Request new stock from main supplier</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={order.name}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3 border"
                        placeholder="e.g. Paracetamol"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Composition</label>
                    <input
                        type="text"
                        name="composition"
                        value={order.composition}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3 border"
                        placeholder="e.g. Acetaminophen 500mg"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        required
                        min="1"
                        value={order.quantity}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3 border"
                        placeholder="e.g. 1000"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Comment</label>
                    <textarea
                        name="comment"
                        rows={3}
                        value={order.comment}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3 border"
                        placeholder="Urgent requirement..."
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                    <PlusCircle className="w-5 h-5" />
                    Submit Order
                </button>
            </form>
        </div>
    );
}
