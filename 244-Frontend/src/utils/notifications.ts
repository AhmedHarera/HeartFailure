import toast from 'react-hot-toast';

export const notify = {
  success: (message: string) => {
    toast.success(message, {
      duration: 4000,
      position: 'top-right',
      className: 'bg-white shadow-lg rounded-lg px-4 py-3',
    });
  },
  
  error: (message: string) => {
    toast.error(message, {
      duration: 6000,
      position: 'top-right',
      className: 'bg-white shadow-lg rounded-lg px-4 py-3',
    });
  },
  
  loading: (message: string) => {
    return toast.loading(message, {
      position: 'top-right',
      className: 'bg-white shadow-lg rounded-lg px-4 py-3',
    });
  }
};