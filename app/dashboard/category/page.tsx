"use client"

import {useState} from "react";
import {LayoutGrid, Trash2, Pencil, Plus, X} from "lucide-react";

type Category = {
    id: number;
    name: string;
    description: string;
}

const initialCategories: Category[] = [
    { id: 1, name: "Electronics", description: "Phones, Laptops, Gadgets" },
    { id: 2, name: "Clothing", description: "Men, Women, Kids Fashion" },
    { id: 3, name: "Food", description: "Groceries and Beverages" },
]

export default function CategoryPage(){
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [showForm, setShowForm] = useState(false);
    const [editForm, setEditForm] = useState<Category | null>(null);
    const [form, setForm] = useState({name: "", description: ""});

    function handleSubmit(){
        if (!form.name.trim()) return;
        if (editForm){
            setCategories(categories.map((c) =>
                c.id === editForm.id ? {...c, ...form} : c
            ));
            setEditForm(null);
        } else {
            setCategories([...categories, {id: Date.now(), ...form}]);
        }
        setForm({name: "", description: ""});
        setShowForm(false);
    }

    function handleEdit(item: Category){
        setEditForm(item);
        setForm({name: item.name, description: item.description});
        setShowForm(true);
    }

    function handleDelete(id: number){
        setCategories(categories.filter((c) => c.id !== id));
    }

    return (
        <div>
            {/* Page header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <LayoutGrid size={22} className="text-blue-600"/>
                    <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
                </div>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditForm(null);
                        setForm({name: "", description: ""});
                    }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm cursor-pointer transition"
                >
                    {showForm ? <X size={16}/> : <Plus size={16}/>}
                    {showForm ? "Cancel" : "Add Category"}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <h2 className="text-base font-semibold text-gray-700 mb-4">
                        {editForm ? "Edit Category" : "New Category"}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-500 mb-1 block">Category Name *</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({...form, name: e.target.value})}
                                placeholder="e.g. Electronics"
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-gray-500 mb-1 block">Description</label>
                            <input
                                type="text"
                                value={form.description}
                                onChange={(e) => setForm({...form, description: e.target.value})}
                                placeholder="Short description"
                                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm cursor-pointer transition"
                    >
                        {editForm ? "Update Category" : "Save Category"}
                    </button>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="text-left px-6 py-3 text-gray-500 font-medium">#</th>
                        <th className="text-left px-6 py-3 text-gray-500 font-medium">Name</th>
                        <th className="text-left px-6 py-3 text-gray-500 font-medium">Description</th>
                        <th className="text-right px-6 py-3 text-gray-500 font-medium">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center py-10 text-gray-400">
                                No categories found
                            </td>
                        </tr>
                    ) : (
                        categories.map((cat, index) => (
                            <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                <td className="px-6 py-4 text-gray-400">{index + 1}</td>
                                <td className="px-6 py-4 font-medium text-gray-800">{cat.name}</td>
                                <td className="px-6 py-4 text-gray-500">{cat.description}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(cat)}
                                            className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 cursor-pointer transition"
                                        >
                                            <Pencil size={15}/>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer transition"
                                        >
                                            <Trash2 size={15}/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}