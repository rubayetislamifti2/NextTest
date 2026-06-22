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
    const [categories, setCategories]=useState<Category[]>(initialCategories);
    const [showForm, setShowForm] = useState(false);
    const [editForm, setEditForm] = useState<Category | null>(null);
    const [form, setForm] = useState({name:"",description:""});

    function handleSubmit(){
        if (!form.name.trim())
            return;
        if (editForm){
            setCategories(categories.map((c)=>
                c.id === editForm.id ? {...c, ...form} : c
            ));
            setEditForm(null);
        }else{
            setCategories([
                ...categories,{
                    id:Date.now(), ...form
                },
            ]);
        }
        setForm({name: "", description: ""});
        setShowForm(false);
    }

    function handleEdit(item: Category) {
        setEditItem(item);
        setForm({ name: item.name, description: item.description });
        setShowForm(true);
    }

    function handleDelete(id: number) {
        setCategories(categories.filter((c) => c.id !== id));
    }

    return (
        <div>
            <div className={'flex items-center justify-between mb-6'}>
                <div className={'flex items-center gap-2'}>
                    <LayoutGrid size={22} className={'text-blue-600'}/>
                    <h1 className={'text-2xl font-bold text-gray-800'}>Categories</h1>
                </div>
                <button
                onClick={()=>{
                    setShowForm(!showForm);
                    setEditForm(null);
                    setForm({name: "", description: ""})
                }}
                className={'flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm cursor-pointer transition'}
                >
                    {showForm ? <X size={16}/> : <Plus size={16} />}
                    {showForm ? "Cancel" : "Add Category"}
                </button>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ${showForm ? "max-h-96 mb-6" : "max-h-0"}`}>
                <div className={'bg-white rounded-xl shadow p-6'}>
                    <h2 className={'text-base font-semibold text-gray-700 mb-4'}>
                        {editForm ? "Edit Category" : "New Category"}
                    </h2>
                </div>
            </div>
        </div>
    );
}