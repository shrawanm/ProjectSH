import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ProfileDropdown } from './ProfileDropdown';
export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    user
  } = useAuth();
  const {
    cartCount
  } = useCart();
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const navLinks = [{
    name: 'Home',
    path: '/'
  }, {
    name: 'Collections',
    path: '/collections'
  }, {
    name: 'About',
    path: '/about'
  }];
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || location.pathname !== '/' ? 'bg-bg-light/95 dark:bg-bg-darker/95 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <h1 className={`font-serif text-2xl md:text-3xl font-bold tracking-wide transition-colors ${isScrolled || location.pathname !== '/' ? 'text-text-primary' : 'text-white'}`}>
                Shrawan<span className="text-accent">Handicrafts</span>
              </h1>
              <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => <Link key={link.name} to={link.path} className={`text-sm font-medium tracking-wider uppercase hover:text-accent transition-colors ${isScrolled || location.pathname !== '/' ? 'text-text-primary' : 'text-white/90'} ${location.pathname === link.path ? 'text-accent' : ''}`}>
                {link.name}
              </Link>)}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Search (Visual Only) */}
            <button className={`hover:text-accent transition-colors ${isScrolled || location.pathname !== '/' ? 'text-text-primary' : 'text-white/90'}`}>
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link to="/cart" className={`relative hover:text-accent transition-colors ${isScrolled || location.pathname !== '/' ? 'text-text-primary' : 'text-white/90'}`}>
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-accent text-bg-darker text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>}
            </Link>

            {/* User Profile / Login */}
            {user ? <ProfileDropdown user={user} isScrolled={isScrolled || location.pathname !== '/'} /> : <Link to="/login" className={`text-sm font-medium hover:text-accent transition-colors ${isScrolled || location.pathname !== '/' ? 'text-text-primary' : 'text-white/90'}`}>
                Login
              </Link>}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-accent" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && <div className="md:hidden absolute top-full left-0 w-full bg-bg-light dark:bg-bg-darker shadow-xl border-t border-gray-100 dark:border-gray-800 py-4 px-4 flex flex-col space-y-4">
          {navLinks.map(link => <Link key={link.name} to={link.path} className={`text-text-primary hover:text-accent font-medium py-2 border-b border-gray-100 dark:border-gray-800 ${location.pathname === link.path ? 'text-accent' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
              {link.name}
            </Link>)}
          <div className="flex items-center justify-between pt-2">
            <Link to="/cart" className="flex items-center gap-2 text-text-primary" onClick={() => setIsMobileMenuOpen(false)}>
              <ShoppingBag className="w-5 h-5" />
              <span>Cart ({cartCount})</span>
            </Link>
            {user ? <Link to="/profile" className="flex items-center gap-2 text-text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                <img src={user.avatar || "https://ui-avatars.com/api/?name=" + user.name} alt="Profile" className="w-6 h-6 rounded-full" />
                <span>Profile</span>
              </Link> : <Link to="/login" className="text-accent font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                Login
              </Link>}
          </div>
        </div>}
    </header>;
}