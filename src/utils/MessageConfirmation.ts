import Swal, { SweetAlertResult } from 'sweetalert2';

import light from '../styles/themes/light';

const MessageAlert = (
  text: string,
  confirmButtonText: string,
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question',
): Promise<SweetAlertResult> => {
  return Swal.fire({
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: light.colors.success,
    cancelButtonColor: light.colors.warning,
    confirmButtonText,
  });
};

export default MessageAlert;
