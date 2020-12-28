import Swal, { SweetAlertResult } from 'sweetalert2';

const MessageAlert = (
  text: string,
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question',
): Promise<SweetAlertResult> => {
  return Swal.fire({
    text,
    icon,
    confirmButtonText: 'OK',
  });
};

export default MessageAlert;
