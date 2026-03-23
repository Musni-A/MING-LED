import { useState } from "react";
import { test } from "../../api/userAPI";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";




export default function PartDetails(){

    const notify = (message ) => toast(message);

    const empty = {search : ''}

    const [form, setForm] = useState(empty)

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const response = await test(form);
        notify(response.data.msg)

    }

    const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)  // ← must match upload.single('image')

    try {
        const response = await axios.post(
            'https://ming-led-server.onrender.com/api/upload',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'  // ← important!
                }
            }
        )
        console.log(response.data.url) // ✅ image URL
    } catch (err) {
        console.log(err)
    }
}

// In JSX

    return <>
    <input type="file" onChange={handleImageUpload} accept="image/*" />
    <div><Toaster/></div>
    <div className="bg-white flex flex-col rounded-2xl shadow-2xl">
        <div className="px-6 py-4 flex flex-row justify-between items-center w-full">
            <div className="">
                <h2 className="text-base font-bold">LED Parts List</h2>
                <p className="text-xs">Total parts</p>
            </div>
            <form onSubmit={handleSubmit}>
            <div className="flex flex-row gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2">
                    <span className="text-slate-400 text-xs">🔍</span>
                    <input name="search" value={form.search} onChange={handleChange}
                    placeholder="Search Parts..."
                    className="bg-transparent text-xs outline-none text-slate-600 w-36 placeholder:text-slate-400"
                    />
                </div>
                <button className="bg-[#0d2145] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
                    + Add parts
                </button>
            </div>
            </form>
        </div>
        <div>
            <table>
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider"></th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">18W</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">18W</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">18W</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">18W</th>
                    </tr>
                </thead>
            </table>
        </div>
        <div></div>
        <div></div>
    </div>
    </>
}