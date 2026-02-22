import { useToast } from '../context/ToastContext';
import './ToastContainer.css';

export default function ToastContainer() {
    const { toasts, removeToast } = useToast();

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <div key={toast.id} className={`toast-message toast-${toast.type || 'success'}`}>
                    <span>{toast.message}</span>
                    <button onClick={() => removeToast(toast.id)} className="toast-close">&times;</button>
                </div>
            ))}
        </div>
    );
}
