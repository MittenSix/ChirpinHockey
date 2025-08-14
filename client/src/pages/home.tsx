import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { insertWaitlistRegistrationSchema, type InsertWaitlistRegistration } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { ContactModal } from "@/components/ContactModal";
import { Tv, SearchCheck, MessageCircle, Star, Shield, Clock, CheckCircle, Rocket, Mail, AlertCircle, Menu, X } from "lucide-react";
import chirpinLogo from "@assets/2F716E35-DBBA-4E40-B0B4-E2FD7BE5FEA0_1754346652751.png";
import gameCenterImage from "@assets/Chirpin_GameCenter_1754403116171.png";
import gameFinderImage from "@assets/Chripin_GameFinder_1754403116171.png";
import coachConnectImage from "@assets/Chirpin_CoachConnect_1754403116170.png";
import overviewImage from "@assets/Chripin_Overview_1754403116171.png";
import gameUpdatesImage from "@assets/Chirpin_GameCenter_Updates_1754403116171.png";

export default function Home() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{src: string, alt: string} | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [emailValidationState, setEmailValidationState] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const form = useForm<InsertWaitlistRegistration>({
    resolver: zodResolver(insertWaitlistRegistrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
    mode: "onChange",
  });

  const emailValue = form.watch("email");
  const fullNameValue = form.watch("fullName");

  // Real-time email validation
  const validateEmail = (email: string) => {
    if (!email.trim()) {
      setEmailValidationState('idle');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email.trim())) {
      setEmailValidationState('valid');
    } else {
      setEmailValidationState('invalid');
    }
  };

  // Watch email changes for real-time validation
  useEffect(() => {
    validateEmail(emailValue);
  }, [emailValue]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen && !(event.target as Element).closest('nav')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);



  const waitlistMutation = useMutation({
    mutationFn: async (data: InsertWaitlistRegistration) => {
      const response = await apiRequest("POST", "/api/waitlist", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      form.reset();
      toast({
        title: "Welcome to Chirpin!",
        description: "You're on the waitlist. We'll be in touch soon!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/waitlist/count"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertWaitlistRegistration) => {
    // Additional validation before submission
    if (emailValidationState !== 'valid') {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address to continue.",
        variant: "destructive",
      });
      return;
    }
    
    if (!data.fullName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your full name to continue.",
        variant: "destructive",
      });
      return;
    }

    waitlistMutation.mutate(data);
  };

  // Check if form is valid for submission
  const isFormValid = emailValidationState === 'valid' && fullNameValue.trim().length > 0;

  const scrollToWaitlist = () => {
    document.getElementById("waitlist-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-chirpin-navy text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass" data-testid="navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img src={chirpinLogo} alt="Chirpin" className="h-8 w-8 rounded-lg" data-testid="logo-icon" />
              <span className="text-xl font-bold" data-testid="logo-text">Chirpin</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="/game-center" className="text-gray-300 hover:text-white transition-colors" data-testid="nav-game-center">GameCenter</a>
              <a href="#features" className="text-gray-300 hover:text-white transition-colors" data-testid="nav-features">Features</a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors" data-testid="nav-about">About</a>
              <Button onClick={scrollToWaitlist} className="bg-chirpin-orange hover:bg-chirpin-orange/90" data-testid="nav-waitlist-button">
                Join Waitlist
              </Button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-700 animate-in slide-in-from-top duration-200">
            <div className="px-4 py-4 space-y-4">
              <a 
                href="/game-center" 
                className="block text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                GameCenter
              </a>
              <a 
                href="#features" 
                className="block text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#about" 
                className="block text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </a>
              <Button 
                onClick={() => {
                  scrollToWaitlist();
                  setIsMobileMenuOpen(false);
                }} 
                className="w-full bg-chirpin-orange hover:bg-chirpin-orange/90 mt-4"
              >
                Join Waitlist
              </Button>
            </div>
          </div>
        )}
      </nav>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
            alt="Volleyball arena with crowd" 
            className="w-full h-full object-cover opacity-20"
            data-testid="hero-background-image"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="mb-8 animate-float">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight" data-testid="hero-title">
              Simplify Youth Hockey Team
              <span className="text-chirpin-orange drop-shadow-lg"> Communication</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed" data-testid="hero-subtitle">
              Built by hockey families for hockey families. Connect teams, track games, find opponents, and never miss a play.
            </p>
          </div>

          {/* Waitlist Form */}
          <div className="max-w-lg mx-auto mb-12" id="waitlist-form">
            <Card className="glass-card animate-glow border-chirpin-orange/30" data-testid="waitlist-form-card">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 text-white" data-testid="waitlist-form-title">Join the Waitlist</h2>
                {isSubmitted ? (
                  <div className="text-center py-8" data-testid="success-message">
                    <CheckCircle className="h-16 w-16 text-chirpin-orange mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-white">Welcome to Chirpin!</h3>
                    <p className="text-gray-300">You're on the waitlist. We'll be in touch soon!</p>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="waitlist-form">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Full Name"
                                {...field}
                                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-chirpin-orange focus:bg-white/20"
                                data-testid="input-fullname"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="email"
                                  placeholder="Email Address"
                                  {...field}
                                  className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-chirpin-orange focus:bg-white/20 pr-10 ${
                                    emailValidationState === 'valid' ? 'border-green-500/50' : 
                                    emailValidationState === 'invalid' ? 'border-red-500/50' : ''
                                  }`}
                                  data-testid="input-email"
                                />
                                {emailValidationState === 'valid' && (
                                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                                )}
                                {emailValidationState === 'invalid' && (
                                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                                )}
                                {emailValidationState === 'idle' && emailValue.trim() === '' && (
                                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                )}
                              </div>
                            </FormControl>
                            {emailValidationState === 'invalid' && emailValue.trim() !== '' && (
                              <p className="text-red-400 text-sm mt-1">Please enter a valid email address</p>
                            )}
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        disabled={waitlistMutation.isPending || !isFormValid}
                        className={`w-full font-semibold py-3 transition-all transform ${
                          isFormValid && !waitlistMutation.isPending
                            ? 'bg-gradient-to-r from-chirpin-orange to-orange-500 hover:from-chirpin-orange/90 hover:to-orange-500/90 hover:scale-105'
                            : 'bg-gray-600/50 cursor-not-allowed'
                        } text-white`}
                        data-testid="button-submit-waitlist"
                      >
                        <Rocket className="mr-2 h-4 w-4" />
                        {waitlistMutation.isPending ? "Joining..." : "Get Early Access"}
                      </Button>
                    </form>
                  </Form>
                )}
                {!isSubmitted && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400" data-testid="waitlist-disclaimer">
                      Be the first to know when Chirpin launches. No spam, ever.
                    </p>
                    {(emailValue.trim() !== '' || fullNameValue.trim() !== '') && !isFormValid && (
                      <p className="text-xs text-yellow-400 mt-2 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {!fullNameValue.trim() && emailValidationState === 'valid' && "Please enter your full name to continue."}
                        {fullNameValue.trim() && emailValidationState !== 'valid' && emailValue.trim() && "Please enter a valid email address to continue."}
                        {!fullNameValue.trim() && emailValidationState !== 'valid' && emailValue.trim() && "Please provide a valid email address and your full name."}
                        {!emailValue.trim() && fullNameValue.trim() && "Please enter your email address to continue."}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-300" data-testid="trust-indicators">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-chirpin-orange" />
              <span>100% Secure</span>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-chirpin-orange" />
              <span>Launching Soon</span>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-chirpin-orange/20 backdrop-blur-sm rounded-full animate-float hidden lg:block" style={{animationDelay: '-2s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-chirpin-orange/10 backdrop-blur-sm rounded-full animate-float hidden lg:block" style={{animationDelay: '-4s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-chirpin-orange/15 backdrop-blur-sm rounded-full animate-float hidden lg:block" style={{animationDelay: '-1s'}}></div>
      </section>
      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8" data-testid="features-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white drop-shadow-lg" data-testid="features-title">
              Everything Your Team Needs
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto" data-testid="features-subtitle">
              From game updates to finding opponents, Chirpin brings all hockey communication into one powerful platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Game Center Feature */}
            <Card className="glass-card hover:scale-105 transition-all duration-300 border-chirpin-orange/20 hover:border-chirpin-orange/40 overflow-hidden cursor-pointer" data-testid="feature-card-gamecenter">
              <div className="relative" onClick={() => setSelectedImage({src: gameCenterImage, alt: "Chirpin Game Center - Live scores and highlights"})}>
                <img 
                  src={gameCenterImage} 
                  alt="Chirpin Game Center - Live scores and highlights"
                  className="w-full h-64 object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-semibold mb-2 text-white">Game Center</h3>
                  <p className="text-gray-200 text-sm">
                    Live scores, highlights, and real-time updates. Follow all of your favorite teams, family, and friends throughout the hockey community and get instant notifications when goals are scored.
                  </p>
                </div>
              </div>
            </Card>

            {/* Game Finder Feature */}
            <Card className="glass-card hover:scale-105 transition-all duration-300 border-chirpin-orange/20 hover:border-chirpin-orange/40 overflow-hidden cursor-pointer" data-testid="feature-card-gamefinder">
              <div className="relative" onClick={() => setSelectedImage({src: gameFinderImage, alt: "Chirpin Game Finder - Find teams to schedule games"})}>
                <img 
                  src={gameFinderImage} 
                  alt="Chirpin Game Finder - Find teams to schedule games"
                  className="w-full h-64 object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-semibold mb-2 text-white">Game Finder</h3>
                  <p className="text-gray-200 text-sm">
                    Find teams to play using rankings, travel distance, and skill level. Smart matching makes scheduling games effortless.
                  </p>
                </div>
              </div>
            </Card>

            {/* Coach Connect Feature */}
            <Card className="glass-card hover:scale-105 transition-all duration-300 border-chirpin-orange/20 hover:border-chirpin-orange/40 overflow-hidden cursor-pointer" data-testid="feature-card-coachconnect">
              <div className="relative" onClick={() => setSelectedImage({src: coachConnectImage, alt: "Chirpin Coach Connect - Team details and contacts"})}>
                <img 
                  src={coachConnectImage} 
                  alt="Chirpin Coach Connect - Team details and contacts"
                  className="w-full h-64 object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-semibold mb-2 text-white">Coach Connect</h3>
                  <p className="text-gray-200 text-sm">
                    Direct access to team details, coach contacts, and response rates. Build relationships across the hockey community.
                  </p>
                </div>
              </div>
            </Card>

            {/* Overview/Hub Feature */}
            <Card className="glass-card hover:scale-105 transition-all duration-300 border-chirpin-orange/20 hover:border-chirpin-orange/40 overflow-hidden cursor-pointer" data-testid="feature-card-hub">
              <div className="relative" onClick={() => setSelectedImage({src: overviewImage, alt: "Chirpin Hub - Game center and channels overview"})}>
                <img 
                  src={overviewImage} 
                  alt="Chirpin Hub - Game center and channels overview"
                  className="w-full h-64 object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-semibold mb-2 text-white">Hockey Hub</h3>
                  <p className="text-gray-200 text-sm">
                    Your central dashboard for game center, rankings, team channels, and community discovery. Everything hockey in one place.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Feature Highlights Section */}
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-8 text-white">Why Teams Choose Chirpin</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-6 border-chirpin-orange/20">
                <div className="bg-chirpin-orange/20 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                  <Tv className="h-8 w-8 text-chirpin-orange" />
                </div>
                <h4 className="text-lg font-semibold mb-2 text-white">Live Game Updates</h4>
                <p className="text-gray-300 text-sm">Real-time scores and highlights keep everyone connected during games</p>
              </div>
              <div className="glass-card p-6 border-chirpin-orange/20">
                <div className="bg-chirpin-orange/20 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                  <SearchCheck className="h-8 w-8 text-chirpin-orange" />
                </div>
                <h4 className="text-lg font-semibold mb-2 text-white">Smart Scheduling</h4>
                <p className="text-gray-300 text-sm">Find opponents based on skill level, location, and availability</p>
              </div>
              <div className="glass-card p-6 border-chirpin-orange/20">
                <div className="bg-chirpin-orange/20 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                  <MessageCircle className="h-8 w-8 text-chirpin-orange" />
                </div>
                <h4 className="text-lg font-semibold mb-2 text-white">Coach Network</h4>
                <p className="text-gray-300 text-sm">Connect directly with coaches and build lasting relationships</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Live Updates Demo Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" data-testid="live-updates-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white drop-shadow-lg">
            Never Miss a <span className="text-chirpin-orange">Goal</span> Again
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Real-time game updates keep everyone connected, from the first drop to the final buzzer.
          </p>
          
          <div className="relative max-w-md mx-auto cursor-pointer" onClick={() => setSelectedImage({src: gameUpdatesImage, alt: "Chirpin Game Center Updates - Real-time scoring notifications"})}>
            <img 
              src={gameUpdatesImage} 
              alt="Chirpin Game Center Updates - Real-time scoring notifications"
              className="w-full rounded-2xl shadow-2xl border border-chirpin-orange/20 hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-chirpin-orange rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 glass rounded-lg p-3">
              <p className="text-sm font-semibold text-white">Live Updates</p>
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="glass-card p-6 border-chirpin-orange/20">
              <div className="text-2xl font-bold text-chirpin-orange mb-2">⚡</div>
              <h4 className="font-semibold text-white mb-2">Instant Notifications</h4>
              <p className="text-gray-300 text-sm">Goals, assists, and key plays delivered in real-time</p>
            </div>
            <div className="glass-card p-6 border-chirpin-orange/20">
              <div className="text-2xl font-bold text-chirpin-orange mb-2">📊</div>
              <h4 className="font-semibold text-white mb-2">Live Period Tracking</h4>
              <p className="text-gray-300 text-sm">Follow the action period by period with detailed scoring</p>
            </div>
            <div className="glass-card p-6 border-chirpin-orange/20">
              <div className="text-2xl font-bold text-chirpin-orange mb-2">👥</div>
              <h4 className="font-semibold text-white mb-2">Team Following</h4>
              <p className="text-gray-300 text-sm">Stay connected with all your favorite teams and players</p>
            </div>
          </div>
        </div>
      </section>
      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8" data-testid="about-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white drop-shadow-lg" data-testid="about-title">
                Built by Hockey Families,<br />
                <span className="text-chirpin-orange drop-shadow-lg">For Hockey Families</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed" data-testid="about-description-1">
                We know the struggles of coordinating travel teams, managing tournament schedules, 
                and keeping everyone in the loop. As hockey parents and coaches ourselves, we've 
                experienced the frustration of endless group texts and missed communications.
              </p>
              <p className="text-lg text-gray-300 mb-8" data-testid="about-description-2">
                That's why we created Chirpin - to bring all hockey communication into one 
                beautiful, easy-to-use platform that actually understands how hockey families operate.
              </p>
              <div className="flex flex-wrap gap-4" data-testid="about-benefits">
                <div className="flex items-center space-x-2 text-gray-300">
                  <CheckCircle className="h-5 w-5 text-chirpin-orange" />
                  <span>No more group text chaos</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <CheckCircle className="h-5 w-5 text-chirpin-orange" />
                  <span>Streamlined team management</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <CheckCircle className="h-5 w-5 text-chirpin-orange" />
                  <span>Connect with the hockey community</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1515703407324-5f753afd8be8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&h=600" 
                alt="Young hockey players celebrating on ice" 
                className="rounded-2xl shadow-2xl w-full h-auto"
                data-testid="about-image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent rounded-2xl"></div>
              <div className="absolute top-4 right-4 glass rounded-lg p-4">
                <img src={chirpinLogo} alt="Chirpin" className="h-8 w-8 rounded mb-2" />
                <p className="text-sm font-semibold text-white">Hockey First</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" data-testid="cta-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white drop-shadow-lg" data-testid="cta-title">
            Ready to Transform Your Team's Communication?
          </h2>
          <p className="text-xl mb-8 text-[#ffffff]" data-testid="cta-subtitle">
            Join the waitlist and be among the first to experience the future of hockey team management.
          </p>
          <Button 
            onClick={scrollToWaitlist}
            className="bg-gradient-to-r from-chirpin-orange to-orange-500 hover:from-chirpin-orange/90 hover:to-orange-500/90 text-white font-semibold py-4 px-8 text-lg transition-all transform hover:scale-105"
            data-testid="button-cta-waitlist"
          >
            <Rocket className="mr-3 h-5 w-5" />
            Get Early Access Now
          </Button>
        </div>
      </section>
      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-slate-900/90 backdrop-blur-sm" data-testid="footer">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <img src={chirpinLogo} alt="Chirpin" className="h-8 w-8 rounded-lg" />
                <span className="text-xl font-bold text-white">Chirpin</span>
              </div>
              <p className="text-gray-300 mb-4 max-w-md" data-testid="footer-description">
                Simplifying hockey team communication for families across the country. 
                Built with love by hockey families who understand the game.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Product</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#features" className="hover:text-chirpin-orange transition-colors" data-testid="footer-link-features">Features</a></li>
                <li><a href="#about" className="hover:text-chirpin-orange transition-colors" data-testid="footer-link-about">About</a></li>
                <li><button onClick={scrollToWaitlist} className="hover:text-chirpin-orange transition-colors text-left" data-testid="footer-link-waitlist">Waitlist</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li><button onClick={() => setIsContactModalOpen(true)} className="hover:text-chirpin-orange transition-colors text-left" data-testid="footer-link-contact">Contact</button></li>
                <li><a href="/privacy" className="hover:text-chirpin-orange transition-colors" data-testid="footer-link-privacy">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-300" data-testid="footer-copyright">
            <p>&copy; 2025 Chirpin. All rights reserved. Made with ❤️ for hockey families.</p>
          </div>
        </div>
      </footer>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
          data-testid="image-modal"
        >
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={selectedImage.src} 
              alt={selectedImage.alt}
              className="w-full h-auto max-h-screen object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              data-testid="close-modal-button"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="absolute bottom-4 left-4 right-4 glass rounded-lg p-4">
              <p className="text-white font-semibold text-center">{selectedImage.alt}</p>
              <p className="text-gray-300 text-sm text-center mt-1">Click anywhere outside to close</p>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </div>
  );
}
