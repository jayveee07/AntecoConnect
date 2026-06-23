import { auth, db } from '../firebase';
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';

export const consumptionService = {
  getConsumption: async () => {
    const user = auth.currentUser;
    if (!user) return { data: [], monthly: [] };
    const snap = await getDocs(
      query(collection(db, 'consumptionData'), where('userId', '==', user.uid), where('periodType', '==', 'monthly'), orderBy('periodDate', 'desc'), orderBy('periodYear', 'desc'))
    );
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return { data, monthly: data.slice(0, 12).reverse() };
  },

  getForecast: async () => {
    const user = auth.currentUser;
    if (!user) return null;
    const snap = await getDocs(
      query(collection(db, 'aiPredictions'), where('userId', '==', user.uid), orderBy('predictionDate', 'desc'), limit(1))
    );
    return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
  },

  getSavingTips: async () => {
    const snap = await getDocs(
      query(collection(db, 'energySavingTips'), where('isActive', '==', true), orderBy('sortOrder', 'asc'))
    );
    if (snap.empty) {
      return [
        { id: '1', category: 'Cooling', title: 'Optimize Air Conditioner Usage', description: 'Set your AC to 25°C and use a timer to reduce energy consumption by up to 20%.', difficulty: 'easy', estimatedSavingsPercent: 20 },
        { id: '2', category: 'Lighting', title: 'Switch to LED Bulbs', description: 'LED bulbs use up to 80% less energy than incandescent bulbs and last much longer.', difficulty: 'easy', estimatedSavingsPercent: 15 },
        { id: '3', category: 'Appliances', title: 'Unplug Devices When Not in Use', description: 'Standby power can account for up to 10% of your electricity bill. Unplug devices when not in use.', difficulty: 'easy', estimatedSavingsPercent: 10 },
        { id: '4', category: 'Laundry', title: 'Use Cold Water for Laundry', description: 'Heating water accounts for 90% of the energy used by washing machines. Use cold water when possible.', difficulty: 'easy', estimatedSavingsPercent: 8 },
      ];
    }
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
};
