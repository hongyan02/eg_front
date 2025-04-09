import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import UserConfigPage from './pages/userConf';
import DoorAccessManagement from './pages/doorAccess';
import DoorRuleManagement from './pages/doorRule';
import AccessAbnormalPage from './pages/accessAbnormal';
import OutRequestManagement from './pages/outRequest';
import LeaderConfirmPage from './pages/leaderConfirm';
import { useEffect } from 'react';

function App() {
  // 全局消息监听
  useEffect(() => {
    const handleMessage = (event) => {
      console.log('收到父页面消息:', event.data);
      try {
        const data = event.data;
        if (data && data.type === 'cookie') {
          if (data.userName) {
            sessionStorage.setItem('userName', data.userName);
            console.log('已获取到的userName:', sessionStorage.getItem('userName'));
          }
        }
      } catch (error) {
        console.error('处理父页面消息时出错:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  return (
    <Router>
        <Routes>
          <Route path="/user-config" element={<UserConfigPage />} />
          <Route path="/door-access" element={<DoorAccessManagement />} />
          <Route path="/door-rule" element={<DoorRuleManagement />} />
          <Route path="/check-hr" element={<AccessAbnormalPage />} />
          <Route path="/out-request" element={<OutRequestManagement />} />
          <Route path="/check-leader" element={<LeaderConfirmPage />} />
        </Routes>
    </Router>
  );
}

export default App;
