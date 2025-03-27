import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import UserConfigPage from './pages/userConf';
import DoorAccessManagement from './pages/doorAccess';
import DoorRuleManagement from './pages/doorRule';
import AccessAbnormalPage from './pages/accessAbnormal';
import OutRequestManagement from './pages/outRequest';
import LeaderConfirmPage from './pages/leaderConfirm';

function App() {
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
