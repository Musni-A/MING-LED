import { useState } from "react"
import toast from "react-hot-toast";
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
      console.log(response.data)
      toast.success("Success")
      await fetchData()
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
    finally {
      setShowForm(false)
      setLoading(false);
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
    <>
      {/* Card */}
      <div className={`relative w-full max-w-xl bg-blue-950 backdrop-blur-xl border border-white/8 rounded-3xl p-7 shadow-[0_32px_80px_rgba(0,0,0,0.4)] duration-300 transition-transform ${showForm ? 'scale-100' : 'scale-70 pointer-events-none'} `}>

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
            <h2 className="text-2xl font-extrabold text-white leading-none">New Watts</h2>
            <p className="text-[0.6rem] text-[#7b9fd4] tracking-[0.3em] mt-0.5">Define a new watts type with its parts</p>
          </div>
        </div>


        <div className="flex flex-col gap-4 ">

          {/* Type Name - Show as disabled text since it comes from selection */}
          <div className="flex justify-between gap-1">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Type Name *</label>
              <select 
                className="bg-white/5 border sm:w-full w-35 border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-white/30 focus:border-[#7b9fd4] transition-colors"
                onChange={(e) => {
                  const type = lightTypes.find(t => t.typeName === e.target.value)
                  handleTypeSelect(type)
                }}
                value={selectedType?.typeName || ''}
              >
                <option value="" disabled className="text-gray-500">Select a type</option>
                {lightTypes.map((type) => (
                  <option key={type._id} value={type.typeName} className="text-black">
                    {type.typeName}
                  </option>
                ))}
              </select>
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
            <label className="text-xs text-[#7b9fd4] font-semibold uppercase tracking-wide">Watts</label>
            <input 
              value={formData.watts} 
              name="watts" 
              onChange={handleTypeNameOnChange} 
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-white/30 focus:border-[#7b9fd4] transition-colors"
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
                      <span className="text-[#7b9fd4] text-xs font-bold w-5">{index + 1}.</span>
                      
                      {/* Part Name - Display only (from selected type) */}
                      <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-2 py-3">
                        <input
                          value={part.partsName}
                          disabled
                          className="bg-transparent w-20 text-white/60 text-sm outline-none flex-1 cursor-not-allowed"
                        />
                      </div>
                      
                      {/* Quantity - Editable */}
                      <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#7b9fd4]">
                        <input
                          value={part.quantity}
                          onChange={(e) => handlePartsNameOnChange(index, 'quantity', e.target.value)}
                          type="number"
                          placeholder="Enter quantity"
                          className="bg-transparent w-10 text-white text-sm outline-none flex-1 placeholder:text-white/30"
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
          <div className="flex justify-evenly gap-4">
            {loading ? (
              <div className="mt-2 w-full py-3.5 rounded-xl text-white font-bold text-base cursor-pointer border-none bg-linear-to-r from-[#e8192c] to-[#c0001f] shadow-[0_8px_24px_rgba(232,25,44,0.3)] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                <LoaderIcon className="animate-spin mx-auto" />
              </div>
            ) : (
              <button 
                onClick={handleSubmit} 
                disabled={!selectedType || !formData.watts}
                className="mt-2 w-full py-3.5 rounded-xl text-white font-bold text-base cursor-pointer border-none bg-linear-to-r from-[#e8192c] to-[#c0001f] shadow-[0_8px_24px_rgba(232,25,44,0.3)] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
              Save Light Type →
            </button>)}

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
              className="mt-2 w-full py-3.5 rounded-xl text-[#7b9fd4] font-semibold text-sm cursor-pointer border border-white/10 bg-transparent hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  )
}