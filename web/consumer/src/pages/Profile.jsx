import React from 'react';
import { User, Mail, Phone, MapPin, Building2, Shield, Bell, LogOut, ChevronRight } from 'lucide-react';
import { authService } from '../services';

export default function Profile({ onLogout }) {
  const [profile, setProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await authService.getProfile();
        setProfile(data.user || data.data || data);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const user = profile || JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="card text-center">
        <div className="w-20 h-20 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-xl font-bold">{user.first_name} {user.last_name}</h2>
        <p className="text-gray-500">{user.consumer_code || user.account_number}</p>
        <span className="badge-info mt-2 inline-block">Verified Account</span>
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold text-lg">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileField icon={User} label="First Name" value={user.first_name} />
          <ProfileField icon={User} label="Last Name" value={user.last_name} />
          <ProfileField icon={Mail} label="Email" value={user.email} />
          <ProfileField icon={Phone} label="Mobile Number" value={user.mobile_number} />
          <ProfileField icon={MapPin} label="Address" value={user.address_line1} />
          <ProfileField icon={Building2} label="Barangay/City" value={`${user.barangay || ''}, ${user.city || ''}`} />
        </div>
      </div>

      <div className="card space-y-2">
        <h3 className="font-semibold text-lg mb-4">Settings</h3>
        {[
          { icon: Shield, label: 'Security', desc: 'Password, biometrics' },
          { icon: Bell, label: 'Notifications', desc: 'Push, email, SMS preferences' },
          { icon: User, label: 'Linked Accounts', desc: 'Manage connected accounts' },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5 text-primary-500" />
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        ))}
      </div>

      <button onClick={onLogout} className="flex items-center justify-center gap-2 w-full p-4 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all font-medium">
        <LogOut className="w-5 h-5" /> Logout
      </button>
    </div>
  );
}

function ProfileField({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
      <Icon className="w-5 h-5 text-gray-400" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium text-sm">{value || '—'}</p>
      </div>
    </div>
  );
}
