import { useState } from "react";
import { test } from "../../api/ledPartsAPI";
import toast, { Toaster } from 'react-hot-toast';

export default function PartDetails(){

    const notify = (message ) => toast(message);

    const empty = {Watts:'', BulbSheet:'', Driver:'', LampCup:'', BottomCup:'', ColorBox:'', CottonBox:''}

    const [form, setForm] = useState(empty)

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
        console.log(form)
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const response = await test(form);
        notify(response.data.msg)
    }

    return <>
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
                    <input name="BottomCup" value={form.BottomCup} onChange={handleChange}
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
            <table className=" w-full">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="text-left px-6 py-3 border border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider">Watts</th>
                        <th className="text-left px-6 py-3 border border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider">Bulb-Sheet</th>
                        <th className="text-left px-6 py-3 border border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider">Driver</th>
                        <th className="text-left px-6 py-3 border border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider">Lamp-Cup</th>
                        <th className="text-left px-6 py-3 border border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider">Bottom-Cup</th>
                        <th className="text-left px-6 py-3 border border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider">Color-Box</th>
                        <th className="text-left px-6 py-3 border border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider">Cotton-Box</th>
                        <th className="text-left px-6 py-3 border border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                            <div className="bg-slate-300 rounded-xl mx-3 py-2 font-bold text-sm flex items-center justify-center shrink-0">18w</div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="bg-slate-300 rounded-xl mx-3 py-2 font-bold text-sm flex items-center justify-center shrink-0">18w</div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="bg-slate-300 rounded-xl mx-3 py-2 font-bold text-sm flex items-center justify-center shrink-0">1000</div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="bg-slate-300 rounded-xl mx-3 py-2 font-bold text-sm flex items-center justify-center shrink-0">18w</div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="bg-slate-300 rounded-xl mx-3 py-2 font-bold text-sm flex items-center justify-center shrink-0">18w</div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="bg-slate-300 rounded-xl mx-3 py-2 font-bold text-sm flex items-center justify-center shrink-0">18w</div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="bg-slate-300 rounded-xl mx-3 py-2 font-bold text-sm flex items-center justify-center shrink-0">18w</div>
                        </td>
                        <td className="px-6 py-4">
                            <button></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div></div>
        <div></div>
    </div>
    </>
}