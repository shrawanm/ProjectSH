import { useState /*, useEffect */ } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle, CreditCard, ArrowLeft, MapPin /*, Globe */ } from 'lucide-react';
import { motion } from 'framer-motion';

/* // Currency List for later use
const CURRENCIES = [
  { code: 'NPR', symbol: 'Rs.', label: 'Nepalese Rupee' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
];
*/

export function Payment() {
  const { cartTotal } = useCart(); // Removed clearCart from destructuring to prevent accidental usage
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pickup'>('card');
  
  /*
  // Currency Conversion States
  const [selectedCurrency, setSelectedCurrency] = useState('NPR');
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  useEffect(() => {
    const fetchRates = async () => {
      setIsLoadingRates(true);
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/NPR');
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        console.error("Failed to fetch rates:", error);
      } finally {
        setIsLoadingRates(false);
      }
    };
    fetchRates();
  }, []);

  const convertPrice = (nprAmount: number) => {
    if (selectedCurrency === 'NPR' || !exchangeRates[selectedCurrency]) {
      return nprAmount.toLocaleString();
    }
    const converted = nprAmount * exchangeRates[selectedCurrency];
    return converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  */

  const handleProcessOrder = async () => {
    //retrieve the stored user email. 
    const userEmail = localStorage.getItem('userEmail'); 

    if (!userEmail) {
      alert("Error: No user email found. Please ensure you are logged in.");
      return;
    }

    setIsProcessing(true);

    if (paymentMethod === 'pickup') {
      try {
        const response = await fetch('http://localhost/ShrawanHandicraftsFYP/backend/api/update_cart_status.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userEmail,
            status: 'pending'
          })
        });

        const data = await response.json();
        
        if (data.success) {
          setIsProcessing(false);
          setIsSuccess(true);
          // clearCart(); 
        } else {
          console.error("API Error:", data.message);
          setIsProcessing(false);
          alert("Could not process reservation: " + data.message);
        }
      } catch (error) {
        console.error("Reservation failed:", error);
        setIsProcessing(false);
        alert("Server connection failed. Check if update_cart_status.php exists and CORS is enabled.");
      }
    } else {
      //logic for international card orders (shipping quote request)
      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
        // clearCart(); 
      }, 2000);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-bg-light dark:bg-bg-dark px-4 flex items-center justify-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full bg-bg-card p-8 rounded-lg shadow-xl text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-text-primary mb-4">
            {paymentMethod === 'pickup' ? 'Order Reserved!' : 'Request Received!'}
          </h1>
          <p className="text-text-secondary mb-8 text-sm">
            {paymentMethod === 'pickup' 
              ? "We've set your items aside. See you at the store!"
              : "We are calculating your shipping. Check your email for your final quote."}
          </p>
          <Link to="/" className="block w-full btn-primary py-3">Back to Home</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-bg-light dark:bg-bg-dark px-4">
      <div className="max-w-5xl mx-auto">
        <Link to="/checkout" className="inline-flex items-center text-sm text-text-secondary hover:text-accent mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Shipping
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="font-serif text-3xl font-bold text-text-primary">Confirm Your Order</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${paymentMethod === 'card' ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-gray-200 dark:border-gray-800'}`}
              >
                <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-accent' : ''}`} />
                <div className="text-left">
                  <p className="font-bold text-text-primary text-sm">Ship Internationally</p>
                  <p className="text-[10px] text-text-secondary uppercase">Stripe</p>
                </div>
              </button>

              <button 
                type="button"
                onClick={() => setPaymentMethod('pickup')}
                className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${paymentMethod === 'pickup' ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-gray-200 dark:border-gray-800'}`}
              >
                <MapPin className={`w-5 h-5 ${paymentMethod === 'pickup' ? 'text-accent' : ''}`} />
                <div className="text-left">
                  <p className="font-bold text-text-primary text-sm">Store Pickup</p>
                  <p className="text-[10px] text-text-secondary uppercase">Pay at Store</p>
                </div>
              </button>
            </div>

            {paymentMethod === 'card' ? (
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-5 rounded-lg text-sm">
                <h4 className="font-bold text-amber-900 dark:text-amber-200 italic">International Orders:</h4>
                <p className="mt-1 text-amber-800 dark:text-amber-300">We will email you a shipping quote, No payment is required right now.</p>
              </div>
            ) : (
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 p-5 rounded-lg text-sm">
                <h4 className="font-bold text-blue-900 dark:text-blue-200">Store Reservation</h4>
                <p className="mt-1 text-blue-800 dark:text-blue-300">Items will be held for 48 hours for local pickup.</p>
              </div>
            )}
          </div>

          <div className="bg-bg-card p-6 rounded-lg border border-gray-100 dark:border-gray-800 h-fit shadow-lg">
            <h2 className="font-serif text-lg font-bold text-text-primary mb-4">Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Subtotal</span>
                <span className="text-text-primary font-bold">Rs. {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Shipping</span>
                <span className="text-accent font-bold text-xs uppercase">
                  {paymentMethod === 'pickup' ? 'Free' : 'Pending'}
                </span>
              </div>
              <div className="pt-4 border-t border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-2xl font-bold text-text-primary">Rs. {cartTotal.toLocaleString()}</p>
              </div>
            </div>

            <button 
              onClick={handleProcessOrder} 
              disabled={isProcessing} 
              className="w-full btn-primary py-4 uppercase text-sm font-black"
            >
              {isProcessing ? 'Processing...' : (paymentMethod === 'card' ? 'Request Shipping Quote' : 'Confirm Reservation')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}