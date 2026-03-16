import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const load = () => api('/devices').then(setDevices);
  useEffect(load, []);
  return <div className="panel"><h2>Devices / Sessions</h2><table><thead><tr><th>Device</th><th>Login Time</th><th>Action</th></tr></thead><tbody>{devices.map(d => <tr key={d.id}><td>{d.device}</td><td>{new Date(d.createdAt).toLocaleString()}</td><td><button onClick={async()=>{await api(`/devices/${d.id}`,{method:'DELETE'});load();}}>Force Logout</button></td></tr>)}</tbody></table></div>;
}
