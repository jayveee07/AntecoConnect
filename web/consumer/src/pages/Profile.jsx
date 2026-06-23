import React from 'react';
import { User, Mail, Phone, MapPin, Building2, Shield, Bell, LogOut, ChevronRight, Pen, Check, X, Eye, EyeOff, Zap, Camera } from 'lucide-react';
import { authService } from '../services';
import toast from 'react-hot-toast';

function ProfileField({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
      <Icon className="w-5 h-5 text-gray-400" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium text-sm">{value || '\u2014'}</p>
      </div>
    </div>
  );
}

export default function Profile({ onLogout }) {
  const [profile, setProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [editing, setEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState({});
  const [editSaving, setEditSaving] = React.useState(false);

  const [activeSection, setActiveSection] = React.useState('profile');

  const [passForm, setPassForm] = React.useState({ current_password: '', password: '', password_confirmation: '' });
  const [showPass, setShowPass] = React.useState({ current: false, new: false, confirm: false });
  const [passLoading, setPassLoading] = React.useState(false);

  const [notifPrefs, setNotifPrefs] = React.useState({
    push_notifications: true,
    email_notifications: true,
    sms_notifications: false,
    billing_reminders: true,
    outage_alerts: true,
    announcement_updates: true,
    request_updates: true,
    promotional: false,
  });

  const [linkedAccounts, setLinkedAccounts] = React.useState([]);
  const [showAddAccount, setShowAddAccount] = React.useState(false);
  const [newAccountNumber, setNewAccountNumber] = React.useState('');
  const [addingAccount, setAddingAccount] = React.useState(false);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await authService.getProfile();
        const u = data.user || data.data || data;
        setProfile(u);
        setEditForm({
          first_name: u.first_name || '',
          last_name: u.last_name || '',
          mobile_number: u.mobile_number || '',
          address_line1: u.address_line1 || '',
          barangay: u.barangay || '',
          city: u.city || '',
          province: u.province || '',
          zip_code: u.zip_code || '',
        });
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const user = profile || JSON.parse(localStorage.getItem('user') || '{}');

  const handleEditSave = async (e) => {
    e.preventDefault();
    setEditSaving(true);
    try {
      const { data } = await authService.updateProfile(editForm);
      setProfile(data.user || data.data || data);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setEditSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passForm.password !== passForm.password_confirmation) {
      toast.error('Passwords do not match'); return;
    }
    if (passForm.password.length < 8) {
      toast.error('Password must be at least 8 characters'); return;
    }
    setPassLoading(true);
    try {
      await authService.changePassword(passForm);
      setPassForm({ current_password: '', password: '', password_confirmation: '' });
      toast.success('Password changed successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPassLoading(false);
    }
  };

  const handleAddAccount = async () => {
    if (!newAccountNumber.trim()) return;
    setAddingAccount(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setLinkedAccounts([...linkedAccounts, { account_number: newAccountNumber, status: 'pending', service_address: 'Verification pending...' }]);
      setNewAccountNumber('');
      setShowAddAccount(false);
      toast.success('Account link request submitted');
    } catch {
      toast.error('Failed to link account');
    } finally {
      setAddingAccount(false);
    }
  };

  const handleRemoveAccount = (accountNumber) => {
    setLinkedAccounts(linkedAccounts.filter((a) => a.account_number !== accountNumber));
    toast.success('Account unlinked');
  };

  const Field = ({ name, label, type, placeholder, value, onChange, className }) => (
    <div className={className}>
      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
      <input name={name} type={type || 'text'} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all" value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );

  const TabBtn = ({ section, icon: Icon, label }) => (
    <button onClick={() => setActiveSection(section)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeSection === section ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
      <Icon className="w-4 h-4" /> {label}
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <TabBtn section="profile" icon={User} label="Profile" />
        <TabBtn section="security" icon={Shield} label="Security" />
        <TabBtn section="notifications" icon={Bell} label="Notifications" />
        <TabBtn section="accounts" icon={Zap} label="Accounts" />
      </div>

      {activeSection === 'profile' && (
        <>
          <div className="card text-center relative">
            <div className="w-20 h-20 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 relative group">
              <User className="w-10 h-10 text-white" />
              <button className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </button>
            </div>
            <h2 className="text-xl font-bold">{user.first_name} {user.last_name}</h2>
            <p className="text-sm text-gray-500">{user.consumer_code || 'ANTECO Member'}</p>
            <span className="badge-info mt-2 inline-block">{user.is_verified ? 'Verified Account' : 'Pending Verification'}</span>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Personal Information</h3>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-sm text-primary-500 hover:text-primary-600 font-semibold">
                  <Pen className="w-4 h-4" /> Edit
                </button>
              ) : null}
            </div>
            {editing ? (
              <form onSubmit={handleEditSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field name="first_name" label="First Name" value={editForm.first_name} onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })} />
                  <Field name="last_name" label="Last Name" value={editForm.last_name} onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })} />
                </div>
                <Field name="mobile_number" label="Mobile Number" type="tel" value={editForm.mobile_number} onChange={(e) => setEditForm({ ...editForm, mobile_number: e.target.value })} />
                <Field name="address_line1" label="Home Address" value={editForm.address_line1} onChange={(e) => setEditForm({ ...editForm, address_line1: e.target.value })} />
                <div className="grid grid-cols-3 gap-3">
                  <Field name="barangay" label="Barangay" value={editForm.barangay} onChange={(e) => setEditForm({ ...editForm, barangay: e.target.value })} />
                  <Field name="city" label="City" value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} />
                  <Field name="province" label="Province" value={editForm.province} onChange={(e) => setEditForm({ ...editForm, province: e.target.value })} />
                </div>
                <Field name="zip_code" label="Zip Code" value={editForm.zip_code} onChange={(e) => setEditForm({ ...editForm, zip_code: e.target.value })} />
                <div className="flex gap-3">
                  <button type="submit" disabled={editSaving} className="flex-1 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {editSaving && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
                    {editSaving ? 'Saving...' : <><Check className="w-4 h-4" /> Save Changes</>}
                  </button>
                  <button type="button" onClick={() => setEditing(false)} className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center gap-2">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProfileField icon={User} label="First Name" value={user.first_name} />
                <ProfileField icon={User} label="Last Name" value={user.last_name} />
                <ProfileField icon={Mail} label="Email" value={user.email} />
                <ProfileField icon={Phone} label="Mobile Number" value={user.mobile_number} />
                <ProfileField icon={MapPin} label="Address" value={user.address_line1} />
                <ProfileField icon={Building2} label="Barangay/City" value={`${user.barangay || ''}${user.barangay && user.city ? ', ' : ''}${user.city || ''}`} />
              </div>
            )}
          </div>
        </>
      )}

      {activeSection === 'security' && (
        <div className="card space-y-6">
          <h3 className="font-semibold text-lg">Security Settings</h3>
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Change Password</h4>
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Current Password</label>
              <div className="relative">
                <input type={showPass.current ? 'text' : 'password'} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all pr-10" value={passForm.current_password} onChange={(e) => setPassForm({ ...passForm, current_password: e.target.value })} required />
                <button type="button" onClick={() => setShowPass({ ...showPass, current: !showPass.current })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">New Password</label>
              <div className="relative">
                <input type={showPass.new ? 'text' : 'password'} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all pr-10" minLength={8} value={passForm.password} onChange={(e) => setPassForm({ ...passForm, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPass({ ...showPass, new: !showPass.new })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Confirm New Password</label>
              <div className="relative">
                <input type={showPass.confirm ? 'text' : 'password'} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all pr-10" value={passForm.password_confirmation} onChange={(e) => setPassForm({ ...passForm, password_confirmation: e.target.value })} required />
                <button type="button" onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={passLoading} className="py-3 px-6 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all disabled:opacity-50 flex items-center gap-2">
              {passLoading && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
              {passLoading ? 'Changing...' : 'Change Password'}
            </button>
          </form>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Account Actions</h4>
            <div className="space-y-2">
              <button className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                <Shield className="w-4 h-4" /> Enable Two-Factor Authentication
              </button>
              <button className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors">
                <X className="w-4 h-4" /> Request Account Deletion
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'notifications' && (
        <div className="card space-y-6">
          <h3 className="font-semibold text-lg">Notification Preferences</h3>
          <p className="text-sm text-gray-500">Choose how you want to receive updates about your account and ANTECO services.</p>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Channels</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: 'push_notifications', label: 'Push Notifications', desc: 'In-app notifications' },
                { key: 'email_notifications', label: 'Email', desc: 'Send to your email' },
                { key: 'sms_notifications', label: 'SMS', desc: 'Text messages' },
              ].map((ch) => (
                <label key={ch.key} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{ch.label}</p>
                    <p className="text-xs text-gray-400">{ch.desc}</p>
                  </div>
                  <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${notifPrefs[ch.key] ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${notifPrefs[ch.key] ? 'translate-x-5' : ''}`} />
                    <input type="checkbox" className="sr-only" checked={notifPrefs[ch.key]} onChange={() => setNotifPrefs({ ...notifPrefs, [ch.key]: !notifPrefs[ch.key] })} />
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Notifications Types</h4>
            <div className="space-y-2">
              {[
                { key: 'billing_reminders', label: 'Billing Reminders', desc: 'Due date reminders and payment confirmations' },
                { key: 'outage_alerts', label: 'Outage Alerts', desc: 'Planned and emergency interruption notices' },
                { key: 'announcement_updates', label: 'Announcements', desc: 'News and general announcements from ANTECO' },
                { key: 'request_updates', label: 'Request Updates', desc: 'Status changes on your service requests and tickets' },
                { key: 'promotional', label: 'Promotional', desc: 'Special offers and programs' },
              ].map((item) => (
                <label key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                  <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${notifPrefs[item.key] ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${notifPrefs[item.key] ? 'translate-x-5' : ''}`} />
                    <input type="checkbox" className="sr-only" checked={notifPrefs[item.key]} onChange={() => setNotifPrefs({ ...notifPrefs, [item.key]: !notifPrefs[item.key] })} />
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button className="py-3 px-6 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all">
            Save Preferences
          </button>
        </div>
      )}

      {activeSection === 'accounts' && (
        <div className="card space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Linked Electric Accounts</h3>
            <button onClick={() => setShowAddAccount(true)} className="flex items-center gap-1.5 text-sm text-primary-500 hover:text-primary-600 font-semibold">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Account
            </button>
          </div>

          {linkedAccounts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">No linked accounts yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">Link your electric service account to manage bills and services.</p>
              <button onClick={() => setShowAddAccount(true)} className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all">Link Your First Account</button>
            </div>
          ) : (
            <div className="space-y-3">
              {linkedAccounts.map((acct) => (
                <div key={acct.account_number} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{acct.account_number}</p>
                      <p className="text-xs text-gray-400">{acct.service_address || acct.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      acct.status === 'active' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                      acct.status === 'pending' ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-500'
                    }`}>{acct.status}</span>
                    <button onClick={() => handleRemoveAccount(acct.account_number)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showAddAccount && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowAddAccount(false)}>
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <h4 className="text-lg font-semibold mb-4">Link Account</h4>
                <p className="text-sm text-gray-500 mb-4">Enter your ANTECO account number to link it to your profile.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Account Number</label>
                    <input className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all" placeholder="Enter your account number" value={newAccountNumber} onChange={(e) => setNewAccountNumber(e.target.value)} />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setShowAddAccount(false)} className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">Cancel</button>
                    <button onClick={handleAddAccount} disabled={addingAccount || !newAccountNumber.trim()} className="flex-1 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      {addingAccount && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
                      {addingAccount ? 'Linking...' : 'Link Account'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <button onClick={onLogout} className="flex items-center justify-center gap-2 w-full p-4 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all font-medium">
        <LogOut className="w-5 h-5" /> Sign Out
      </button>
    </div>
  );
}
