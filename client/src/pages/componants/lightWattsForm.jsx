import { useState } from "react"
import toast, { Toaster } from "react-hot-toast";
import { createLightWatts } from "../../api/lightAPI";
import { LoaderIcon } from "lucide-react";

export default function LightWatts({showForm, setShowForm, fetchData, lightTypes}) {

  const [selectedType, setSelectedType] = useState(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    typeName: '',
    watts: '',
    parts: []
  })

  const handleTypeNameOnChange = (e) => {
    const {name, value} = e.target;
    setFormData(prev => ({...prev, [name]: value}))
    console.log(formData);
  }

  const handlePartsNameOnChange = (index, field, value) => {
    const updatedParts = [...formData.parts];
    updatedParts[index] = {
      ...updatedParts[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      parts: updatedParts
    }))
    console.log(updatedParts);
  }

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const submitData = {
        ...formData,
        typeName: selectedType?.typeName || formData.typeName
      }
      
      const response = await createLightWatts(submitData)
      if(response){
        setLoading(false);
        setShowForm(false)
        toast.success("Success")
        await fetchData()
      }
      setFormData({
        typeName: '',
        watts: '',
        parts: []
      })
      setSelectedType(null)
    }
    catch(err) {
      toast.error(err.response?.data?.Msg || err.response?.Msg || "Something went wrong")
      console.log(err.response)
    }
  }

  const handleTypeSelect = (type) => {
    setSelectedType(type)
    
    // Initialize parts with the selected type's parts AND empty values for quantity
    const initializedParts = type.parts.map(part => ({
      partsName: part.partsName || part.name || '', // Handle whatever your API returns
      quantity: '' // Start with empty quantity
    }))
    
    setFormData(prev => ({
      ...prev,
      typeName: type.typeName,
      parts: initializedParts
    }))
  }

  return (
    <div className={`w-full max-w-xl bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl duration-300 transition-transform ${showForm ? 'scale-100' : 'scale-95 pointer-events-none'} `}>
      <Toaster />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">New Watts</h3>
                <p className="text-xs text-slate-400 font-medium">Define a new watts type with its parts</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setShowForm(false); setSelectedType(null); }}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-4 ">

          {/* Type Name - Show as disabled text since it comes from selection */}
          <div className="flex justify-between gap-1">
            <div className="flex flex-col gap-1">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Type Name *</label>
              <div className="relative">
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 text-sm outline-none focus:border-blue-400 transition-colors appearance-none cursor-pointer"
                  onChange={(e) => {
                    const type = lightTypes.find(t => t.typeName === e.target.value)
                    handleTypeSelect(type)
                  }}
                  value={selectedType?.typeName || ''}
                >
                  <option value="" disabled className="text-gray-500">Select a type</option>
                  {lightTypes.map((type) => (
                    <option key={type._id} value={type.typeName} className="text-slate-800">
                      {type.typeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Display selected type name (readonly) */}
            {selectedType && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Selected Type</label>
                <input 
                  value={selectedType.typeName} 
                  disabled
                  className="bg-white/5 border sm:w-full w-35 border-white/10 rounded-xl px-4 py-3 text-white/60 text-sm outline-none cursor-not-allowed"
                />
              </div>
            )}
          </div>

          

          <div className="flex flex-col gap-1.5">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Watts</label>
            <input 
              value={formData.watts} 
              name="watts" 
              onChange={handleTypeNameOnChange} 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 text-sm outline-none placeholder:text-slate-350 focus:border-blue-400 transition-colors"
              type="text" 
              placeholder="Enter wattage"
            />
          </div>

          {/* Parts Section */}
          <div className="flex flex-col gap-3">
            <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Parts & Quantities</label>

            {/* Part items */}
            <div className="flex flex-col gap-2 max-h-44 overflow-y-auto custom-scrollbar">
              {selectedType && formData.parts.length > 0 && (
                <div className="flex flex-col gap-2 mr-3">
                  {formData.parts.map((part, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-slate-500 text-xs font-semibold w-5">{index + 1}.</span>
                      
                      {/* Part Name - Display only (from selected type) */}
                      <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-150 rounded-xl px-3 py-2">
                        <input
                          value={part.partsName}
                          disabled
                          className="bg-transparent w-20 text-slate-800/70 text-sm outline-none flex-1 cursor-not-allowed"
                        />
                      </div>
                      
                      {/* Quantity - Editable */}
                      <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 focus-within:border-blue-400">
                        <input
                          value={part.quantity}
                          onChange={(e) => handlePartsNameOnChange(index, 'quantity', e.target.value)}
                          type="number"
                          placeholder="Enter quantity"
                          className="bg-transparent w-10 text-slate-800 text-sm outline-none flex-1 placeholder:text-slate-350"
                          min="0"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {!selectedType && lightTypes.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                  Please select a product type to view its parts
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setShowForm(false)
                  setSelectedType(null)
                  setFormData({
                    typeName: '',
                    watts: '',
                    parts: []
                  })
                }}
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
                  disabled={!selectedType || !formData.watts}
                  className="px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-700 text-white text-xs font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Watts
                </button>
              )}
            </div>
        </div>
    </div>
  )
}