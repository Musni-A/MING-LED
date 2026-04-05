import { useState } from "react";
import { updateParts } from "../../api/partsAPI";
// import { handleUpdate } from "../commonFun/handleFun";
import toast from "react-hot-toast";

export default function AddParts({ fetchData, setShow, button }){
    
    const empty = {
        watts:'', tempColor:'', bulbSheet:'', driver:'',
        lampCup:'',bottomCup:'',colorBox:'',
        cottonBox:''
    }

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState(empty)

    const handleChange = (e)=>{
        const {name, value} = e.target;
        setForm(prev=>({...prev,[name]:value}))
        console.log(form)
    }
    
    const handleUpdate = async (API, toastSuccMsg, toastErrMsg, form, arithType, show, loading)=>{
    loading(true)
    try{
        const response = await API(form, arithType);
        await fetchData();
        toast.success(toastSuccMsg);
        show(false);

    }
    catch(err){
        if(err.response.data.negativeNumber){
            return toast(err.response.data.message, {
                icon: '⚠️',
                style: {
                background: 'white',
                padding: '12px',
                borderRadius: '12px'
                }
            });
        }
        if(err.response.data.fieldMissing){
            return toast.error(err.response.data.message)
        }
    }
    finally{
        loading(false)
    }
}

    return<>
        <div className="text-white bg-blue-950 p-7 rounded-2xl ">
            <div className="flex flex-col gap-4 it">
                <div className="flex justify-center">
                    <p className="text-2xl font-bold pb-3">{button === 'add' ? 'Add Parts ( + )' : 'Reduce Parts ( - )'}</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                        <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Watts</label>
                        <select name="watts" value={form.watts} onChange={handleChange} className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-[#ffffff] text-sm outline-none w-full">
                        <option value="">Select Watts</option>
                        {['5','7','9','12','15','18','28','38','48'].map(o => (
                            <option key={o} className="bg-[#0d2145] text-white">{o}</option>
                        ))}
                        </select>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                        <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Temprature Color</label>
                        <select name="tempColor" value={form.tempColor} onChange={handleChange} className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-[#ffffff] text-sm outline-none w-full">
                        <option value="">Select Temp Color</option>
                        {['C/W', 'W/W'].map(o => (
                            <option key={o} className="bg-[#0d2145] text-white">{o}</option>
                        ))}
                        </select>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                        <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Bulb-Sheet</label>
                        <input value={form.bulbSheet} onChange={handleChange} placeholder="Count of Bulb-Sheet" className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none w-full placeholder:text-white/30" type="number" name="bulbSheet"/>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                        <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Driver</label>
                        <input value={form.driver} onChange={handleChange} placeholder="Count of Driver" className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none w-full placeholder:text-white/30" type="number" name="driver"/>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                        <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Lamp-Cup</label>
                        <input value={form.lampCup} onChange={handleChange} placeholder="Count of Lamp-Cup" className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none w-full placeholder:text-white/30" type="number" name="lampCup"/>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                        <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Bottom-Cup</label>
                        <input value={form.bottomCup} onChange={handleChange} placeholder="Count of Bottom-Cup" className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none w-full placeholder:text-white/30" type="number" name="bottomCup"/>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                        <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Color-Box</label>
                        <input value={form.colorBox} onChange={handleChange} placeholder="Count of Color-Box" className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none w-full placeholder:text-white/30" type="number" name="colorBox"/>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                        <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Cotton-Box</label>
                        <input value={form.cottonBox} onChange={handleChange} placeholder="Count of Cotton-Box" className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none w-full placeholder:text-white/30" type="number" name="cottonBox"/>
                    </div> 
                </div>
                <div className="flex justify-center">
                    <div className="text-center text-yellow-300 w-65 rounded-xl"><p>Pls re-check values are correct !</p></div>
                </div>
                <div className="flex gap-4 justify-end">
                    <button onClick={button === 'add' ? ()=>handleUpdate(updateParts, "Part updated successfully!", 'Please check the inputs!', form, "add", setShow, setLoading) : ()=>handleUpdate(updateParts, "Part updated successfully!", 'Please check the inputs!', form, "reduce", setShow, setLoading)} className="border font-bold px-4 py-2 rounded-xl cursor-pointer transition duration-300 hover:bg-[#002cb1] hover:scale-105">
                        { !loading && (button === 'update' ? 'Reduce Parts' : 'Add Parts' )}
                        { loading && <img className="w-6" src="/barLoading.gif"></img>}
                    </button>
                    <button onClick={()=>{setShow(false)}} className="border font-bold px-4 py-2 rounded-xl cursor-pointer transition duration-300 hover:bg-[#b10000] hover:scale-105">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </>
}