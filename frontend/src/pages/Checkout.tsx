import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Globe } from 'lucide-react';

// Phone Input Library
import 'react-phone-number-input/style.css';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';

export function Checkout() {
    const { cart, cartTotal } = useCart();
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'NP',
    });

    const [phone, setPhone] = useState<string | undefined>();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        fetch('http://localhost/ShrawanHandicraftsFYP/backend/api/store_settings.php')
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success' && data.data) {
                    setSettings(Array.isArray(data.data) ? {} : data.data);
                }
            })
            .catch(err => console.error("Settings fetch error:", err));
    }, []);

    // Prefill form from DB if user has checked out before
    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) return;

        fetch(`http://localhost/ShrawanHandicraftsFYP/backend/api/get_checkout_details.php?email=${encodeURIComponent(userEmail)}`)
            .then(res => res.json())
            .then(result => {
                if (result.status === 'success') {
                    const d = result.data;
                    setFormData({
                        email: d.email || '',
                        firstName: d.firstName || '',
                        lastName: d.lastName || '',
                        address: d.address || '',
                        city: d.city || '',
                        postalCode: d.postalCode || '',
                        country: d.country || 'NP',
                    });
                    if (d.phone) setPhone(d.phone);
                }
            })
            .catch(err => console.error('Prefill error:', err));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';

        if (!phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!isValidPhoneNumber(phone)) {
            newErrors.phone = 'Invalid phone number for the selected country';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    if (cart.length === 0) {
        navigate('/cart');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const checkoutPayload = {
                    ...formData,
                    fullPhone: phone,
                    cart: cart,
                    totalAmount: cartTotal
                };

                const response = await fetch('http://localhost/ShrawanHandicraftsFYP/backend/api/save_checkout.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(checkoutPayload)
                });

                const result = await response.json();

                if (result.status === 'success') {
                    navigate('/payment', {
                        state: {
                            ...checkoutPayload,
                            checkoutId: result.checkout_id
                        }
                    });
                } else {
                    alert("Failed to save checkout details. Please try again.");
                }
            } catch (error) {
                console.error("Checkout Error:", error);
                alert("connection error occurred.");
            }
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-bg-light dark:bg-bg-dark px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Left: Shipping Form */}
                    <div className="flex-1">
                        <div className="mb-8">
                            <Link to="/cart" className="inline-flex items-center text-sm text-text-secondary hover:text-accent mb-4">
                                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Cart
                            </Link>
                            <h1 className="font-serif text-3xl font-bold text-text-primary">Checkout</h1>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Contact Info */}
                            <section className="bg-bg-card dark:bg-bg-card p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
                                <h2 className="font-serif text-xl font-bold text-text-primary mb-4 text-accent">1. Contact Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                                        <input
                                            type="email" name="email" value={formData.email} onChange={handleChange}
                                            className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                                            placeholder=""
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>

                                    {/* International Phone Input */}
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Phone Number (International)</label>
                                        <div className={errors.phone ? 'phone-input-error' : ''}>
                                            <PhoneInput
                                                international
                                                defaultCountry="NP"
                                                value={phone}
                                                onChange={setPhone}
                                                className="input-field flex"
                                            />
                                        </div>
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>
                                </div>
                            </section>

                            {/* Shipping Address */}
                            <section className="bg-bg-card dark:bg-bg-card p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
                                <h2 className="font-serif text-xl font-bold text-text-primary mb-4 text-accent">2. Shipping Address</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">First Name</label>
                                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="input-field" />
                                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Last Name</label>
                                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="input-field" />
                                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Street Address</label>
                                        <input type="text" name="address" value={formData.address} onChange={handleChange} className="input-field" placeholder="House no, Street name" />
                                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">City</label>
                                        <input type="text" name="city" value={formData.city} onChange={handleChange} className="input-field" />
                                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">Postal Code</label>
                                        <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="input-field" />
                                        {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
                                    </div>
                                </div>
                            </section>

                            <button type="submit" className="w-full btn-primary py-4 text-lg font-bold uppercase tracking-wider">
                                Continue to Payment
                            </button>
                        </form>
                    </div>

                    {/* Right: Summary & Shipping Policy */}
                    <div className="lg:w-96 flex-shrink-0">
                        <div className="bg-bg-card dark:bg-bg-card p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
                            <h2 className="font-serif text-xl font-bold text-text-primary mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                                {cart.map(item => (
                                    <div key={`${item.id}-${JSON.stringify(item.variant)}`} className="flex gap-4">
                                        <div className="w-12 h-12 rounded bg-gray-100 flex-shrink-0 overflow-hidden relative">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-text-primary truncate">{item.name}</p>
                                            <p className="text-[10px] text-text-secondary">Rs. {item.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 mb-6">
                                <div className="flex gap-3">
                                    <Globe className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs font-bold text-amber-900 dark:text-amber-200">Official Store Contact</p>
                                        <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                                            {settings?.store_address || 'Kathmandu, Nepal'}<br />
                                            Phone: {settings?.store_phone || '+977-1234567890'}
                                        </p>
                                        <a href={`mailto:${settings?.store_email || 'shrawanhandicrafts@gmail.com'}`} className="text-[11px] font-bold underline text-amber-900 dark:text-amber-200 block mt-1">
                                            {settings?.store_email || 'shrawanhandicrafts@gmail.com'}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Items Total</span>
                                    <span className="text-text-primary font-medium">Rs. {cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Shipping</span>
                                    <span className="text-accent text-xs italic">Pending Quote</span>
                                </div>
                                <div className="flex justify-between font-bold text-xl text-text-primary pt-2 border-t border-dashed">
                                    <span>Total</span>
                                    <span>Rs. {cartTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
