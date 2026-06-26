import React from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Plus, Zap } from 'lucide-react';
import AddAccountModal from './AddAccountModal';

export default function RequireAccount({ children }) {
  const [accounts, setAccounts] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [showAddAccount, setShowAddAccount] = React.useState(false);

  React.useEffect(() => {
    const u = auth.currentUser;
    if (!u) return;
    (async () => {
      try {
        const linkSnap = await getDoc(doc(db, 'linkAccounts', u.uid));
        const accts = linkSnap.exists() ? (linkSnap.data().accounts || []) : [];
        setAccounts(accts.map((a, i) => ({ id: a.accountNumber || `acct-${i}`, ...a })));
      } catch {} finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return null;

  return (
    <>
      {accounts.length === 0 ? (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-primary-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">Link Your Account First</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
              You need to link an ANTECO service account to access this page.
            </p>
            <button onClick={() => setShowAddAccount(true)}
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/25">
              <Plus className="w-5 h-5" />
              Link Your Account
            </button>
          </div>
        </div>
      ) : children}
      <AddAccountModal open={showAddAccount} onClose={() => setShowAddAccount(false)} onLinked={() => { setShowAddAccount(false); window.location.reload(); }} />
    </>
  );
}
