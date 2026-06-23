# ANTECOConnect Seed Scripts

## Option 1: Browser Console (Easy, No Setup)

1. Open the ANTECOConnect app in your browser
2. Log in with any account
3. Open DevTools (F12) → Console
4. Copy-paste the entire `seed-dev.js` file and press Enter
5. Type `seedAll()` and press Enter
6. Refresh the page to see seeded data

## Option 2: Node.js CLI (Full Control)

Requires a Firebase service account key.

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save the JSON file as `scripts/service-account.json`
4. Install dependencies:
   ```
   cd scripts
   npm install
   ```
5. Run the seeder:
   ```
   npm run seed
   ```

### What gets seeded:
- 3 test users (2 consumers, 1 admin)
- 3 linked consumer accounts
- 6 billing statements per account (mix of paid/unpaid/overdue)
- 12 months of consumption data
- Sample payments, outage reports, service requests, support tickets
- Planned interruptions, announcements
- Energy saving tips and FAQs

### Test user emails:
- juan@example.com (Consumer 1)
- maria@example.com (Consumer 2)
- admin@anteco.ph (Admin)

Note: Passwords are not seeded. Register these emails through the app first.
