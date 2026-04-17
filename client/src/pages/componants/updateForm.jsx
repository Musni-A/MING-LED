import { useState } from "react"
import toast from "react-hot-toast"
import { updateLightWatts } from "../../api/lightAPI"
import { Loader } from 'lucide-react';

export default function UpdateForm({setShowUpdateForm, selectedWattsId, arithType, selectedType, selectedWatts, fetchData}) {

    const [updateForm, setUpdateForm] = useState({})
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setUpdateForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async() => {
      setLoading(true)
      if(!updateForm || Object.keys(updateForm).length === 0) {
          toast.error("Please fill in all fields")
          setLoading(false)
          return
      }
        try{
            const response = await updateLightWatts({
                id: selectedWattsId,
                typeName: selectedType.typeName,
                parts: updateForm,
                arithType: arithType
            })
            fetchData()
            toast.success(response.data.message)
            // setShowUpdateForm(false)
        }
        catch(err){
            toast.error("Failed to update light type:", err)
        }
        finally{
            setLoading(false)
            setShowUpdateForm(false)
        }
    }

    return <>
    <div className={`relative sm:w-120 bg-blue-950 backdrop-blur-xl border border-white/8 rounded-3xl p-7 shadow-[0_32px_80px_rgba(0,0,0,0.4)] duration-300 transition-transform`}>

        {/* Logo */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-end gap-1">
            <div className="w-2.5 h-8 rounded-full bg-[#e8192c]" />
            <div className="w-2.5 h-6 rounded-full bg-[#f5c800]" />
            <div className="w-2.5 h-8 rounded-full bg-[#7b9fd4]" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white tracking-[0.2em] leading-none">MING</div>
            <div className="text-[0.6rem] text-[#7b9fd4] tracking-[0.3em] mt-0.5">WORTH SPENDING</div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-extrabold text-white leading-none">{arithType === 'add' ? 'Add' : 'Subtract'} Parts</h2>
            <p className="text-[0.6rem] text-[#7b9fd4] tracking-[0.3em] mt-0.5">{arithType === 'add' ? 'Add' : 'Subtract'} the watts type and its parts</p>
          </div>
        </div>
        {/* Form */}
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
                {selectedWatts[0].parts.map((part, index) => (
                    <div key={index} className="flex flex-col gap-1.5">
                        <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">{part.partsName}</label>
                        <input
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-white/30 focus:border-[#7b9fd4] transition-colors"
                        type="number"
                        placeholder={part.quantity}
                        name={part.partsName}
                        value={updateForm[part.partsName] || ""}
                        onChange={handleChange}
                        />
                    </div>
                ))}
            </div>

          {/* Submit */}
          <div className="flex justify-evenly gap-4">
            <button onClick={()=>{handleSubmit()}}
              className="mt-2 w-full py-3.5 rounded-xl text-white font-bold text-base cursor-pointer border-none bg-linear-to-r from-[#e8192c] to-[#c0001f] shadow-[0_8px_24px_rgba(232,25,44,0.3)] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader className="animate-spin mx-auto" /> : 'Update Parts →'}
            </button>

            <button onClick={()=>setShowUpdateForm(false)}
              className="mt-2 w-full py-3.5 rounded-xl text-[#7b9fd4] font-semibold text-sm cursor-pointer border border-white/10 bg-transparent hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
}