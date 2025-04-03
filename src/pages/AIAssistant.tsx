import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Send, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { preventAutoScroll } from "@/lib/utils";
import { FadeIn } from "@/components/ui/transitions";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const { user } = useAuth();

  // تحديد ما إذا كان المستخدم في نهاية المحادثة
  const isAtBottom = () => {
    if (!scrollAreaRef.current) return true;
    
    const container = scrollAreaRef.current;
    const threshold = 100; // بكسل
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    
    return distanceFromBottom <= threshold;
  };

  // منع التمرير التلقائي عند تحميل الصفحة
  useEffect(() => {
    const cleanup = preventAutoScroll();
    
    // تعطيل دالة scrollIntoView
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView = function() {
        // لا تفعل شيئًا
        return;
      };
    }
    
    // تطبيق متكرر لمنع التمرير للأسفل
    const additionalPrevention = setInterval(() => {
      window.scrollTo(0, 0);
    }, 100);
    
    // إيقاف التطبيق المتكرر بعد ثانية
    const stopPrevention = setTimeout(() => {
      clearInterval(additionalPrevention);
    }, 1000);
    
    return () => {
      if (cleanup) cleanup();
      clearInterval(additionalPrevention);
      clearTimeout(stopPrevention);
    };
  }, []);

  useEffect(() => {
    // إضافة رسالة ترحيب عند تحميل الصفحة
    if (user?.name) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `مرحباً ${user.name}، أنا مستشارك العقاري الذكي. كيف يمكنني مساعدتك اليوم؟ يمكنني تقديم المشورة حول:\n\n- التمويل العقاري\n- اختيار العقار المناسب\n- تحليل الأسعار\n- نصائح الاستثمار العقاري\n- وغيرها من المواضيع المتعلقة بالعقارات`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [user]);

  useEffect(() => {
    // التمرير فقط إذا كان المستخدم في نهاية المحادثة
    if (scrollAreaRef.current && isAtBottom() && autoScroll) {
      // استخدام تأخير صغير للسماح بتحديث واجهة المستخدم أولاً
      const timer = setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [messages, autoScroll]);

  // مراقبة التمرير لتحديد ما إذا كان المستخدم في أسفل المحادثة
  const handleScroll = () => {
    if (scrollAreaRef.current) {
      setAutoScroll(isAtBottom());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // حفظ موضع التمرير الحالي
    const currentScrollPosition = scrollAreaRef.current?.scrollTop || 0;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date()
    };
    setInput("");
    
    // تحديث الرسائل مع الحفاظ على موضع التمرير
    setMessages((prev) => {
      const updatedMessages = [...prev, userMessage];
      
      // استخدام setTimeout للتأكد من تنفيذ هذا الكود بعد تحديث واجهة المستخدم
      setTimeout(() => {
        if (scrollAreaRef.current && !autoScroll) {
          // إعادة ضبط موضع التمرير إلى ما كان عليه
          scrollAreaRef.current.scrollTop = currentScrollPosition;
        }
      }, 0);
      
      return updatedMessages;
    });
    
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Generate response based on user input
      let responseText = "";
      if (input.toLowerCase().includes("مرحبا") || input.toLowerCase().includes("اهلا")) {
        responseText = `مرحباً ${user?.name}، كيف يمكنني مساعدتك اليوم؟`;
      } else if (input.toLowerCase().includes("شكرا")) {
        responseText = `على الرحب والسعة ${user?.name}، هل هناك أي شيء آخر يمكنني مساعدتك به؟`;
      } else {
        responseText = "أنا مستشارك العقاري الذكي. يمكنني مساعدتك في:\n\n- تقديم نصائح حول التمويل العقاري\n- تحليل الأسعار في مناطق مختلفة\n- تقديم إرشادات حول اختيار العقار المناسب\n- تقديم نصائح للاستثمار العقاري\n\nما هو سؤالك بالتحديد؟";
      }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
        timestamp: new Date()
      };

      // تحديث الرسائل مع الحفاظ على موضع التمرير
      setMessages((prev) => {
        const updatedMessages = [...prev, botResponse];
        
        // استخدام setTimeout للتأكد من تنفيذ هذا الكود بعد تحديث واجهة المستخدم
        setTimeout(() => {
          if (scrollAreaRef.current && !autoScroll) {
            // إعادة ضبط موضع التمرير إلى ما كان عليه
            scrollAreaRef.current.scrollTop = currentScrollPosition;
          }
        }, 0);
        
        return updatedMessages;
      });
    } catch (error) {
      console.error("Error:", error);
      
      // تحديث الرسائل مع الحفاظ على موضع التمرير في حالة الخطأ
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "عذراً، حدث خطأ أثناء معالجة طلبك. الرجاء المحاولة مرة أخرى.",
        timestamp: new Date()
      };
      
      setMessages((prev) => {
        const updatedMessages = [...prev, errorMessage];
        
        // استخدام setTimeout للتأكد من تنفيذ هذا الكود بعد تحديث واجهة المستخدم
        setTimeout(() => {
          if (scrollAreaRef.current && !autoScroll) {
            // إعادة ضبط موضع التمرير إلى ما كان عليه
            scrollAreaRef.current.scrollTop = currentScrollPosition;
          }
        }, 0);
        
        return updatedMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="w-full rounded-xl shadow-lg border">
        <CardHeader className="bg-card/80 backdrop-blur-sm border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bot className="h-6 w-6 text-primary" />
            المستشار العقاري الذكي
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col h-[600px]">
            <ScrollArea 
              ref={scrollAreaRef} 
              className="flex-1 rounded-md p-4"
              onScroll={handleScroll}
            >
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="h-[500px] flex flex-col items-center justify-center text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Bot size={28} className="opacity-70" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">مرحباً بك في المستشار العقاري الذكي</h3>
                    <p className="text-sm text-muted-foreground max-w-md mb-6">
                      اطرح أي سؤال حول العقارات أو التمويل العقاري وسأحاول مساعدتك
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const isUser = message.role === "user";
                    const showTimestamp = index === messages.length - 1 || 
                      messages[index + 1]?.role !== message.role;
                    
                    return (
                      <FadeIn key={message.id}>
                        <div
                          className={`flex ${
                            isUser ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              isUser
                                ? "bg-primary text-primary-foreground rounded-br-sm"
                                : "bg-muted rounded-bl-sm"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {isUser ? (
                                <User className="h-4 w-4" />
                              ) : (
                                <Bot className="h-4 w-4" />
                              )}
                              <span className="font-medium">
                                {isUser ? "أنت" : "المستشار العقاري"}
                              </span>
                            </div>
                            <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                            {showTimestamp && (
                              <div className="text-right mt-1">
                                <span className="text-[10px] text-muted-foreground opacity-70">
                                  {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </FadeIn>
                    );
                  })
                )}
                {isLoading && (
                  <FadeIn>
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg p-3 bg-muted rounded-bl-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <Bot className="h-4 w-4" />
                          <span className="font-medium">المستشار العقاري</span>
                        </div>
                        <div className="flex space-x-2 rtl:space-x-reverse h-5 items-center">
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            {!autoScroll && messages.length > 1 && (
              <div className="absolute bottom-24 right-4 z-10">
                <Button
                  size="icon"
                  className="rounded-full h-10 w-10 shadow-md bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    setAutoScroll(true);
                    if (scrollAreaRef.current) {
                      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
                    }
                  }}
                >
                  <span>↓</span>
                </Button>
              </div>
            )}
            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="relative flex items-end">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="اكتب سؤالك هنا..."
                  className="pr-12 py-3 rounded-xl border-2 min-h-[50px] pl-14"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  size="icon"
                  className="absolute left-1.5 bottom-1.5 h-9 w-9 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 disabled:opacity-50"
                  disabled={isLoading || !input.trim()}
                >
                  <Send className="h-4 w-4 rtl:rotate-180" />
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 