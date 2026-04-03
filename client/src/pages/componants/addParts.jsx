import { useState } from "react";
import { createParts } from "../../api/partsAPI";
import  toast, {Toaster} from "react-hot-toast";

export default function AddParts({setShow, button}){

    const empty = {
        watts:'', tempColor:'', bulbSheet:'', driver:'',
        lampCup:'',bottomCup:'',colorBox:'',
        cottonBox:''
    }
    const notify = (message,icon)=>{toast(message, { icon : icon } )}


    const [form, setForm] = useState(empty)

    const handleChange = (e)=>{
        const {name, value} = e.target;
        setForm(prev=>({...prev,[name]:value}))
        console.log(form)
    }

    const handleSubmit = async()=>{
        try{
            await createParts(form)
            notify("Success on add parts","✅")
            setShow(false)
        }   
        catch(err){
            if(err){
                notify( "Can not create parts" , "❌",);
            }
        }
    }

    const handleUpdate = ()=>{
        
    }

    return<>
        <div className="text-white bg-blue-950 p-10 rounded-2xl ">
            <div className="flex flex-col gap-4">
                <div className="flex justify-center">
                    <p className="text-2xl font-bold pb-3">{button === 'add' ? 'Add Parts' : 'Update Parts'}</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                        <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Watts</label>
                        <input value={form.watts} onChange={handleChange} placeholder="Enter Watts of Bulb" className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none w-full placeholder:text-white/30" type="number" name="watts"/>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                        <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Bulb-Sheet</label>
                        <input value={form.bulbSheet} onChange={handleChange} placeholder="Count of Bulb-Sheet" className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none w-full placeholder:text-white/30" type="number" name="bulbSheet"/>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                        <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Driver</label>
                        <input value={form.driver} onChange={handleChange} placeholder="Count of Driver" className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none w-full placeholder:text-white/30" type="number" name="driver"/>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                        <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Lamp-Cup</label>
                        <input value={form.lampCup} onChange={handleChange} placeholder="Count of Lamp-Cup" className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none w-full placeholder:text-white/30" type="number" name="lampCup"/>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                        <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Bottom-Cup</label>
                        <input value={form.bottomCup} onChange={handleChange} placeholder="Count of Bottom-Cup" className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none w-full placeholder:text-white/30" type="number" name="bottomCup"/>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                        <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Color-Box</label>
                        <input value={form.colorBox} onChange={handleChange} placeholder="Count of Color-Box" className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none w-full placeholder:text-white/30" type="number" name="colorBox"/>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1 min-w-0 flex flex-col gap-1.5" style={{flexBasis:"calc(50% - 8px)"}}>
                        <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Cotton-Box</label>
                        <input value={form.cottonBox} onChange={handleChange} placeholder="Count of Cotton-Box" className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm outline-none w-full placeholder:text-white/30" type="number" name="cottonBox"/>
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
                <div className="flex gap-4 justify-end">
                    <button onClick={button === 'add' ? handleSubmit : handleUpdate} className="border font-bold px-4 py-2 rounded-xl cursor-pointer transition duration-300 hover:bg-[#002cb1] hover:scale-105">
                        {button === 'update' ? 'Update Parts' : 'Add Parts' }
                    </button>
                    <button onClick={()=>{setShow(false)}} className="border font-bold px-4 py-2 rounded-xl cursor-pointer transition duration-300 hover:bg-[#b10000] hover:scale-105">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </>
}