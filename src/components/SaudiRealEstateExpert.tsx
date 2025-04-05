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
    // إضافة رسالة ترحيب بلهجة سعودية باستخدام اسم المستخدم
    try {
      // محاولة الحصول على اسم المستخدم من جميع المصادر المحتملة
      let userName = null;
      
      // 1. من كائن المستخدم المخزن
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser && parsedUser.name && typeof parsedUser.name === 'string' && parsedUser.name.trim() !== '') {
            userName = parsedUser.name.trim();
          }
        } catch (e) {
          console.error("خطأ في تحليل بيانات المستخدم:", e);
        }
      }
      
      // 2. من localStorage مباشرة
      if (!userName) {
        const localName = localStorage.getItem("userName") || localStorage.getItem("username");
        if (localName && typeof localName === 'string' && localName.trim() !== '') {
          userName = localName.trim();
        }
      }
      
      // 3. من sessionStorage
      if (!userName) {
        const sessionName = sessionStorage.getItem("userName") || sessionStorage.getItem("username");
        if (sessionName && typeof sessionName === 'string' && sessionName.trim() !== '') {
          userName = sessionName.trim();
        }
      }
      
      // إذا وجدنا اسم المستخدم، نستخدمه في رسالة الترحيب
      if (userName) {
        return [{
          id: "system-welcome",
          role: "assistant" as const,
          content: `حيّاك الله يا ${userName}! أنا أبو محمد من الرياض، مستشارك في سوق العقار السعودي. مستعد أساعدك في الإسكان والتمويل والاستثمار والصيانة وكل شي يخص العقار. وش المعلومة اللي تدوّر عليها اليوم؟`,
          timestamp: new Date(),
        }];
      } else {
        // رسالة ترحيب افتراضية إذا لم نجد اسم المستخدم
        return [{
          id: "system-welcome",
          role: "assistant" as const,
          content: `حيّاك الله يالغالي! أنا أبو محمد من الرياض، مستشارك في سوق العقار السعودي. مستعد أساعدك في الإسكان والتمويل والاستثمار والصيانة وكل شي يخص العقار. وش المعلومة اللي تدوّر عليها اليوم؟`,
          timestamp: new Date(),
        }];
      }
    } catch (error) {
      console.error("حدث خطأ أثناء إنشاء رسالة الترحيب:", error);
      // رسالة ترحيب بديلة في حالة حدوث خطأ
      return [{
        id: "system-welcome",
        role: "assistant" as const,
        content: `حيّاك الله يالغالي! أنا أبو محمد من الرياض، مستشارك في سوق العقار السعودي. مستعد أساعدك في الإسكان والتمويل والاستثمار والصيانة وكل شي يخص العقار. وش المعلومة اللي تدوّر عليها اليوم؟`,
        timestamp: new Date(),
      }];
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
    // متابعة حالة المستخدم وتسجيل الدخول
    if (isLoading) return;
    
    if (!isAuthenticated) {
      // إذا لم يكن المستخدم مسجل، نوجهه لصفحة تسجيل الدخول
      console.log("🔒 User not authenticated, redirecting to login");
      window.location.href = import.meta.env.MODE === 'production' ? '/masaralaqar/login' : '/login';
    } else {
      setAuthChecked(true);
    }
  }, [isAuthenticated, isLoading]);

  // تفعيل الكتابة في المدخل عند الضغط على زر الإرسال
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
        e.preventDefault();
        const event = new Event('submit', { cancelable: true }) as unknown as React.FormEvent;
        handleSubmit(event);
      }
    };

    if (inputRef.current) {
      inputRef.current.addEventListener("keydown", handleKeyDown);
      inputRef.current.focus();
    }

    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [isLoading]);

  const getAIResponse = async (question: string) => {
    setIsLoading(true);
    setActiveModel(null);
    
    // حفظ موضع التمرير الحالي
    const currentScrollPosition = chatContainerRef.current?.scrollTop || 0;
    
    let response: string | null = null;
    let modelUsed: string | null = null;

    const finalMockFallback = async (query: string): Promise<string> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return `عذراً يا طيب، أواجه حالياً صعوبة في الاتصال. ممكن تعيد سؤالك بعد شوي؟ سؤالك كان عن: ${query}`;
    };

    try {
      // تعديل المحادثة لتشمل تعليمات للذكاء الاصطناعي بالرد بلهجة سعودية
      const systemPrompt = {
        id: "system-prompt-" + Date.now().toString(),
        role: "system" as const,
        content: `أنت أبو محمد، خبير عقاري سعودي متخصص جداً في مجال العقار والاستثمار العقاري وصيانة المنزل في المملكة العربية السعودية. 
        - تجيب دائماً باللهجة السعودية الواضحة والمفهومة (مثل: وش رايك، يبيلك، عشان، إلخ)
        - خبرتك محصورة في مجال العقار والاستثمار العقاري وصيانة المنزل في السعودية
        - إذا سُئلت عن أي موضوع خارج نطاق خبرتك، اعتذر بأدب وبلهجة سعودية
        - أجوبتك دقيقة ومختصرة وعملية
        - تتحدث بصيغة المتكلم المفرد (أنا، أقدر، عندي)`,
        timestamp: new Date()
      };
      
      // استخدام messages مباشرة مع إضافة systemPrompt
      const conversationHistory = [
        systemPrompt,
        ...messages
      ];

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
            <div className="flex flex-col h-[85vh] sm:h-[85vh] bg-card rounded-xl shadow-xl border overflow-hidden">
              <GlassCardHeader className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10 px-3 sm:px-5 py-3 sm:py-4">
                <GlassCardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2 sm:gap-2.5 font-semibold text-base sm:text-lg">
                    <Bot size={20} className="text-primary"/>
                    <span>أبو محمد مستشارك العقاري</span>
                  </span>
                  {!autoScroll && messages.length > 2 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1.5 hover:bg-primary/10"
                      onClick={handleManualScroll}
                    >
                      <span>↓</span>
                      <span className="text-xs">التمرير</span>
                    </Button>
                  )}
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="flex-1 overflow-hidden flex flex-col p-0 relative">
                <div 
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto py-3 sm:py-4 px-3 sm:px-4 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-primary/50 scrollbar-track-transparent"
                  style={{ overscrollBehavior: 'contain', direction: 'rtl' }}
                >
                  {messages.length === 0 && !isLoading && (
                    <FadeIn delay={300}>
                      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-6">
                        <div className="mb-4 p-3 bg-primary/10 rounded-full">
                          <Bot className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">حيّاك الله في مستشارك العقاري الذكي</h3>
                        <p className="text-sm text-muted-foreground max-w-md mb-6">
                          أنا أبو محمد من الرياض، مستعد أساعدك في الإسكان والتمويل والاستثمار والصيانة وكل شي يخص العقار. وش المعلومة اللي تدوّر عليها اليوم؟
                        </p>
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
                              isUser ? "justify-start" : "justify-end"
                            } ${index > 0 && messages[index - 1].role === message.role ? "mt-1" : "mt-3"}`}
                            dir="rtl"
                          >
                            {!isUser && (index === 0 || messages[index - 1].role !== message.role) && (
                              <div className="shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-gradient-to-tr from-primary to-secondary text-primary-foreground shadow-sm self-end mb-1">
                                <Bot size={14} className="sm:size-16" />
                              </div>
                            )}
                            <div
                              className={`relative max-w-[95%] sm:max-w-[90%] md:max-w-[85%] rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-4 shadow-sm transition-all duration-300 ease-out text-sm md:text-base leading-relaxed break-words whitespace-pre-wrap text-right ${
                                isUser 
                                  ? "bg-primary text-primary-foreground rounded-br-sm mr-8 sm:mr-12" 
                                  : "bg-card border border-border rounded-bl-sm ml-8 sm:ml-12"
                              } ${index > 0 && messages[index - 1].role === message.role 
                                ? isUser ? "rounded-tr-md" : "rounded-tl-md" 
                                : ""}`}
                            >
                              {message.content}
                              
                              {showTimestamp && (
                                <div className={`absolute ${isUser ? "-right-6 text-right" : "-left-6 text-left"} -bottom-5 text-[10px] text-muted-foreground opacity-70`}>
                                  {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                              )}
                            </div>
                            {isUser && (index === 0 || messages[index - 1].role !== message.role) && (
                              <div className="shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-primary/10 text-primary shadow-sm self-end mb-1">
                                <User size={13} className="sm:size-15" />
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
                
                <form onSubmit={handleSubmit} className="p-2 sm:p-4 border-t bg-background/95 backdrop-blur-sm sticky bottom-0 mt-auto">
                  <div className="relative flex items-end">
                    <textarea
                      ref={inputRef}
                      placeholder="اكتب سؤالك هنا..."
                      value={input}
                      onChange={handleInputChange}
                      className="w-full pr-10 sm:pr-12 pl-2 sm:pl-4 py-2 sm:py-3 text-sm rounded-xl border-2 border-border focus-visible:border-primary transition-colors duration-200 bg-background shadow-sm resize-none overflow-hidden min-h-[42px] whitespace-pre-wrap leading-relaxed text-right"
                      disabled={isLoading}
                      style={{ height: '42px', maxHeight: '150px', direction: 'rtl' }}
                      onInput={(e) => {
                        e.currentTarget.style.height = "auto";
                        const newHeight = Math.min(Math.max(e.currentTarget.scrollHeight, 42), 150);
                        e.currentTarget.style.height = `${newHeight}px`;
                      }}
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
                            className="absolute left-1 sm:left-1.5 bottom-1 sm:bottom-1.5 h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 disabled:opacity-50"
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
