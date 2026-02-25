import { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle, CreditCard, ArrowLeft, MapPin, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function Payment() {
  const { cartTotal, clearCart } = useCart();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pickup' | null>('card');
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost/ShrawanHandicraftsFYP/backend/api/store_settings.php')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.data) {
          const s = Array.isArray(data.data) ? {} : data.data;
          setSettings(s);

          /* Handle initial payment method selection based on availability */
          if (s.esewa_enabled === 'false' && s.pickup_enabled === 'false') {
            setPaymentMethod(null);
          } else if (s.esewa_enabled === 'false' && paymentMethod === 'card') {
            setPaymentMethod('pickup');
          } else if (s.pickup_enabled === 'false' && paymentMethod === 'pickup') {
            setPaymentMethod('card');
          }
        }
      })
      .catch(err => console.error("Settings fetch error:", err));
  }, []);

  // Get checkoutId from location state (passed from Checkout.tsx)
  const checkoutId = location.state?.checkoutId;

  useEffect(() => {
    const status = searchParams.get('status');
    const err = searchParams.get('error');

    if (status === 'success' && !isSuccess) {
      setIsSuccess(true);
      clearCart();
    } else if (err && error === null) {
      setError(err === 'payment_cancelled' ? 'Payment was cancelled by user.' : 'Payment verification failed. Please try again.');
    }
  }, [searchParams, isSuccess, error, clearCart]);

  const handleProcessOrder = async () => {
    const userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
      alert("Error: No user email found. Please ensure you are logged in.");
      return;
    }

    if (!checkoutId && paymentMethod === 'card') {
      alert("Error: Checkout session not found. Please try again from the checkout page.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    if (paymentMethod === 'pickup') {
      try {
        const response = await fetch('http://localhost/ShrawanHandicraftsFYP/backend/api/update_cart_status.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: checkoutId,
            status: 'pending',
            user_email: userEmail
          })
        });

        const data = await response.json();

        if (data.success) {
          setIsProcessing(false);
          setIsSuccess(true);
          clearCart();
        } else {
          console.error("API Error:", data.message);
          setIsProcessing(false);
          alert("Could not process reservation: " + data.message);
        }
      } catch (error) {
        console.error("Reservation failed:", error);
        setIsProcessing(false);
        alert("Server connection failed.");
      }
    } else {
      // eSewa Payment Flow
      try {
        const response = await fetch('http://localhost/ShrawanHandicraftsFYP/backend/api/initiate_payment.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: cartTotal,
            id: checkoutId
          })
        });

        const data = await response.json();

        if (data.status === 'success') {
          // Create a hidden form and submit it to eSewa
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

          Object.entries(data.params).forEach(([key, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value as string;
            form.appendChild(input);
          });

          document.body.appendChild(form);
          form.submit();
        } else {
          setIsProcessing(false);
          setError(data.message || "Failed to initiate payment.");
        }
      } catch (error) {
        console.error("eSewa initiation failed:", error);
        setIsProcessing(false);
        setError("Could not connect to payment gateway.");
      }
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
            {paymentMethod === 'pickup' ? 'Order Reserved' : 'Request Received'}
          </h1>
          <p className="text-text-secondary mb-8 text-sm">
            {paymentMethod === 'pickup'
              ? "We have set your items aside. See you at the store."
              : "Payment successful. Your handcrafted items are now being prepared for shipping."}
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
              {(!settings || settings.esewa_enabled === 'true') && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center gap-4 p-4 border rounded-lg transition-all ${paymentMethod === 'card' ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-gray-200 dark:border-gray-800'}`}
                >
                  <CreditCard className={`w-5 h-5 ${paymentMethod === 'card' ? 'text-accent' : ''}`} />
                  <div className="text-left">
                    <p className="font-bold text-text-primary text-sm">Pay via Esewa</p>
                    <p className="text-[10px] text-text-secondary uppercase"></p>
                  </div>
                </button>
              )}

              {(!settings || settings.pickup_enabled === 'true') && (
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
              )}

              {settings && settings.esewa_enabled === 'false' && settings.pickup_enabled === 'false' && (
                <div className="col-span-full p-8 text-center bg-gray-50 dark:bg-gray-900 border border-dashed rounded-xl">
                  <p className="text-text-secondary italic">Checkout is temporarily disabled. Please contact the store.</p>
                </div>
              )}
            </div>

            {paymentMethod === 'card' ? (
              <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 p-5 rounded-lg text-sm">
                <h4 className="font-bold text-green-900 dark:text-green-200">Secure eSewa Payment</h4>
                <p className="mt-1 text-green-800 dark:text-green-300">Fast and secure payment with your eSewa wallet. Items will be shipped upon confirmation.</p>
              </div>
            ) : paymentMethod === 'pickup' ? (
              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 p-5 rounded-lg text-sm">
                <h4 className="font-bold text-blue-900 dark:text-blue-200">Store Reservation</h4>
                <p className="mt-1 text-blue-800 dark:text-blue-300">Items will be held for 48 hours for local pickup.</p>
              </div>
            ) : null}
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

            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-lg flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              onClick={handleProcessOrder}
              disabled={isProcessing || !paymentMethod || (settings && settings.esewa_enabled === 'false' && settings.pickup_enabled === 'false')}
              className="w-full btn-primary py-4 uppercase text-sm font-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing' : (paymentMethod === 'card' ? 'Pay with eSewa' : 'Confirm Reservation')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
