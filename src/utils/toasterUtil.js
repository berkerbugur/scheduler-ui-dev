import {toast} from "sonner";

const errorToast = (message) => {
    toast.error(message || 'Unexpected Error')
}

const successToast = (message) => {
    toast.error(message || 'Operation Successful')
}

const loaderToast = () => {
    toast.loading("Working")
}

const dismissToast = () => {
    toast.dismiss()
}

export {errorToast, successToast, loaderToast, dismissToast}