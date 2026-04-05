import  toast from "react-hot-toast";

export const handleUpdate = async (API, toastSuccMsg, toastErrMsg, form, arithType, show, loading)=>{
    loading(true)
    try{
        const response = await API(form, arithType);
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