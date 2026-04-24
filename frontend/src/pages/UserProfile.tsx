import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Trash2,
  Edit2,
  Save,
  Package,
  Phone,
  LogOut,
  Settings
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

type Address = {
  id: number;
  type: string;
  address: string;
  phone: string;
};

export function UserProfile() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      type: 'Home',
      address: 'Thamel, Kathmandu',
      phone: '+977 98XXXXXXXX'
    }
  ]);

  // Fetch checkout_details from database on mount
  useEffect(() => {
    const fetchCheckoutDetails = async () => {
      const userEmail = user?.email || localStorage.getItem('userEmail');
      if (!userEmail) return;

      try {
        const res = await fetch(`http://localhost/ShrawanHandicraftsFYP/backend/api/get_checkout_details.php?email=${encodeURIComponent(userEmail)}`);
        const result = await res.json();
        if (result.status === 'success' && result.data) {
          const d = result.data;
          setAddresses([
            {
              id: d.id || 1,
              type: d.city || '',
              address: d.address || '',
              phone: d.phone || ''
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching checkout details:', error);
      }
    };
    fetchCheckoutDetails();
  }, [user?.email]);

  const [addressForm, setAddressForm] = useState<Address>({
    id: 0,
    type: '',
    address: '',
    phone: ''
  });


  const saveProfile = () => {
    updateProfile({ name: profileData.name });
    setIsEditingProfile(false);
  };


  const saveAddress = async () => {
    const userEmail = user?.email || localStorage.getItem('userEmail');
    if (!userEmail) return;

    try {
      // Save to checkout_details
      const payload = {
        email: userEmail,
        firstName: 'User',
        lastName: 'Address',
        address: addressForm.address,
        city: addressForm.type,
        postalCode: '44600',
        country: 'NP',
        fullPhone: addressForm.phone,
        cart: [],
        totalAmount: 0
      };

      const res = await fetch('http://localhost/ShrawanHandicraftsFYP/backend/api/save_checkout.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (result.status === 'success') {
        // Update local state with the saved address
        setAddresses([
          {
            id: result.checkout_id || addressForm.id,
            type: addressForm.type,
            address: addressForm.address,
            phone: addressForm.phone
          }
        ]);
        resetAddressForm();
      }
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const editAddress = (addr: Address) => {
    setAddressForm(addr);
    setEditingAddressId(addr.id);
    setShowAddForm(true);
  };
const deleteAddress = async (id: number) => {
  try {
    const res = await fetch(`http://localhost/ShrawanHandicraftsFYP/backend/api/manage-addresses.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: id,
        action: 'clear',
        type: '',
        address: '',
        phone: ''
      })
    });

    const result = await res.json();
    console.log('Delete response:', result);

    if (result.status === 'success') {
      // Remove from local state after successful db clear
      setAddresses(prev => prev.filter(a => a.id !== id));
      alert('Address deleted successfully');
    } else {
      alert('Failed to delete: ' + result.message);
    }
  } catch (error) {
    console.error('Error clearing address:', error);
    alert('Error deleting address: ' + error.message);
  }
};
//  const deleteAddress = async (id: number) => {
//   try {
//     const res = await fetch(`http://localhost/ShrawanHandicraftsFYP/backend/api/manage-addresses.php?id=${id}`, {
//       method: 'DELETE',
//       headers: { 'Content-Type': 'application/json' }
//     });

//     const result = await res.json();
//     if (result.status === 'success') {
//       // Remove from local state after successful DB deletion
//       setAddresses(prev => prev.filter(a => a.id !== id));
//     }
//   } catch (error) {
//     console.error('Error deleting address:', error);
//   }
// };

  const resetAddressForm = () => {
    setAddressForm({ id: 0, type: '', address: '', phone: '' });
    setEditingAddressId(null);
    setShowAddForm(false);
  };


  return (
    <div className="min-h-screen pt-24 pb-20 bg-bg-light dark:bg-bg-dark px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-serif text-4xl font-bold mb-8 text-text-primary">
          My Account
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* SIDEBAR */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-bg-card p-6 rounded-2xl text-center border min-h-[280px] flex flex-col justify-center">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}`}
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-bold">{user?.name}</h3>
              <p className="text-sm text-text-secondary flex justify-center gap-2">
                <Mail className="w-4 h-4" /> {user?.email}
              </p>
            </div>

            <nav className="bg-bg-card rounded-2xl border overflow-hidden min-h-[230px]">
              <button
                onClick={() => navigate('/profile')}
                className={`w-full p-4 text-left font-medium transition-colors ${location.pathname === '/profile'
                  ? 'text-accent bg-accent/5 border-l-4 border-accent'
                  : 'hover:bg-bg-light dark:hover:bg-bg-dark'
                  }`}
              >
                <User className="inline w-5 h-5 mr-2" /> Account Details
              </button>

              <button
                onClick={() => navigate('/orders')}
                className={`w-full p-4 text-left font-medium transition-colors ${location.pathname === '/orders'
                  ? 'text-accent bg-accent/5 border-l-4 border-accent'
                  : 'hover:bg-bg-light dark:hover:bg-bg-dark'
                  }`}
              >
                <Package className="inline w-5 h-5 mr-2" /> My Orders
              </button>

              {/* <button
                onClick={() => navigate('/saved-items')}
                className={`w-full p-4 text-left font-medium transition-colors ${location.pathname === '/saved-items'
                  ? 'text-accent bg-accent/5 border-l-4 border-accent'
                  : 'hover:bg-bg-light dark:hover:bg-bg-dark'
                  }`}
              >
                <Plus className="inline w-5 h-5 mr-2" /> Saved Items
              </button> */}

              <button
                onClick={() => navigate('/settings')}
                className={`w-full p-4 text-left font-medium transition-colors ${location.pathname === '/settings'
                  ? 'text-accent bg-accent/10 border-l-4 border-accent'
                  : 'hover:bg-bg-light dark:hover:bg-bg-dark'
                  }`}
              >
                <Settings className="inline w-5 h-5 mr-2" /> Settings
              </button>

              <button
                onClick={() => { logout(); navigate('/'); }}
                className="w-full p-4 text-left font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors border-t"
              >
                <LogOut className="inline w-5 h-5 mr-2" /> Logout
              </button>
            </nav>
          </div>

          {/* MAIN */}
          <div className="lg:col-span-8 space-y-6 mt-1">

            <div className="bg-bg-card p-8 rounded-2xl border min-h-[280px]">
              <div className="flex justify-between mb-8">
                <h2 className="text-2xl font-bold">Personal Information</h2>
                <button
                  onClick={() =>
                    isEditingProfile ? saveProfile() : setIsEditingProfile(true)
                  }
                  className="text-accent flex gap-2"
                >
                  {isEditingProfile ? <Save /> : <Edit2 />}
                  {isEditingProfile ? 'Save' : 'Edit'}
                </button>
              </div>

              <div className="space-y-4">
                <input
                  className="input-field"
                  value={profileData.name}
                  disabled={!isEditingProfile}
                  onChange={e =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                />

                <input
                  className="input-field bg-gray-100 cursor-not-allowed"
                  value={profileData.email}
                  disabled
                />
              </div>
            </div>

            {/* ADDRESSES */}
            <div className="bg-bg-card p-6 rounded-2xl border min-h-[230px]">
              <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-bold">Saved Addresses</h2>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="text-accent flex gap-2"
                >
                  {/* <Plus /> Add New */}
                </button>
              </div>

              {/* ADDRESS FORM */}
              {showAddForm && (
                <div className="mb-6 space-y-3 border p-4 rounded-lg">
                  <input
                    placeholder="City"
                    className="input-field"
                    value={addressForm.type}
                    onChange={e =>
                      setAddressForm({ ...addressForm, type: e.target.value })
                    }
                  />
                  <input
                    placeholder="Address"
                    className="input-field"
                    value={addressForm.address}
                    onChange={e =>
                      setAddressForm({ ...addressForm, address: e.target.value })
                    }
                  />
                  <input
                    placeholder="Phone Number"
                    className="input-field"
                    value={addressForm.phone}
                    onChange={e =>
                      setAddressForm({ ...addressForm, phone: e.target.value })
                    }
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={saveAddress}
                      className="px-4 py-2 bg-accent text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={resetAddressForm}
                      className="px-4 py-2 border rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* ADDRESS LIST */}
              <AnimatePresence>
                {addresses.map(addr => (
                  <motion.div
                    key={addr.id}
                    layout
                    className="border p-4 rounded-lg mb-3 flex justify-between"
                  >
                    <div>
                      <p className="font-bold">{addr.type}</p>
                      <p className="text-sm">{addr.address}</p>
                      <p className="text-sm flex gap-2">
                        <Phone className="w-4 h-4" /> {addr.phone}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => editAddress(addr)}>
                        <Edit2 />
                      </button>
                      <button onClick={() => deleteAddress(addr.id)}>
                        <Trash2 />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
