import React, { useState, useRef, useEffect } from "react";
import {
  GlassCard,
  GlassCardContent,
  GlassCardHeader,
  GlassCardTitle,
} from "./ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Sparkles, User, Bot, Loader2 } from "lucide-react";
import { SlideIn, StaggeredChildren, FadeIn } from "./ui/transitions";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { queryGeminiModel, mockGeminiQuery } from "../services/gemini-service";
import { queryDeepseekModel, mockDeepseekQuery } from "../services/deepseek-service";
import { queryOllamaModel, mockOllamaQuery } from "../services/ollama-service";
import { useAuth } from "@/contexts/auth-context";
import { preventAutoScroll } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
};

// Helper function to remove common markdown formatting
function cleanMarkdown(text: string): string {
  // Remove bold (**text**) and italics (*text*). Also handles cases like ***text***.
  let cleanedText = text.replace(/(\*{1,3})([^\*]+?)\1/g, '$2');
  // Remove remaining stray asterisks used for emphasis/lists.
  cleanedText = cleanedText.replace(/(?<!\w)\*(?!\w)/g, ''); 
  // Remove leading list markers like '* ', '- ', '+ '.
  cleanedText = cleanedText.replace(/^\s*[-*+]\s+/gm, ''); 
  // Explicitly assign to variable before returning
  const result = cleanedText.trim(); 
  return result;
}

export function SaudiRealEstateExpert() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => {
    // Add initial system message but don't display it
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const initialMessages: Message[] = [
      {
        id: "assistant-1",
        role: "assistant" as const,
        content: `مرحباً ${user.name}، أنا أبو محمد مستشارك في مجال العقار. يمكنني مساعدتك بالمعلومات المتوفرة حول:\n\n- التمويل العقاري\n- خطوات شراء العقار\n- الإجراءات القانونية\n- المصطلحات العقارية\n\nهذه المنصة تقدم معلومات عامة فقط وليست بديلاً عن الاستشارات المهنية المتخصصة.`,
        timestamp: new Date(),
      }
    ];
    
    return initialMessages;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { user } = useAuth();

  // Updated sample questions with emojis
  const sampleQuestions = [
    { emoji: "🔑", text: "ما هي خطوات شراء عقار في السعودية؟" },
    { emoji: "💰", text: "كيف أختار تمويل عقاري يناسبني؟" },
    { emoji: "📈", text: "ما هي أساسيات الاستثمار العقاري؟" },
    { emoji: "🧾", text: "كم رسوم التسجيل وضريبة التصرفات العقارية؟" },
    { emoji: "🆚", text: "ما هي أنواع عقود التمويل العقاري؟" },
    { emoji: "⏰", text: "كيف أقيم العقار قبل الشراء؟" },
    { emoji: "💻", text: "كيف أتعامل مع منصة إيجار؟" }
  ];

  // يتحقق مما إذا كان المستخدم في نهاية المحادثة
  const isAtBottom = () => {
    if (!chatContainerRef.current) return true;
    
    const container = chatContainerRef.current;
    const threshold = 100; // بكسل
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    
    return distanceFromBottom <= threshold;
  };

  // مراقبة التمرير لتحديد ما إذا كان المستخدم في أسفل المحادثة
  const handleScroll = () => {
    if (chatContainerRef.current) {
      setAutoScroll(isAtBottom());
    }
  };

  // تعيين الموضع المبدئي عند تحميل المكون
  useEffect(() => {
    // منع التمرير التلقائي للأسفل بشكل مكثف
    const cleanup = preventAutoScroll();
    
    // تطبيق متكرر لمنع التمرير للأسفل
    const additionalPrevention = setInterval(() => {
      window.scrollTo(0, 0);
    }, 100);
    
    // إيقاف التطبيق المتكرر بعد ثانية
    const stopPrevention = setTimeout(() => {
      clearInterval(additionalPrevention);
    }, 1000);
    
    if (chatContainerRef.current) {
      chatContainerRef.current.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.removeEventListener('scroll', handleScroll);
      }
      
      if (cleanup) cleanup();
      clearInterval(additionalPrevention);
      clearTimeout(stopPrevention);
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
        if (messagesEndRef.current) {
          // استخدام scrollTop بدلاً من scrollIntoView للتحكم بشكل أفضل
          const container = chatContainerRef.current;
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        }
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [messages, autoScroll, isInitialLoad]);

  useEffect(() => {
    // منع التمرير لأسفل عند إضافة رسالة الترحيب
    const initialScrollPos = window.scrollY;
    
    // إضافة رسالة ترحيب عند تحميل الصفحة
    if (user?.name && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `مرحباً ${user.name}، أنا أبو محمد مستشارك في مجال العقار. يمكنني مساعدتك بالمعلومات المتوفرة حول:\n\n- التمويل العقاري\n- خطوات شراء العقار\n- الإجراءات القانونية\n- المصطلحات العقارية\n\nهذه المنصة تقدم معلومات عامة فقط وليست بديلاً عن الاستشارات المهنية المتخصصة.`,
        timestamp: new Date(),
      };
      
      setMessages([welcomeMessage]);
    }
    
    // الحفاظ على موضع التمرير
    window.scrollTo(0, initialScrollPos);
    
    // إعادة تطبيق منع التمرير التلقائي للتأكيد
    const timer = setTimeout(() => {
      window.scrollTo(0, initialScrollPos);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [user, messages.length]);

  const getAIResponse = async (question: string) => {
    setIsLoading(true);
    setActiveModel(null);
    
    // حفظ موضع التمرير الحالي
    const currentScrollPosition = chatContainerRef.current?.scrollTop || 0;
    
    let response: string | null = null;
    let modelUsed: string | null = null;

    const finalMockFallback = async (query: string): Promise<string> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return `عذراً، نواجه حالياً صعوبة في الاتصال بنماذج الذكاء الاصطناعي. الرجاء المحاولة مرة أخرى لاحقاً. سؤالك كان عن: ${query}`;
    };

    try {
      // Prepare conversation history (simple format, assuming services adapt)
      const conversationHistory = messages.map((msg) => ({ 
        role: msg.role, 
        content: msg.content 
      }));

      // --- Attempt 1: Gemini --- 
      try {
        console.log("Attempting Gemini...");
        response = await queryGeminiModel(question, conversationHistory);
        modelUsed = "Gemini";
        console.log("Gemini responded.");
      } catch (geminiError) {
        console.warn("Gemini failed:", geminiError);
        // --- Attempt 2: DeepSeek --- 
        try {
          console.log("Attempting DeepSeek...");
          response = await queryDeepseekModel(question, conversationHistory);
          modelUsed = "DeepSeek";
          console.log("DeepSeek responded.");
        } catch (deepseekError) {
          console.warn("DeepSeek failed:", deepseekError);
          // --- Attempt 3: Ollama --- 
          try {
            console.log("Attempting Ollama...");
            response = await queryOllamaModel(question, conversationHistory);
            modelUsed = "Ollama";
            console.log("Ollama responded.");
          } catch (ollamaError) {
            console.error("All primary models failed. Ollama error:", ollamaError);
            // --- Attempt 4: Mock Fallback (Simple) ---
            console.log("Using final mock fallback.");
            response = await finalMockFallback(question); 
            modelUsed = "Fallback";
          }
        }
      }
      
      // --- Process the successful response --- 
      if (response === null) {
        throw new Error("Failed to get any response, including fallback.");
      }

      // Clean the response before displaying
      const cleanedResponse = cleanMarkdown(response);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: cleanedResponse,
        timestamp: new Date(),
      };
      
      // تحديث الرسائل مع الحفاظ على موضع التمرير
      setMessages(prev => {
        const updatedMessages = [...prev, assistantMessage];
        
        // استخدام setTimeout للتأكد من تنفيذ هذا الكود بعد تحديث واجهة المستخدم
        setTimeout(() => {
          if (chatContainerRef.current && !autoScroll) {
            // إعادة ضبط موضع التمرير فقط إذا كان المستخدم لم يفعل التمرير التلقائي
            chatContainerRef.current.scrollTop = currentScrollPosition;
          }
        }, 0);
        
        return updatedMessages;
      });
      
      setActiveModel(modelUsed); 

    } catch (error) {
      console.error("Error processing AI response:", error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من الحصول على رد. يرجى المحاولة مرة أخرى.",
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
    
    if (!input.trim() || isLoading) return;
    
    // حفظ موضع التمرير الحالي
    const currentScrollPosition = chatContainerRef.current?.scrollTop || 0;
    
    const currentInput = input;
    setInput("");
    
    // إضافة رسالة المستخدم
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: currentInput,
      timestamp: new Date(),
    };
    
    // تحديث الرسائل مع الحفاظ على موضع التمرير
    setMessages(prev => {
      const updatedMessages = [...prev, userMessage];
      
      // استخدام setTimeout للتأكد من تنفيذ هذا الكود بعد تحديث واجهة المستخدم
      setTimeout(() => {
        if (chatContainerRef.current) {
          // إعادة ضبط موضع التمرير إلى ما كان عليه
          chatContainerRef.current.scrollTop = currentScrollPosition;
        }
      }, 0);
      
      return updatedMessages;
    });
    
    // الحصول على رد المساعد الذكي
    await getAIResponse(currentInput);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // ضبط ارتفاع مساحة النص تلقائيًا
    e.target.style.height = "42px";
    const scrollHeight = e.target.scrollHeight;
    const newHeight = Math.min(Math.max(scrollHeight, 42), 150); // الحد الأدنى 42px والحد الأقصى 150px
    e.target.style.height = `${newHeight}px`;
  };

  const handleSampleQuestion = async (question: string) => {
    if (isLoading) return;
    
    // حفظ موضع التمرير الحالي
    const currentScrollPosition = chatContainerRef.current?.scrollTop || 0;
    
    setIsInitialLoad(false); // إيقاف وضع التحميل الأولي عند النقر على سؤال
    
    // إضافة رسالة المستخدم
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: question,
      timestamp: new Date(),
    };
    
    // تحديث الرسائل مع الحفاظ على موضع التمرير
    setMessages(prev => {
      const updatedMessages = [...prev, userMessage];
      
      // استخدام setTimeout للتأكد من تنفيذ هذا الكود بعد تحديث واجهة المستخدم
      setTimeout(() => {
        if (chatContainerRef.current) {
          // إعادة ضبط موضع التمرير إلى ما كان عليه
          chatContainerRef.current.scrollTop = currentScrollPosition;
        }
      }, 0);
      
      return updatedMessages;
    });
    
    // الحصول على رد المساعد الذكي
    await getAIResponse(question);
  };

  const handleManualScroll = () => {
    setAutoScroll(true);
    setIsInitialLoad(false);
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  return (
    <section className="py-8 px-4 relative flex justify-center items-start min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 order-2 md:order-1">
            <GlassCard className="sticky top-8 p-1 bg-white/60 dark:bg-slate-900/60 shadow-lg border border-primary/10">
              <GlassCardHeader className="pb-3 pt-4 px-4">
                <GlassCardTitle className="text-base font-semibold text-primary-foreground dark:text-primary flex items-center gap-2">
                  <Sparkles size={18} className="opacity-80"/>
                  <span>اقتراحات للأسئلة</span>
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="px-3 pb-4">
                <StaggeredChildren staggerDelay={60} className="space-y-2.5 flex flex-col items-stretch">
                  {sampleQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full h-auto justify-start text-right text-sm font-medium py-3 px-4 rounded-lg text-foreground/90 hover:bg-primary/5 hover:text-primary dark:hover:bg-primary/10 dark:border-primary/20 hover:border-primary/30 transition-all duration-200 group flex items-center gap-3 shadow-sm border border-border overflow-hidden"
                      onClick={() => handleSampleQuestion(question.text)}
                      disabled={isLoading}
                    >
                      <span className="flex-none text-lg opacity-90 group-hover:scale-110 transition-transform duration-200 w-6 text-center">{question.emoji}</span>
                      <span className="flex-1 text-right leading-snug min-w-0 break-words whitespace-normal">{question.text}</span>
                    </Button>
                  ))}
                </StaggeredChildren>
              </GlassCardContent>
            </GlassCard>
          </div>

          <div className="md:col-span-2 order-1 md:order-2">
            <div className="flex flex-col h-[85vh] bg-card rounded-xl shadow-xl border overflow-hidden">
              <GlassCardHeader className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10 px-5 py-4">
                <GlassCardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2.5 font-semibold text-lg">
                    <Bot size={22} className="text-primary"/>
                    <span>أبو محمد مستشارك العقاري الذكي</span>
                  </span>
                  {!autoScroll && messages.length > 2 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1.5 hover:bg-primary/10"
                      onClick={handleManualScroll}
                    >
                      <span>↓</span>
                      <span className="text-xs">التمرير لأسفل</span>
                    </Button>
                  )}
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="flex-1 overflow-hidden flex flex-col p-0 relative">
                <div 
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto py-4 px-4 space-y-4 scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-primary/50 scrollbar-track-transparent"
                >
                  {messages.length === 0 && !isLoading && (
                    <FadeIn delay={300}>
                      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6">
                        <div className="mb-4 p-3 bg-primary/10 rounded-full">
                          <Bot className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">مرحباً بك في أبو محمد مستشارك العقاري الذكي</h3>
                        <p className="text-sm text-muted-foreground max-w-md mb-6">
                          اطرح أي سؤال حول الأمور العقارية وسأقدم لك المعلومات المتوفرة
                        </p>
                        <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                          {sampleQuestions.slice(0, 2).map((question, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-sm justify-start text-right truncate"
                              onClick={() => handleSampleQuestion(question.text)}
                            >
                              <span className="mr-1.5">{question.emoji}</span>
                              <span className="truncate">{question.text}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </FadeIn>
                  )}
                  
                  <div className="flex flex-col space-y-4">
                    {messages.map((message, index) => {
                      // Skip system messages
                      if (message.role === "system") return null;
                      
                      const isUser = message.role === "user";
                      const showTimestamp = index === messages.length - 1 || 
                        messages[index + 1]?.role !== message.role;
                      
                      return (
                        <FadeIn key={message.id} duration={300}>
                          <div
                            className={`flex items-end gap-1.5 ${
                              isUser ? "justify-end" : "justify-start"
                            } ${index > 0 && messages[index - 1].role === message.role ? "mt-1" : "mt-3"}`}
                          >
                            {!isUser && (index === 0 || messages[index - 1].role !== message.role) && (
                              <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-tr from-primary to-secondary text-primary-foreground shadow-sm self-end mb-1">
                                <Bot size={16} />
                              </div>
                            )}
                            <div
                              dir="rtl"
                              className={`relative max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm transition-all duration-300 ease-out text-sm leading-relaxed break-words ${
                                isUser 
                                  ? "bg-primary text-primary-foreground rounded-br-sm ml-12" 
                                  : "bg-card border border-border rounded-bl-sm mr-12"
                              } ${index > 0 && messages[index - 1].role === message.role 
                                ? isUser ? "rounded-tr-md" : "rounded-tl-md" 
                                : ""}`}
                              style={{ whiteSpace: 'pre-wrap' }}
                            >
                              {message.content}
                              
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
                  
                  {isLoading && (
                    <FadeIn duration={200}>
                      <div className="flex items-start gap-2 mt-3">
                        <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-tr from-primary to-secondary text-primary-foreground shadow-sm">
                          <Bot size={16} />
                        </div>
                        <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm max-w-[85%] md:max-w-[70%]">
                          <div className="flex space-x-2 rtl:space-x-reverse items-center">
                            <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                            <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                          </div>
                        </div>
                      </div>
                    </FadeIn>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Fixed scroll button that appears when not at bottom */}
                {!autoScroll && messages.length > 0 && (
                  <div className="absolute bottom-24 right-4 z-10">
                    <Button
                      size="icon"
                      className="rounded-full h-10 w-10 shadow-md bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={handleManualScroll}
                    >
                      <span>↓</span>
                    </Button>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="p-4 border-t bg-background/95 backdrop-blur-sm sticky bottom-0 mt-auto">
                  <div className="relative flex items-end">
                    <textarea
                      placeholder="اكتب سؤالك هنا..."
                      value={input}
                      onChange={handleInputChange}
                      className="w-full pr-12 pl-4 py-3 text-sm rounded-xl border-2 border-border focus-visible:border-primary transition-colors duration-200 bg-background shadow-sm resize-none overflow-hidden min-h-[50px]"
                      disabled={isLoading}
                      style={{ height: '42px' }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e as any);
                        }
                      }}
                    />
                    <TooltipProvider delayDuration={200}>
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
