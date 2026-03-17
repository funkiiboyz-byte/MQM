import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await api('/devices');
      setDevices(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const forceLogout = async (id) => {
    try {
      await api(`/devices/${id}`, { method: 'DELETE' });
      toast.success('Device session removed');
      load();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="panel">
      <h2>Devices / Sessions</h2>
      {loading ? (
        <p>Loading sessions...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Device</th>
              <th>Login Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device.id}>
                <td>{device.device}</td>
                <td>{new Date(device.createdAt).toLocaleString()}</td>
                <td>
                  <button type="button" onClick={() => forceLogout(device.id)}>
                    Force Logout
                  </button>
                </td>
              </tr>
            ))}
            {!devices.length && (
              <tr>
                <td colSpan="3">No active session found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
