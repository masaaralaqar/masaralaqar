import React, { useState, useRef, useEffect } from "react";
import {
  GlassCard,
  GlassCardContent,
  GlassCardHeader,
  GlassCardTitle,
} from "./ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, ArrowRight, User, Bot } from "lucide-react";
import { SlideIn, StaggeredChildren, FadeIn } from "./ui/transitions";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { mockGeminiQuery, queryGeminiModel } from "@/services/gemini-service";
import { preventAutoScroll } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
};

export function DeepseekAIAssistant() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Predefined sample questions
  const sampleQuestions = [
    "ما هي شروط التمويل العقاري في البنك الأهلي؟",
    "كيف أحسب الدعم السكني المناسب لي؟",
    "ما الفرق بين التمويل الثابت والمتغير؟",
    "كيف أعرف أقصى مبلغ تمويل يمكنني الحصول عليه؟",
    "ما هي أفضل مناطق الاستثمار العقاري في الرياض؟",
    "كيف يمكنني الاستفادة من برنامج سكني؟",
  ];

  // تحديد ما إذا كان المستخدم في نهاية المحادثة
  const isAtBottom = () => {
    if (!chatContainerRef.current) return true;
    
    const container = chatContainerRef.current;
    const threshold = 100; // بكسل
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    
    return distanceFromBottom <= threshold;
  };

  const scrollToBottom = () => {
    // لا نمرر تلقائيًا عند التحميل الأولي
    if (isInitialLoad) return;
    
    // نمرر فقط إذا كان المستخدم في أسفل المحادثة أو تم تفعيل التمرير التلقائي
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // مراقبة التمرير لتحديد ما إذا كان المستخدم في أسفل المحادثة
  const handleScroll = () => {
    if (chatContainerRef.current) {
      setAutoScroll(isAtBottom());
    }
  };

  useEffect(() => {
    // منع التمرير التلقائي للأسفل بشكل مكثف
    const cleanup = preventAutoScroll();
    
    // إلغاء خاصية التمرير التلقائي عند إضافة رسائل
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView = function() {
        // لا نفعل شيئًا - تعطيل التمرير التلقائي
        return;
      };
    }
    
    if (chatContainerRef.current) {
      chatContainerRef.current.addEventListener('scroll', handleScroll);
      
      // تأكد من أن المحتوى يظهر في الأعلى
      chatContainerRef.current.scrollTop = 0;
    }
    
    // إعادة تطبيق لضمان عدم التمرير
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 500);
    
    return () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.removeEventListener('scroll', handleScroll);
      }
      if (cleanup) cleanup();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    // تعطيل التمرير التلقائي تمامًا عند إضافة رسائل جديدة
    // نستثني فقط الحالة التي يكون فيها المستخدم في أسفل المحادثة ويرغب في استمرار التمرير
    
    // لا نمرر تلقائيًا إلا إذا كان المستخدم في أسفل المحادثة أصلاً
    if (isInitialLoad) {
      if (messages.length > 0) {
        setIsInitialLoad(false);
      }
      return;
    }
    
    // تجاهل التمرير التلقائي حتى عند إضافة رسائل جديدة إلا إذا كان المستخدم قد اختار ذلك صراحةً
    if (messages.length > 0 && autoScroll && isAtBottom()) {
      // استخدام تأخير صغير للسماح بتحديث واجهة المستخدم أولاً
      const timer = setTimeout(() => {
        if (chatContainerRef.current) {
          // استخدام scrollTop بدلاً من scrollIntoView للتحكم بشكل أفضل
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [messages, autoScroll, isInitialLoad]);

  // Get AI response using the deepseek model
  const getAIResponse = async (question: string, currentScrollPosition: number) => {
    setIsLoading(true);

    try {
      // Convert messages to the format expected by the deepseek service
      const conversationHistory = messages
        .filter((msg) => msg.role !== "system")
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      let aiResponse = "";
      try {
        // محاولة استخدام نموذج Gemini أولاً
        aiResponse = await queryGeminiModel(question, conversationHistory);
      } catch (error) {
        console.log(
          "فشل الاتصال بنموذج Gemini، استخدام النموذج المحلي بدلاً من ذلك",
          error,
        );
        // استخدام النموذج المحلي كخطة بديلة
        aiResponse = await mockGeminiQuery(question);
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };

      // تحديث الرسائل مع الحفاظ على موضع التمرير
      setMessages((prev) => {
        const updatedMessages = [...prev, newMessage];
        
        // استخدام setTimeout للتأكد من تنفيذ هذا الكود بعد تحديث واجهة المستخدم
        setTimeout(() => {
          if (chatContainerRef.current && !autoScroll) {
            // إعادة ضبط موضع التمرير إلى ما كان عليه
            chatContainerRef.current.scrollTop = currentScrollPosition;
          }
        }, 0);
        
        return updatedMessages;
      });
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast({
        title: "حدث خطأ",
        description:
          "لم نتمكن من الحصول على رد من المساعد الذكي. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      
      // إعادة ضبط موضع التمرير في حالة الخطأ أيضًا
      setTimeout(() => {
        if (chatContainerRef.current && !autoScroll) {
          chatContainerRef.current.scrollTop = currentScrollPosition;
        }
      }, 0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // حفظ موضع التمرير الحالي
    const currentScrollPosition = chatContainerRef.current?.scrollTop || 0;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    // تحديث الرسائل مع الحفاظ على موضع التمرير
    setMessages((prev) => {
      const updatedMessages = [...prev, newMessage];
      
      // استخدام setTimeout للتأكد من تنفيذ هذا الكود بعد تحديث واجهة المستخدم
      setTimeout(() => {
        if (chatContainerRef.current && !autoScroll) {
          // إعادة ضبط موضع التمرير إلى ما كان عليه
          chatContainerRef.current.scrollTop = currentScrollPosition;
        }
      }, 0);
      
      return updatedMessages;
    });
    
    setInput("");

    await getAIResponse(input, currentScrollPosition);
  };

  const handleSampleQuestion = async (question: string) => {
    // حفظ موضع التمرير الحالي
    const currentScrollPosition = chatContainerRef.current?.scrollTop || 0;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: question,
      timestamp: new Date(),
    };

    // تحديث الرسائل مع الحفاظ على موضع التمرير
    setMessages((prev) => {
      const updatedMessages = [...prev, newMessage];
      
      // استخدام setTimeout للتأكد من تنفيذ هذا الكود بعد تحديث واجهة المستخدم
      setTimeout(() => {
        if (chatContainerRef.current && !autoScroll) {
          // إعادة ضبط موضع التمرير إلى ما كان عليه
          chatContainerRef.current.scrollTop = currentScrollPosition;
        }
      }, 0);
      
      return updatedMessages;
    });

    await getAIResponse(question, currentScrollPosition);
  };

  return (
    <section className="py-6 px-4 relative">
      <div className="container max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <GlassCard>
              <GlassCardHeader>
                <GlassCardTitle>أسئلة مقترحة</GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent>
                <StaggeredChildren staggerDelay={100} className="space-y-3">
                  {sampleQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-right"
                      onClick={() => handleSampleQuestion(question)}
                    >
                      <span className="truncate">{question}</span>
                      <ArrowRight
                        size={16}
                        className="mr-auto rtl:rotate-180"
                      />
                    </Button>
                  ))}
                </StaggeredChildren>
              </GlassCardContent>
            </GlassCard>
          </div>

          <div className="lg:col-span-3 order-1 lg:order-2">
            <GlassCard className="flex flex-col h-[600px]">
              <GlassCardHeader>
                <GlassCardTitle className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={20} />
                    <span>المحادثة مع المساعد العقاري الذكي</span>
                  </div>
                  {!autoScroll && messages.length > 2 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1.5 hover:bg-primary/10"
                      onClick={() => {
                        setAutoScroll(true);
                        scrollToBottom();
                      }}
                    >
                      <span>↓</span>
                      <span className="text-xs">التمرير لأسفل</span>
                    </Button>
                  )}
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="flex-1 overflow-hidden flex flex-col relative">
                <div 
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto py-4 px-4 space-y-4"
                >
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center min-h-[300px] p-6">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Bot size={28} className="opacity-70" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">أهلاً بالمساعد العقاري الذكي</h3>
                      <p className="text-sm text-muted-foreground max-w-md mb-6">
                        ابدأ محادثة للحصول على إجابات دقيقة لاستفساراتك العقارية
                      </p>
                      <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                        {sampleQuestions.slice(0, 2).map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-sm justify-start text-right truncate"
                            onClick={() => handleSampleQuestion(question)}
                          >
                            <span className="truncate">{question}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-4">
                      {messages.map((message, index) => {
                        const isUser = message.role === "user";
                        const showTimestamp = index === messages.length - 1 || 
                          messages[index + 1].role !== message.role;
                        
                        return (
                          <FadeIn key={message.id}>
                            <div 
                              className={`flex items-end gap-1.5 ${
                                isUser ? "justify-end" : "justify-start"
                              } ${index > 0 && messages[index - 1].role === message.role ? "mt-1" : "mt-3"}`}
                            >
                              {!isUser && (index === 0 || messages[index - 1].role !== message.role) && (
                                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground shadow-sm self-end mb-1`}>
                                  <Bot size={16} />
                                </div>
                              )}
                              <div
                                className={`relative max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm text-sm leading-relaxed break-words ${
                                  isUser
                                    ? "bg-primary text-primary-foreground rounded-br-sm ml-12"
                                    : "bg-secondary rounded-bl-sm mr-12"
                                } ${index > 0 && messages[index - 1].role === message.role 
                                  ? isUser ? "rounded-tr-md" : "rounded-tl-md" 
                                  : ""}`}
                              >
                                <p className="whitespace-pre-wrap">{message.content}</p>
                                
                                {showTimestamp && (
                                  <div className={`absolute ${isUser ? "-left-6 text-left" : "-right-6 text-right"} -bottom-5 text-[10px] text-muted-foreground opacity-70`}>
                                    {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </div>
                                )}
                              </div>
                              {isUser && (index === 0 || messages[index - 1].role !== message.role) && (
                                <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 text-primary shadow-sm self-end mb-1">
                                  <User size={15} />
                                </div>
                              )}
                            </div>
                          </FadeIn>
                        );
                      })}
                    </div>
                  )}
                  {isLoading && (
                    <div className="flex items-start gap-2 mt-3">
                      <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground shadow-sm">
                        <Bot size={16} />
                      </div>
                      <div className="bg-secondary rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm max-w-[85%] md:max-w-[70%]">
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Fixed scroll button that appears when not at bottom */}
                {!autoScroll && messages.length > 0 && (
                  <div className="absolute bottom-24 right-4 z-10">
                    <Button
                      size="icon"
                      className="rounded-full h-10 w-10 shadow-md bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => {
                        setAutoScroll(true);
                        scrollToBottom();
                      }}
                    >
                      <span>↓</span>
                    </Button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="border-t pt-4 pb-2 px-4 mt-auto">
                  <div className="relative flex items-end">
                    <Input
                      placeholder="اكتب سؤالك هنا..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="pr-12 py-3 rounded-xl border-2 focus:border-primary min-h-[50px] pl-14"
                      dir="rtl"
                      disabled={isLoading}
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="submit"
                            size="icon"
                            className="absolute left-1.5 bottom-1.5 h-9 w-9 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 disabled:opacity-50"
                            disabled={isLoading || !input.trim()}
                          >
                            <Send size={16} className="rtl:rotate-180" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>إرسال</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </form>
              </GlassCardContent>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
