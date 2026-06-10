import { useState } from "react"
import toast, { Toaster } from "react-hot-toast";
import { createLightType } from "../../api/lightTypeAPI";
import { LoaderIcon } from "lucide-react";

export default function LightTypeForm({setTypeShowForm, fetchData}){

  const [loading, setLoading] = useState(false)

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
    setLoading(true);
    try{
      const response = await createLightType(formData)
      toast.success(response.data.Msg)
      fetchData();
    }
    catch(err){
      toast.error(err.response.data.Msg)
    }
    finally{
      setLoading(false);
      setTypeShowForm(false);
    }
  }

    return (
      <>
        <Toaster />
        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-xl">

          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 12h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">New Light Type</h3>
                <p className="text-xs text-slate-400 font-medium">Define a new light type with its parts</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setTypeShowForm(false)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-4 ">

          {/* Type Name */}
          <div className="flex flex-col gap-1.5">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Type Name *</label>
            <div className="relative">
              <input
                name="typeName"
                value={formData.typeName}
                onChange={(e)=>handleTypeNameOnChange(e)}
                type="text"
                placeholder="e.g. LED Strip, Flood Light"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 text-sm outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-350"
              />
            </div>
          </div>

          {/* Parts Section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide">Parts</label>
              <button onClick={()=>addPart()} className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold border border-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                + Add Part
              </button>
            </div>

            {/* Part items */}
            <div className="flex flex-col gap-2 max-h-44 overflow-y-scroll">
              {/* Part item 1 */}
              {formData.parts.map((parts, index)=>(
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-150 rounded-xl px-4 py-3">
                    <span className="text-slate-500 text-xs font-semibold w-5">{index+1}</span>
                    <input
                      name="partsName"
                      value={parts.partsName}
                      onChange={(e)=>handlePartsNameOnChange(index,'partsName',e.target.value)}
                      type="text"
                      placeholder="Enter part name"
                      className="bg-transparent w-10 text-slate-800 text-sm outline-none flex-1 placeholder:text-slate-350"
                    />
                  </div>
                  <button onClick={()=>{removePart(index)}} className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm hover:bg-red-100 transition-colors shrink-0">
                    ✕
                  </button>
                </div>
              ))}  
            </div>

            {/* Empty state */}
            {/* Uncomment when no parts added:
            <div className="text-center py-6 border border-dashed border-white/10 rounded-xl text-[#6b7ea0] text-xs">
              No parts added yet. Click "+ Add Part" to begin.
            </div>
            */}
          </div>

          {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setTypeShowForm(false)}
                className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              {loading ? (
                <div className="px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-700 text-white text-xs font-bold shadow-md">
                  <LoaderIcon className="animate-spin mx-auto" />
                </div>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-700 text-white hover:opacity-95 text-xs font-bold shadow-md"
                >
                  Save Light Type
                </button>
              )}
            </div>

          </div>
        </div>
      </>
    )
}