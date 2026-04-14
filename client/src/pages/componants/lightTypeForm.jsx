import { useState } from "react"
import toast from "react-hot-toast";
import { createLightType } from "../../api/lightTypeAPI";

export default function LightTypeForm({setTypeShowForm, fetchData}){

  const [formData, setFormData] = useState({
    typeName : '',
    watts : null,
    parts : []
  })

  const handleTypeNameOnChange = (e) =>{
    const {name, value} = e.target;
    setFormData(prev=>({...prev, [name] : value }))
    console.log(formData)
  }

  const handlePartsNameOnChange = (index, field, value) =>{
    const updatedParts = [...formData.parts];
    updatedParts[index][field] = value;
    setFormData(prev => ({
      ...prev,
      parts: updatedParts
    }))
    console.log(formData)
  }

  const addPart = () => {
    setFormData(prev => ({
      ...prev,
      parts: [
        ...prev.parts,
        {
          partsName: '',
        }
      ]
    }));
  };

  const removePart = (index) => {
    const updatedParts = formData.parts.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      parts: updatedParts
    }));
  };

  const handleSubmit = async () =>{
    try{
      const response = await createLightType(formData)
      toast.success("Success")
      fetchData();
    }
    catch(err){
      toast.error(err.response.Msg)
      console.log(err.response)
    }
  }

    return<>
      {/* Card */}
      <div className="relative z-10 w-full max-w-xl bg-blue-950 backdrop-blur-xl border border-white/8 rounded-3xl p-10 m-3 shadow-[0_32px_80px_rgba(0,0,0,0.4)]">

        {/* Logo */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-end gap-1">
            <div className="w-2.5 h-8 rounded-full bg-[#e8192c]" />
            <div className="w-2.5 h-6 rounded-full bg-[#f5c800]" />
            <div className="w-2.5 h-8 rounded-full bg-[#7b9fd4]" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white tracking-[0.2em] leading-none">MING</div>
            <div className="text-[0.6rem] text-[#7b9fd4] tracking-[0.3em] mt-0.5">WORTH SPENDING</div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white">New Light Type</h2>
        <p className="text-[#6b7ea0] text-sm mt-1 mb-5">Define a new light type with its parts</p>

        <div className="flex flex-col gap-4 ">

          {/* Type Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Type Name *</label>
            <input
              name="typeName"
              value={formData.typeName}
              onChange={(e)=>handleTypeNameOnChange(e)}
              type="text"
              placeholder="e.g. LED Strip, Flood Light"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-white/30 focus:border-[#7b9fd4] transition-colors"
            />
          </div>

          {/* Parts Section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Parts</label>
              <button onClick={()=>addPart()} className="flex items-center gap-1.5 text-xs text-[#f5c800] font-semibold border border-[#f5c800]/30 px-3 py-1.5 rounded-lg hover:bg-[#f5c800]/10 transition-colors">
                + Add Part
              </button>
            </div>

            {/* Part items */}
            <div className="flex flex-col gap-2 max-h-44 overflow-y-scroll">
              {/* Part item 1 */}
              {formData.parts.map((parts, index)=>(<div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <span className="text-[#7b9fd4] text-xs font-bold w-5">{index+1}</span>
                  <input
                    name="partsName"
                    value={parts.partsName}
                    onChange={(e)=>handlePartsNameOnChange(index,'partsName',e.target.value)}
                    type="text"
                    placeholder="Enter part name"
                    className="bg-transparent w-10 text-white text-sm outline-none flex-1 placeholder:text-white/30"
                  />
                </div>
                <button onClick={()=>{removePart(index)}} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#e8192c]/10 border border-[#e8192c]/20 text-[#e8192c] text-sm hover:bg-[#e8192c]/20 transition-colors shrink-0">
                  ✕
                </button>
              </div>))}  
            </div>

            {/* Empty state */}
            {/* Uncomment when no parts added:
            <div className="text-center py-6 border border-dashed border-white/10 rounded-xl text-[#6b7ea0] text-xs">
              No parts added yet. Click "+ Add Part" to begin.
            </div>
            */}
          </div>

          {/* Submit */}
          <button onClick={handleSubmit} className="mt-2 w-full py-3.5 rounded-xl text-white font-bold text-base cursor-pointer border-none bg-linear-to-r from-[#e8192c] to-[#c0001f] shadow-[0_8px_24px_rgba(232,25,44,0.3)] hover:opacity-90 transition-opacity">
            Save Light Type →
          </button>

          <button onClick={()=>{setTypeShowForm(false)}} className="w-full py-3 rounded-xl text-[#7b9fd4] font-semibold text-sm cursor-pointer border border-white/10 bg-transparent hover:bg-white/5 transition-colors">
            Cancel
          </button>

        </div>
      </div>
    </>
}