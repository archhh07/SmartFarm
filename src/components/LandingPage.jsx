"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import {
  Sprout,
  Thermometer,
  Activity,
  TrendingUp,
  Shield,
  Smartphone,
  Bot,
  ChevronRight,
  Star,
  BarChart3,
  MessageCircle,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react"
import AIChatbot from "./AIChatbot"

export default function LandingPage({ onEnterDashboard, isDarkMode, onToggleDarkMode }) {
  const [showChatbot, setShowChatbot] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const features = [
    {
      icon: <Thermometer className="h-8 w-8 text-primary" />,
      title: "Real-Time Monitoring",
      description: "Track temperature, humidity, soil moisture, and more with precision IoT sensors.",
    },
    {
      icon: <Bot className="h-8 w-8 text-primary" />,
      title: "AI-Powered Insights",
      description: "Get intelligent recommendations and predictions to optimize your crop yields.",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Advanced Analytics",
      description: "Visualize trends, patterns, and historical data to make informed decisions.",
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Smart Alerts",
      description: "Receive instant notifications when conditions require your attention.",
    },
    {
      icon: <Smartphone className="h-8 w-8 text-primary" />,
      title: "Mobile Ready",
      description: "Access your farm data anywhere, anytime with our responsive platform.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: "Comprehensive Reports",
      description: "Generate detailed reports for better farm management and compliance.",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Organic Farm Owner",
      content:
        "SmartFarm Pro increased our crop yield by 35% while reducing water usage. The AI insights are game-changing!",
      rating: 5,
    },
    {
      name: "Miguel Rodriguez",
      role: "Agricultural Consultant",
      content:
        "The real-time monitoring and alerts have saved countless crops from weather damage. Highly recommended!",
      rating: 5,
    },
    {
      name: "Emma Chen",
      role: "Greenhouse Manager",
      content:
        "The analytics dashboard gives us unprecedented visibility into our growing conditions. Fantastic platform!",
      rating: 5,
    },
  ]

  const stats = [
    { value: "10,000+", label: "Active Farms" },
    { value: "35%", label: "Avg. Yield Increase" },
    { value: "50%", label: "Water Savings" },
    { value: "24/7", label: "Monitoring" },
  ]

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Sprout className="h-8 w-8 text-primary" />
              <span className="text-xl font-heading font-bold">SmartFarm Pro</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection("home")}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Testimonials
              </button>
              <Button variant="outline" size="sm" onClick={onEnterDashboard}>
                Dashboard
              </Button>
              <Button variant="ghost" size="sm" onClick={onToggleDarkMode} className="p-2">
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onToggleDarkMode} className="p-2">
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t bg-background/95 backdrop-blur-sm">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button
                  onClick={() => scrollToSection("home")}
                  className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md w-full text-left transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("features")}
                  className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md w-full text-left transition-colors"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("testimonials")}
                  className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md w-full text-left transition-colors"
                >
                  Testimonials
                </button>
                <div className="px-3 py-2">
                  <Button onClick={onEnterDashboard} className="w-full">
                    Access Dashboard
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 pt-16"
      >
        <div className="absolute inset-0 bg-[url('/modern-farm-with-iot-sensors-and-green-fields.jpg')] bg-cover bg-center opacity-10" />
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <Badge variant="secondary" className="mb-6 text-sm font-medium">
              <Sprout className="h-4 w-4 mr-2" />
              Next-Generation Agriculture
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-balance mb-6">
              Transform Your Farm with <span className="text-primary">Smart IoT</span> Technology
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-pretty mb-8 max-w-3xl mx-auto">
              Monitor, analyze, and optimize your agricultural operations with AI-powered insights, real-time data, and
              intelligent automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-6 animate-pulse-glow" onClick={onEnterDashboard}>
                Start Monitoring Now
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 bg-transparent"
                onClick={() => setShowChatbot(true)}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Ask AI Assistant
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-3xl md:text-4xl font-heading font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Powerful Features for Modern Farming</h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
              Everything you need to monitor, analyze, and optimize your agricultural operations with cutting-edge IoT
              technology and AI insights.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="mb-4 animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-heading">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Trusted by Farmers Worldwide</h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              See how SmartFarm Pro is helping agricultural professionals achieve better results.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="animate-slide-in-right" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardDescription className="text-base leading-relaxed">"{testimonial.content}"</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto animate-fade-in-up">
            <h2
              className="text-3xl md:text-5xl font-heading font-bold mb-6 text-white"
              style={{ color: "white", textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
            >
              Ready to Revolutionize Your Farm?
            </h2>
            <p className="text-xl mb-8 opacity-90 text-pretty text-white" style={{ color: "white" }}>
              Join thousands of farmers who are already using SmartFarm Pro to increase yields, reduce costs, and make
              data-driven decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6" onClick={onEnterDashboard}>
                <Activity className="mr-2 h-5 w-5" />
                Access Dashboard
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary bg-transparent"
                onClick={() => setShowChatbot(true)}
              >
                <Bot className="mr-2 h-5 w-5" />
                Chat with AI
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Sprout className="h-8 w-8 text-primary" />
              <span className="text-2xl font-heading font-bold">SmartFarm Pro</span>
            </div>
            <div className="text-muted-foreground">© 2024 SmartFarm Pro. Empowering sustainable agriculture.</div>
          </div>
        </div>
      </footer>

      {/* AI Chatbot */}
      {showChatbot && <AIChatbot onClose={() => setShowChatbot(false)} />}
    </div>
  )
}
