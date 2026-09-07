const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedUsers = [
  {
    email: 'manager@supherman.com',
    password: 'Suph3rm4n!',
    role: 'manager',
    isFirstLogin: false,
  },
  {
    email: 'comptable@supherman.com',
    password: 'Suph3rm4n!',
    role: 'comptable',
    isFirstLogin: false,
  },
  {
    email: 'employe@supherman.com',
    password: 'Suph3rm4n!',
    role: 'employe',
    isFirstLogin: false,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connecte pour le seeding...');

    // Clear existing users
    await User.deleteMany({});
    console.log('Utilisateurs existants supprimes');

    // Create users (bypass pre-save hook by creating directly)
    for (const userData of seedUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`Utilisateur cree: ${user.email} (${user.role})`);
    }

    console.log('\nSeeding termine avec succes!');
    console.log('Comptes crees:');
    console.log('  Manager:    manager@supherman.com / Suph3rm4n!');
    console.log('  Comptable:  comptable@supherman.com / Suph3rm4n!');
    console.log('  Employe:    employe@supherman.com / Suph3rm4n!');

    process.exit(0);
  } catch (error) {
    console.error('Erreur de seeding:', error.message);
    process.exit(1);
  }
};

seedDB();
