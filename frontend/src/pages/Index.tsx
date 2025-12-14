import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Cookie, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function Index() {
  const navigate = useNavigate();
  const {
    user,
    loading
  } = useAuth();
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="animate-pulse-soft">
          <Cookie className="w-16 h-16 text-primary animate-float" />
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-hero overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-[10%] w-32 h-32 rounded-full bg-candy/20 animate-float" />
        <div className="absolute top-40 right-[15%] w-24 h-24 rounded-full bg-mint/30 animate-float" style={{
        animationDelay: '1s'
      }} />
        <div className="absolute bottom-32 left-[20%] w-20 h-20 rounded-full bg-accent/30 animate-float" style={{
        animationDelay: '2s'
      }} />
        <div className="absolute bottom-20 right-[25%] w-28 h-28 rounded-full bg-primary/20 animate-float" style={{
        animationDelay: '0.5s'
      }} />
        <div className="absolute top-1/2 left-[5%] w-16 h-16 rounded-full bg-caramel/20 animate-float" style={{
        animationDelay: '1.5s'
      }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-card/80 backdrop-blur-lg flex items-center justify-center shadow-soft">
              <Cookie className="w-6 h-6 text-primary" />
            </div>
            <span className="font-display text-xl font-semibold text-chocolate">
              Sweet Shop
            </span>
          </div>
          <Link to="/auth" className="px-5 py-2.5 rounded-xl bg-card/80 backdrop-blur-lg text-foreground font-medium hover:bg-card transition-colors shadow-soft">
            Sign In
          </Link>
        </header>

        {/* Hero */}
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-lg mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Sweet Shop Management System
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-chocolate mb-6 animate-slide-up">
              Manage Your
              <span className="block text-gradient">Sweet Business</span>
            </h1>

            <p className="text-lg md:text-xl text-chocolate/70 mb-10 max-w-xl mx-auto animate-slide-up" style={{
            animationDelay: '0.1s'
          }}>
              A delightful management system for your confectionery shop. 
              Track inventory, manage sales, and grow your sweet empire.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{
            animationDelay: '0.2s'
          }}>
              <Link to="/auth" className="btn-primary text-lg py-4 px-8">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/auth" className="btn-secondary text-lg py-4 px-8 bg-card/80 backdrop-blur-lg">
                Sign In
              </Link>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 animate-slide-up" style={{
            animationDelay: '0.3s'
          }}>
              {[{
              title: 'Inventory',
              desc: 'Track all your sweets'
            }, {
              title: 'Sales',
              desc: 'Monitor purchases'
            }, {
              title: 'Analytics',
              desc: 'Grow your business'
            }].map((feature, i) => <div key={feature.title} className="p-6 rounded-2xl bg-card/60 backdrop-blur-lg border border-border/50">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>)}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center">
          
        </footer>
      </div>
    </div>;
}