import { useIdleTimer } from 'react-idle-timer';
import {useAuthStore} from '@/store/authStore'
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const IdleTimerContainer = () => {
  const { clearAuth, user } = useAuthStore();
  const navigate = useNavigate();

  const onIdle = () => {
    if (user) {
        clearAuth();
        toast.info('Your session has expired due to inactivity.');
     navigate('/auth/login', { replace: true });
    }
  };

  const onPrompt = () => {      
    toast.warning('You will be logged out due to inactivity in 30 seconds.', {
      duration: 30000,
    });
  };

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * 60, // 60 minutes
    onIdle,
    onPrompt,
    promptBeforeIdle:  1000 * 60 * 10, // 10 minutes before logout
    debounce: 500,
  });

  return null; // This component doesn't render anything
};

export default IdleTimerContainer;