"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Badge } from "../../components/ui/badge"
import {
  Bot,
  User,
  Send,
  X,
  Lightbulb,
  TrendingUp,
  Droplets,
  Thermometer,
  Sprout,
  Minimize2,
  Maximize2,
} from "lucide-react"

export default function AIChatbot({ onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I'm your SmartFarm AI assistant. I can help you with crop management, IoT sensor data analysis, weather insights, and farming best practices. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef(null)
  const messagesEndRef = useRef(null)
  const [isMinimized, setIsMinimized] = useState(false)

  const quickActions = [
    {
      icon: <Thermometer className="h-4 w-4" />,
      text: "Temperature alerts",
      query: "How do I set up temperature alerts for my crops?",
    },
    {
      icon: <Droplets className="h-4 w-4" />,
      text: "Irrigation tips",
      query: "What are the best irrigation practices for vegetables?",
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      text: "Yield optimization",
      query: "How can I optimize my crop yields using IoT data?",
    },
    {
      icon: <Sprout className="h-4 w-4" />,
      text: "Crop diseases",
      query: "How can I detect and prevent common crop diseases?",
    },
  ]

  const farmingKnowledge = {
    temperature: [
      "Most vegetables grow best between 65-75°F (18-24°C)",
      "Set temperature alerts 5°F above/below optimal range",
      "High temperatures can cause stress and reduce yields",
      "Use shade cloth during extreme heat waves",
    ],
    irrigation: [
      "Water early morning to reduce evaporation",
      "Deep, infrequent watering promotes root growth",
      "Monitor soil moisture at root depth",
      "Drip irrigation is 30-50% more efficient than sprinklers",
    ],
    yields: [
      "Consistent monitoring leads to 20-35% yield increases",
      "Optimal pH levels are crucial for nutrient uptake",
      "Regular soil testing helps identify deficiencies",
      "Proper spacing prevents competition between plants",
    ],
    diseases: [
      "Early detection is key to preventing spread",
      "Proper air circulation reduces fungal diseases",
      "Avoid overhead watering to prevent leaf diseases",
      "Crop rotation breaks disease cycles",
    ],
  }

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }

    // Alternative method for ScrollArea
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight
      }
    }
  }, [messages])

  const generateAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase()
    let response = ""
    let tips = []

    if (message.includes("temperature") || message.includes("heat") || message.includes("cold")) {
      response = "Temperature management is crucial for healthy crops. Here are some key insights:"
      tips = farmingKnowledge.temperature
    } else if (message.includes("water") || message.includes("irrigation") || message.includes("moisture")) {
      response = "Proper irrigation is essential for optimal plant growth. Here's what I recommend:"
      tips = farmingKnowledge.irrigation
    } else if (message.includes("yield") || message.includes("production") || message.includes("harvest")) {
      response = "Maximizing yields requires data-driven decisions. Here are proven strategies:"
      tips = farmingKnowledge.yields
    } else if (message.includes("disease") || message.includes("pest") || message.includes("problem")) {
      response = "Disease prevention is better than treatment. Here's how to protect your crops:"
      tips = farmingKnowledge.diseases
    } else if (message.includes("sensor") || message.includes("iot") || message.includes("data")) {
      response = "IoT sensors provide valuable insights for precision agriculture. Here's how to leverage your data:"
      tips = [
        "Set up automated alerts for critical thresholds",
        "Track trends over time to identify patterns",
        "Use historical data to predict optimal planting times",
        "Correlate sensor data with yield outcomes",
      ]
    } else if (message.includes("hello") || message.includes("hi") || message.includes("help")) {
      response = "I'm here to help you optimize your farming operations! I can assist with:"
      tips = [
        "IoT sensor setup and monitoring",
        "Crop management best practices",
        "Weather and climate insights",
        "Yield optimization strategies",
      ]
    } else {
      response = "That's a great question! Based on modern farming practices, here are some general recommendations:"
      tips = [
        "Monitor your crops regularly with IoT sensors",
        "Keep detailed records of all farming activities",
        "Stay updated with weather forecasts and alerts",
        "Consider sustainable farming practices for long-term success",
      ]
    }

    return { response, tips }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const { response, tips } = generateAIResponse(inputValue)

      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        content: response,
        tips: tips,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickAction = (query) => {
    setInputValue(query)
    handleSendMessage()
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fade-in">
      <Card
        className={`w-full transition-all duration-300 ease-in-out h-[fit-conten] h-auto ${
          isMinimized ? "max-w-sm h-16" : "max-w-4xl h-[90vh] sm:h-[600px] lg:max-w-5xl"
        } flex flex-col shadow-2xl border-0 bg-gradient-to-br from-background via-background to-muted/20`}
      >
        <CardHeader
          className={`flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border/20 bg-gradient-to-r from-primary/10 via-emerald-500/8 to-primary/10 backdrop-blur-sm shadow-sm ${
            isMinimized ? "pb-2" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary/20 to-emerald-500/20 rounded-xl shadow-sm">
              <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-primary animate-pulse" />
            </div>
            {!isMinimized && (
              <div>
                <CardTitle className="text-base sm:text-lg font-heading bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                  SmartFarm AI Assistant
                </CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground">Your intelligent farming companion</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0 hover:bg-primary/10"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <ScrollArea className="flex-1 p-3 sm:p-4" ref={scrollAreaRef}>
              <div className="space-y-3 sm:space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 sm:gap-3 ${message.type === "user" ? "justify-end" : "justify-start"} animate-slide-in`}
                  >
                    {message.type === "bot" && (
                      <div className="p-1.5 sm:p-2 bg-gradient-to-br from-primary/10 to-emerald-500/10 rounded-xl h-fit shadow-sm border border-primary/10">
                        <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 shadow-sm transition-all duration-200 hover:shadow-md ${
                        message.type === "user"
                          ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground ml-auto"
                          : "bg-gradient-to-br from-muted to-muted/80 border border-border/50"
                      }`}
                    >
                      <p className="text-xs sm:text-sm leading-relaxed">{message.content}</p>
                      {message.tips && (
                        <div className="mt-3 space-y-2 border-t border-border/30 pt-3">
                          {message.tips.map((tip, index) => (
                            <div key={index} className="flex items-start gap-2 text-xs opacity-90">
                              <Lightbulb className="h-3 w-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                              <span className="leading-relaxed">{tip}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <p className="text-xs opacity-60 mt-2 font-mono">{message.timestamp.toLocaleTimeString()}</p>
                    </div>
                    {message.type === "user" && (
                      <div className="p-1.5 sm:p-2 bg-gradient-to-br from-primary/10 to-emerald-500/10 rounded-xl h-fit shadow-sm border border-primary/10">
                        <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-2 sm:gap-3 justify-start animate-slide-in">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-br from-primary/10 to-emerald-500/10 rounded-xl h-fit shadow-sm border border-primary/10">
                      <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                    </div>
                    <div className="bg-gradient-to-br from-muted to-muted/80 rounded-2xl p-3 sm:p-4 shadow-sm border border-border/50">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-emerald-500/60 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-3 sm:p-4 border-t bg-gradient-to-r from-muted/30 to-muted/10 backdrop-blur-sm border-border/50">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about farming, sensors, or crop management..."
                  className="flex-1 rounded-xl border-border/50 bg-background/80 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm shadow-sm"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="sm"
                  className="rounded-xl bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 shadow-sm hover:shadow-md transition-all duration-200 px-3 sm:px-4"
                >
                  <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>

            <div className="p-3 sm:p-4 border-t bg-gradient-to-r from-background to-muted/10">
              <p className="text-xs text-muted-foreground mb-2 font-medium">Quick questions:</p>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-gradient-to-r hover:from-primary hover:to-emerald-500 hover:text-primary-foreground transition-all duration-200 hover:shadow-md hover:scale-105 p-2 justify-center sm:justify-start text-xs border border-border/50 bg-gradient-to-br from-background to-muted/50 bg-zinc-950"
                    onClick={() => handleQuickAction(action.query)}
                  >
                    {action.icon}
                    <span className="ml-1 hidden sm:inline">{action.text}</span>
                    <span className="ml-1 sm:hidden">{action.text.split(" ")[0]}</span>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
