"use client"

import {Package, Pen, Plus, PlusCircle, Trash2} from "lucide-react";
import Image from "next/image";

export default function ProductPage(){
    return(
        <div>
            <div className={'flex items-center justify-between mb-6'}>
                <div className={'flex items-center gap-2'}>
                    <Package size={22} className={'text-blue-600'}/>
                    <h1 className={'font-bold text-2xl'}>Products</h1>
                </div>
                <button className={'flex items-center gap-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 px-4 py-2 cursor-pointer'}>
                    <Plus size={16}/>
                    Add Products
                </button>
            </div>
            <div className={'bg-white rounded-xl shadow overflow-hidden'}>
                <table className={'w-full text-sm'}>
                    <thead className={'bg-gray-50 border-b'}>
                    <tr>
                        <th className={'px-6 py-3 text-left'}>Prod. ID</th>
                        <th className={'px-6 py-3 text-left'}>Name</th>
                        <th className={'px-6 py-3 text-left'}>Image</th>
                        <th className={'px-6 py-3 text-left'}>Price</th>
                        <th className={'px-6 py-3 text-left'}>Category</th>
                        <th className={'px-6 py-3 text-right'}>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">#001</td>

                        <td className="px-6 py-4">iPhone 16 Pro</td>

                        <td className="px-6 py-4">
                            <img
                                src="https://via.placeholder.com/50"
                                alt="iPhone 16 Pro"
                                width={50}
                                height={50}
                                className="rounded-md object-cover"
                            />
                        </td>

                        <td className="px-6 py-4">$999</td>

                        <td className="px-6 py-4">Electronics</td>

                        <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-3">
                                <button className="text-blue-600 hover:text-blue-800 cursor-pointer">
                                    <Pen size={14} />
                                </button>

                                <button className="text-red-600 hover:text-red-800 cursor-pointer">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}