import { motion } from 'framer-motion';
import { Award, Users, Globe, Heart } from 'lucide-react';
export function About() {
  const stats = [{
    icon: Award,
    label: 'Years of Excellence',
    value: '50+'
  }, {
    icon: Users,
    label: 'Master Artisans',
    value: '200+'
  }, {
    icon: Globe,
    label: 'Countries Served',
    value: '45+'
  }, {
    icon: Heart,
    label: 'Happy Customers',
    value: '10K+'
  }];
  const values = [{
    title: 'Authenticity',
    description: 'Every piece is handcrafted by skilled Nepali artisans using traditional techniques passed down through generations.',
    icon: '🎨'
  }, {
    title: 'Quality',
    description: 'We source only the finest materials from the Himalayas, ensuring each product meets our rigorous quality standards.',
    icon: '⭐'
  }, {
    title: 'Sustainability',
    description: 'We practice ethical sourcing and fair trade, supporting local communities while preserving traditional crafts.',
    icon: '🌱'
  }, {
    title: 'Heritage',
    description: 'We celebrate and preserve centuries-old Nepali craftsmanship, keeping cultural traditions alive for future generations.',
    icon: '🏔️'
  }];
  return <div className="min-h-screen pt-24 pb-12 bg-bg-light dark:bg-bg-dark">
      {/* Hero Banner */}
      <div className="relative h-[500px] mb-20 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1600" alt="Himalayan Landscape" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl">
            <motion.h1 initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8
          }} className="font-serif text-5xl md:text-7xl font-bold text-white mb-6">
              Our Story
            </motion.h1>
            <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            delay: 0.2
          }} className="text-white/90 text-xl md:text-2xl leading-relaxed">
              Preserving Nepalese Heritage Through Authentic Craftsmanship
            </motion.p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, index) => <motion.div key={stat.label} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.1
        }} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
                <stat.icon className="w-8 h-8 text-accent" />
              </div>
              <p className="font-serif text-4xl font-bold text-text-primary mb-2">
                {stat.value}
              </p>
              <p className="text-text-secondary text-sm">{stat.label}</p>
            </motion.div>)}
        </div>

        {/* Mission */}
        <div className="mb-24">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl font-bold text-text-primary mb-6">
              Our Mission
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-6">
              At Shrawan Handicrafts, we bridge the gap between ancient Nepali
              artisanship and the modern world. Our mission is to preserve
              traditional crafts while empowering local artisans through fair
              trade and sustainable practices.
            </p>
            <p className="text-text-secondary text-lg leading-relaxed">
              Every purchase supports skilled craftspeople and their families,
              helping to keep centuries-old traditions alive. We believe that
              true luxury lies in the hands that create it, the time dedicated
              to perfecting each piece, and the cultural heritage it represents.
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <div className="mb-24">
          <h2 className="font-serif text-4xl font-bold text-text-primary text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => <motion.div key={value.title} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }} className="bg-bg-card dark:bg-bg-card p-8 rounded-lg border border-gray-100 dark:border-gray-800">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="font-serif text-2xl font-bold text-text-primary mb-3">
                  {value.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {value.description}
                </p>
              </motion.div>)}
          </div>
        </div>

        {/* Artisans Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <motion.div initial={{
          opacity: 0,
          x: -20
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} className="order-2 md:order-1">
            <h2 className="font-serif text-4xl font-bold text-text-primary mb-6">
              Meet Our Artisans
            </h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              Our community of master artisans spans across the Kathmandu Valley
              and the high Himalayas. From weavers of fine Pashmina to sculptors
              of intricate wooden figures, we work directly with families who
              have honed their craft for generations.
            </p>
            <p className="text-text-secondary leading-relaxed mb-6">
              Each artisan brings unique skills and cultural knowledge to their
              work. By ensuring fair wages and sustainable practices, we help
              preserve these traditional skills for future generations while
              providing meaningful livelihoods.
            </p>
            <p className="text-text-secondary leading-relaxed">
              When you purchase from Shrawan Handicrafts, you're not just buying
              a product—you're supporting a family, preserving a tradition, and
              owning a piece of living history.
            </p>
          </motion.div>
          <motion.div initial={{
          opacity: 0,
          x: 20
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true
        }} className="order-1 md:order-2 h-[500px] rounded-lg overflow-hidden shadow-xl">
            <img src="https://images.unsplash.com/photo-1660796334912-8ce8e9c2cff0?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Artisan at work" className="w-full h-full object-cover" />
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="text-center bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl p-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Experience Authentic Craftsmanship
          </h2>
          <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
            Explore our collection of handcrafted treasures and bring a piece of
            the Himalayas into your home.
          </p>
          <a href="/collections" className="btn-primary inline-block">
            Browse Collections
          </a>
        </motion.div>
      </div>
    </div>;
}