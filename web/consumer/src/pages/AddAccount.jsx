import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs, serverTimestamp, arrayUnion } from 'firebase/firestore';
import toast from 'react-hot-toast';

const RELATIONSHIPS = [
  { value: 'owner', label: 'I am the account owner' },
  { value: 'family', label: 'Family member' },
  { value: 'tenant', label: 'Tenant / Renter' },
  { value: 'representative', label: 'Authorized representative' },
  { value: 'other', label: 'Other' },
];

const inputClass = 'w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all duration-200 text-sm';

export default function AddAccount() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    accountNumber: '',
    accountName: '',
    relationship: '',
    relationshipOther: '',
    mobileNumber: '',
  });
  const [error, setError] = React.useState('');

  const up = (fn) => (e) => fn({ ...form, [e.target.name]: e.target.value });
  const sel = (name, val) => setForm({ ...form, [name]: val });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.accountNumber.trim()) { setError('Please enter your account number.'); return; }
    if (!form.accountName.trim()) { setError('Please enter the name on the account.'); return; }
    if (!form.relationship) { setError('Please select your relationship to the account owner.'); return; }
    if (form.relationship === 'other' && !form.relationshipOther.trim()) { setError('Please specify your relationship.'); return; }
    if (!form.mobileNumber.trim()) { setError('Please provide your mobile number for verification.'); return; }

    const user = auth.currentUser;
    if (!user) { navigate('/login'); return; }

    setLoading(true);
    try {
      const can = form.accountNumber.trim().toUpperCase();

      const linkRef = doc(db, 'LinkAccounts', user.uid);
      const linkSnap = await getDoc(linkRef);
      const existingAccounts = linkSnap.exists() ? linkSnap.data().accounts || [] : [];

      if (existingAccounts.some((a) => a.accountNumber === can)) {
        setError('This account number is already linked to your profile.');
        setLoading(false);
        return;
      }

      const consumerQuery = query(collection(db, 'consumers'), where('can', '==', can));
      const consumerSnap = await getDocs(consumerQuery);

      if (consumerSnap.empty) {
        setError('Account number not found in ANTECO records. Please check your bill and try again.');
        setLoading(false);
        return;
      }

      const consumer = consumerSnap.docs[0].data();
      const nameMatch = consumer.ownerName?.toLowerCase() === form.accountName.trim().toLowerCase();

      if (!nameMatch) {
        setError('The name you entered does not match our records for this account number. Please check your bill.');
        setLoading(false);
        return;
      }

      const newAccount = {
        accountNumber: can,
        accountName: consumer.ownerName,
        relationship: form.relationship === 'other' ? form.relationshipOther.trim() : form.relationship,
        mobileNumber: form.mobileNumber.trim(),
        mobileVerified: false,
        status: 'active',
        consumerId: consumerSnap.docs[0].id,
        linkedAt: serverTimestamp(),
      };

      await setDoc(linkRef, { accounts: arrayUnion(newAccount) }, { merge: true });

      toast.success('Account verified and linked successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to link account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-start justify-center pt-8 sm:pt-16 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Link Your Account</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Connect your ANTECO electric service account to get started.</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
          {error && (
            <div className="mb-5 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 text-sm">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Account Number (CAN) <span className="text-red-400">*</span>
              </label>
              <input name="accountNumber" className={inputClass} placeholder="e.g. ANT-2025-0001" value={form.accountNumber} onChange={up(setForm)} required />
              <p className="text-xs text-gray-400 mt-1">You can find this on your electric bill.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Name of Account Owner <span className="text-red-400">*</span>
              </label>
              <input name="accountName" className={inputClass} placeholder="Exact name as shown on bill" value={form.accountName} onChange={up(setForm)} required />
              <p className="text-xs text-gray-400 mt-1">Must match the name registered with ANTECO.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Your Connection to This Account <span className="text-red-400">*</span>
              </label>
              <div className="space-y-2">
                {RELATIONSHIPS.map((rel) => (
                  <label key={rel.value}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      form.relationship === rel.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-950 dark:border-primary-700'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => sel('relationship', rel.value)}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      form.relationship === rel.value ? 'border-primary-500' : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {form.relationship === rel.value && <div className="w-2 h-2 rounded-full bg-primary-500" />}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{rel.label}</span>
                  </label>
                ))}
              </div>
              {form.relationship === 'other' && (
                <input name="relationshipOther" className={`${inputClass} mt-2`} placeholder="Please specify" value={form.relationshipOther} onChange={up(setForm)} autoFocus />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Mobile Number <span className="text-red-400">*</span>
              </label>
              <input name="mobileNumber" type="tel" className={inputClass} placeholder="0917xxxxxxx" value={form.mobileNumber} onChange={up(setForm)} required />
              <p className="text-xs text-gray-400 mt-1">We will use this to verify your identity.</p>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? 'Verifying...' : 'Verify & Link Account'}
            </button>
          </form>

          <button onClick={() => navigate('/dashboard')} className="w-full mt-3 py-3 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors font-medium">
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
