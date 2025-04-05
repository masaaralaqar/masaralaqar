import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Send, User, Info, RefreshCw, Loader2 } from "lucide-react";
import { preventAutoScroll } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export default function AIAssistant() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const { user, isLoading: isAuthLoading, isUserLoading } = useAuth();
  const isOverallLoading = isAuthLoading || isUserLoading;
  
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    if (!isOverallLoading) {
      let foundName = null;
      
      if (user && user.name) {
        foundName = user.name;
      } 
      else if (localStorage.getItem("userName")) {
        foundName = localStorage.getItem("userName");
      } 
      else if (sessionStorage.getItem("userName")) {
        foundName = sessionStorage.getItem("userName");
      }
      
      if (foundName && typeof foundName === 'string' && foundName.trim() !== '') {
        setDisplayName(foundName);
      } else {
        setDisplayName("الزائر العزيز");
      }
    }
  }, [isAuthLoading, isUserLoading, isOverallLoading, user]);

  const isAtBottom = () => {
    if (!chatContainerRef.current) return true;
    const container = chatContainerRef.current;
    const threshold = 100;
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    return distanceFromBottom <= threshold;
  };

  useEffect(() => {
    const cleanup = preventAutoScroll();
    return () => { if (cleanup) cleanup(); };
  }, []);

  useEffect(() => {
    if (chatContainerRef.current && autoScroll) {
      const timer = setTimeout(() => {
        if (chatContainerRef.current && isAtBottom()) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [messages, autoScroll]);

  const handleScroll = () => {
    if (chatContainerRef.current) setAutoScroll(isAtBottom());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    setInput("");
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const responseText = `شكراً لتواصلك معنا ${displayName}!\n\nهل لديك سؤال محدد؟`;
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "عذراً، حدث خطأ أثناء المعالجة.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => setMessages([]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted/30">
      <Card className="h-full flex-1 flex flex-col mx-auto w-full max-w-3xl bg-card/80 backdrop-blur-sm shadow-lg rounded-none sm:rounded-xl sm:my-4 border-muted">
        <CardHeader className="py-3 px-4 md:px-6 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg md:text-xl font-bold flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span>المستشار العقاري الذكي</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {isOverallLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <span className="h-2 w-2 rounded-full bg-green-500"></span>} متصل
                </span>
              </div>
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={resetChat}><RefreshCw className="h-4 w-4" /></Button>
          </div>
        </CardHeader>

        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 space-y-4 md:space-y-6 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
          style={{ direction: 'rtl' }}
          onScroll={handleScroll}
        >
          {messages.length === 0 && !isOverallLoading && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 p-6 opacity-90">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium">مرحباً بك في المستشار العقاري</h3>
              <p className="text-muted-foreground max-w-md">
                أنا هنا لمساعدتك في كل ما يتعلق بالعقارات، التمويل، والاستثمار العقاري.
              </p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-full items-end gap-2 md:gap-3",
                message.role === "assistant" ? "justify-start" : "justify-end"
              )}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "rounded-2xl px-4 py-3 md:px-5 md:py-4 w-full max-w-[90%] sm:max-w-[85%] md:max-w-[75%] break-words shadow-md",
                  message.role === "assistant"
                    ? "bg-card border border-border text-card-foreground"
                    : "bg-primary text-primary-foreground",
                  message.role === "assistant" ? "rounded-bl-sm" : "rounded-br-sm"
                )}
              >
                <div className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                  {message.content}
                </div>
                <div className={cn(
                  "text-[10px] mt-1 text-right",
                  message.role === "assistant" ? "text-muted-foreground/70" : "text-primary-foreground/70"
                )}>
                  {new Date(message.timestamp).toLocaleTimeString('ar-SA', {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/90 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 md:px-5 md:py-4 w-full max-w-[90%] sm:max-w-[85%] md:max-w-[75%] shadow-md">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4 md:p-6 border-t bg-background/90 backdrop-blur">
          <form onSubmit={handleSubmit} className="flex gap-2 md:gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب سؤالك هنا..."
              className="flex-1 resize-none overflow-y-auto text-right py-4 px-4 text-base rounded-2xl border-muted focus:border-primary shadow-sm w-full min-h-[44px] max-h-40"
              onInput={(e) => {
                e.currentTarget.style.height = "auto";
                e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
              }}
              disabled={isOverallLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim() || isOverallLoading}
              size="lg"
              className="px-4 h-auto rounded-2xl text-base flex items-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span className="hidden sm:inline">إرسال</span>
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-2 flex justify-center">
            <p className="text-xs text-muted-foreground flex items-center gap-1 justify-center">
              <Info className="h-3 w-3" />
              هذا المستشار يقدم معلومات عامة فقط وليس بديلاً عن الاستشارات المهنية المتخصصة
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}