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
import { Tv, SearchCheck, MessageCircle, Star, Shield, Clock, CheckCircle, Rocket, Mail, AlertCircle, Bell, BarChart3, Share2, Trophy, Users, Menu, X } from "lucide-react";
import chirpinLogo from "@assets/2F716E35-DBBA-4E40-B0B4-E2FD7BE5FEA0_1754346652751.png";
import gameCenterImage from "@assets/Chirpin_GameCenter_1754403116171.png";
import fromThisVideo from "@assets/From this.mp4";
import toThisVideo from "@assets/To this.mp4";
import followImage from "@assets/Follow.png";

export default function GameCenter() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [emailValidationState, setEmailValidationState] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const form = useForm<InsertWaitlistRegistration>({
    resolver: zodResolver(insertWaitlistRegistrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      persona: "parent",
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
        title: "Welcome to Chirpin GameCenter!",
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
              <a href="/" className="text-gray-300 hover:text-white transition-colors" data-testid="nav-home">Home</a>
              <a href="/game-center" className="text-gray-300 hover:text-white transition-colors" data-testid="nav-game-center">GameCenter</a>
              <a href="#features" className="text-gray-300 hover:text-white transition-colors" data-testid="nav-features">Features</a>
              <Button onClick={scrollToWaitlist} className="bg-chirpin-orange hover:bg-chirpin-orange/90" data-testid="nav-waitlist-button">
                Get Early Access
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
                href="/" 
                className="block text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </a>
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
              <Button 
                onClick={() => {
                  scrollToWaitlist();
                  setIsMobileMenuOpen(false);
                }} 
                className="w-full bg-chirpin-orange hover:bg-chirpin-orange/90 mt-4"
              >
                Get Early Access
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
            alt="Hockey arena with scoreboard" 
            className="w-full h-full object-cover opacity-20"
            data-testid="hero-background-image"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="mb-8 animate-float">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight" data-testid="hero-title">
              Never Miss a
              <span className="text-chirpin-orange drop-shadow-lg"> Game Moment</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-100 mb-8 max-w-4xl mx-auto leading-relaxed" data-testid="hero-subtitle">
              Real-time scoreboards, game notifications, and stats tracking. Share every play with friends and families instantly.
            </p>
          </div>

          {/* Waitlist Form */}
          <div className="max-w-lg mx-auto mb-12" id="waitlist-form">
            <Card className="glass-card animate-glow border-chirpin-orange/30" data-testid="waitlist-form-card">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 text-white" data-testid="waitlist-form-title">Get Early Access to GameCenter</h2>
                {isSubmitted ? (
                  <div className="text-center py-8" data-testid="success-message">
                    <CheckCircle className="h-16 w-16 text-chirpin-orange mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-white">Welcome to Chirpin GameCenter!</h3>
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
                                    emailValidationState === 'valid' ? 'border-green-500' : 
                                    emailValidationState === 'invalid' ? 'border-red-500' : 'border-white/20'
                                  }`}
                                  data-testid="input-email"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                  {emailValidationState === 'valid' && (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  )}
                                  {emailValidationState === 'invalid' && (
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                  )}
                                  {emailValidationState === 'idle' && (
                                    <Mail className="h-5 w-5 text-gray-400" />
                                  )}
                                </div>
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
                        disabled={!isFormValid || waitlistMutation.isPending}
                        className={`w-full py-3 text-lg font-semibold transition-all duration-300 ${
                          isFormValid
                            ? "bg-chirpin-orange hover:bg-chirpin-orange/90 transform hover:scale-105"
                            : "bg-gray-600 cursor-not-allowed opacity-50"
                        }`}
                        data-testid="submit-button"
                      >
                        {waitlistMutation.isPending ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Joining...
                          </div>
                        ) : (
                          "Get Early Access"
                        )}
                      </Button>
                      <p className="text-sm text-gray-400" data-testid="waitlist-disclaimer">
                        Be the first to know when GameCenter launches. No spam, ever.
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
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </section>

      {/* Video Comparison Section */}
      <section id="video-comparison" className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6" data-testid="comparison-title">
              From
              <span className="text-red-400"> Chaos</span>
              <span className="text-white"> to </span>
              <span className="text-chirpin-orange">Clarity</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-100 max-w-3xl mx-auto">
              See the difference GameCenter makes for the hockey community
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            {/* From This */}
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-red-400">From This</h3>
              <Card className="glass-card overflow-hidden">
                <CardContent className="p-0">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full max-w-md h-auto rounded-lg mx-auto"
                    data-testid="from-this-video"
                  >
                    <source src={fromThisVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </CardContent>
              </Card>
              <p className="text-sm sm:text-base text-gray-100 mt-3 sm:mt-4">
                Scattered messages, missed updates, confused families
              </p>
            </div>

            {/* To This */}
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-chirpin-orange">To This</h3>
              <Card className="glass-card overflow-hidden">
                <CardContent className="p-0">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full max-w-md h-auto rounded-lg mx-auto"
                    data-testid="to-this-video"
                  >
                    <source src={toThisVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </CardContent>
              </Card>
              <p className="text-sm sm:text-base text-gray-100 mt-3 sm:mt-4">
                Real-time updates, organized information, everyone stays connected
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Follow Feature Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Follow Your
                <span className="text-chirpin-orange"> Hockey Network</span>
              </h2>
              <p className="text-xl text-gray-100 mb-8">
                Discover and follow teams and players across the country. Stay connected with friends from tournaments, teammates who've moved, and rising stars in the hockey community.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-chirpin-orange rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-100">Find and follow teams from tournaments and showcases</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-chirpin-orange rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-100">Keep track of friends who've moved to different teams</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-chirpin-orange rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-100">Get notified when followed players score or make plays</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-chirpin-orange rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-100">Build your hockey network nationwide</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Card className="glass-card overflow-hidden max-w-md">
                <CardContent className="p-0">
                  <img 
                    src={followImage} 
                    alt="Follow teams and players interface showing how to discover and connect with your hockey network" 
                    className="w-full h-auto rounded-lg"
                    data-testid="follow-feature-image"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6" data-testid="features-title">
              Everything You Need to
              <span className="text-chirpin-orange"> Track the Game</span>
            </h2>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto">
              Stop searching through multiple chats for scores. Connect with your hockey network nationwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Live Scoreboard */}
            <Card className="glass-card hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-chirpin-orange/20 rounded-lg mr-4">
                    <Tv className="h-8 w-8 text-chirpin-orange" />
                  </div>
                  <h3 className="text-xl font-semibold">Live Scoreboard</h3>
                </div>
                <p className="text-gray-100">
                  Real-time game scores and updates. Never wonder what the score is again.
                </p>
              </CardContent>
            </Card>

            {/* Game Notifications */}
            <Card className="glass-card hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-chirpin-orange/20 rounded-lg mr-4">
                    <Bell className="h-8 w-8 text-chirpin-orange" />
                  </div>
                  <h3 className="text-xl font-semibold">Game Notifications</h3>
                </div>
                <p className="text-gray-100">
                  Instant alerts for goals, penalties, and game events. Stay connected to every play.
                </p>
              </CardContent>
            </Card>

            {/* Stats Tracking */}
            <Card className="glass-card hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-chirpin-orange/20 rounded-lg mr-4">
                    <BarChart3 className="h-8 w-8 text-chirpin-orange" />
                  </div>
                  <h3 className="text-xl font-semibold">Stats Tracking</h3>
                </div>
                <p className="text-gray-100">
                  Track goals, assists, saves, and more. See your player's progress over time.
                </p>
              </CardContent>
            </Card>

            {/* Community Sharing */}
            <Card className="glass-card hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-chirpin-orange/20 rounded-lg mr-4">
                    <Share2 className="h-8 w-8 text-chirpin-orange" />
                  </div>
                  <h3 className="text-xl font-semibold">Community Sharing</h3>
                </div>
                <p className="text-gray-100">
                  Share game highlights and stats with friends, teammates, and families instantly. Keep your hockey network connected.
                </p>
              </CardContent>
            </Card>

            {/* Friend Following */}
            <Card className="glass-card hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-chirpin-orange/20 rounded-lg mr-4">
                    <Users className="h-8 w-8 text-chirpin-orange" />
                  </div>
                  <h3 className="text-xl font-semibold">Follow Friends</h3>
                </div>
                <p className="text-gray-100">
                  Follow friends and teammates across the country. Stay connected with your hockey network no matter where they play.
                </p>
              </CardContent>
            </Card>

            {/* Achievement Tracking */}
            <Card className="glass-card hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-chirpin-orange/20 rounded-lg mr-4">
                    <Trophy className="h-8 w-8 text-chirpin-orange" />
                  </div>
                  <h3 className="text-xl font-semibold">Achievements</h3>
                </div>
                <p className="text-gray-100">
                  Celebrate milestones and achievements. Track progress and motivate your players.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Tired of
                <span className="text-red-400"> Scrolling Through Chats?</span>
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-100">Constantly searching team messaging apps for game scores</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-100">Missing important game moments and updates</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-100">Friends and families asking "What's the score?" during games</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-100">No easy way to track player stats and progress</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-6">
                GameCenter
                <span className="text-chirpin-orange"> Solves Everything</span>
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-chirpin-orange rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-100">Live scoreboard with real-time updates</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-chirpin-orange rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-100">Instant notifications for every game event</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-chirpin-orange rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-100">Easy sharing with friends and families nationwide</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-chirpin-orange rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-100">Comprehensive stats tracking and analytics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to Transform Your
            <span className="text-chirpin-orange"> Game Experience?</span>
          </h2>
          <Button
            onClick={scrollToWaitlist}
            className="bg-chirpin-orange hover:bg-chirpin-orange/90 text-xl px-8 py-4 transform hover:scale-105 transition-all duration-300"
          >
            Get Early Access Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center space-x-2">
              <img src={chirpinLogo} alt="Chirpin" className="h-8 w-8 rounded-lg" />
              <span className="text-xl font-bold">Chirpin</span>
            </div>
            <div className="flex justify-center space-x-6">
              <a href="/" className="text-gray-100 hover:text-white transition-colors">Home</a>
              <a href="/privacy" className="text-gray-100 hover:text-white transition-colors">Privacy</a>
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="text-gray-100 hover:text-white transition-colors"
              >
                Contact
              </button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-700 text-center">
            <p className="text-gray-100">
              © 2025 Chirpin. Built by hockey families for hockey families.
            </p>
          </div>
        </div>
      </footer>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}
