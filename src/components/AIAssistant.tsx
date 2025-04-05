import React, { useState, useRef, useEffect } from "react";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "./ui/glass-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, ArrowRight, User, Bot } from "lucide-react";
import { SlideIn, StaggeredChildren, FadeIn } from "./ui/transitions";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { preventAutoScroll } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

interface AIAssistantProps {
  initialMessage?: string;
  placeholder?: string;
  headerTitle?: string;
}

export function AIAssistant({
  initialMessage = "مرحباً، أنا المساعد الذكي. كيف يمكنني مساعدتك اليوم؟",
  placeholder = "اكتب رسالتك هنا...",
  headerTitle = "المساعد الذكي"
}: AIAssistantProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Predefined sample questions
  const sampleQuestions = [
    "ما هي شروط التمويل العقاري في البنك الأهلي؟",
    "كيف أحسب الدعم السكني المناسب لي؟",
    "ما الفرق بين التمويل الثابت والمتغير؟",
    "كيف أعرف أقصى مبلغ تمويل يمكنني الحصول عليه؟"
  ];

  const isAtBottom = (): boolean => {
    if (!chatContainerRef.current) return true;
    const container = chatContainerRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    return distanceFromBottom <= 50;
  };

  const scrollToBottom = () => {
    // لا نمرر تلقائيًا عند التحميل الأولي
    if (isInitialLoad) return;
    
    // نمرر فقط إذا كان المستخدم في أسفل المحادثة أو تم تفعيل التمرير التلقائي
    if (autoScroll && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // مراقبة التمرير لتحديد ما إذا كان المستخدم في أسفل المحادثة
  const handleScroll = () => {
    if (chatContainerRef.current) {
      setAutoScroll(isAtBottom());
    }
  };

  // إلغاء التمرير التلقائي عند تحميل المكون
  useEffect(() => {
    const cleanup = preventAutoScroll();
    return () => {
      if (cleanup) cleanup();
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

  // التمرير للأسفل عند إضافة رسائل جديدة (إذا كان المستخدم في نهاية المحادثة)
  useEffect(() => {
    if (chatContainerRef.current && isAtBottom() && autoScroll) {
      const timer = setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, autoScroll]);

  // Simulate AI response with predefined answers
  const getAIResponse = async (question: string, currentScrollPosition: number) => {
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Sample responses based on question keywords
    let response = "";
    
    if (question.includes("شروط التمويل") || question.includes("البنك الأهلي")) {
      response = "تشترط البنوك السعودية عدة شروط للتمويل العقاري، منها أن يكون المتقدم سعودي الجنسية، وألا يقل عمره عن 21 عامًا، وألا يزيد عن 60 عامًا عند نهاية فترة التمويل. كما يجب أن يكون الدخل الشهري لا يقل عن 4,000 ريال، وألا تتجاوز نسبة الاستقطاع الشهرية 65% من الراتب حسب شريحة الدخل.";
    } 
    else if (question.includes("الدعم السكني") || question.includes("حساب الدعم")) {
      response = "يعتمد الدعم السكني على دخلك الشهري وعدد أفراد الأسرة. إذا كان دخلك 14,000 ريال أو أقل، تحصل على دعم 100% لأرباح التمويل. أما إذا كان دخلك أعلى، فتنخفض نسبة الدعم بمقدار 5% لكل 1,000 ريال زيادة في الدخل. يمكنك زيارة موقع صندوق التنمية العقارية لمعرفة التفاصيل الدقيقة.";
    }
    else if (question.includes("التمويل الثابت") || question.includes("التمويل المتغير")) {
      response = "في التمويل الثابت، يبقى معدل الربح (الفائدة) ثابتًا طوال مدة العقد، مما يعني أن قسطك الشهري سيظل ثابتًا. أما في التمويل المتغير، فيتغير معدل الربح وفقًا لمؤشر السايبور (SAIBOR)، وبالتالي قد يزيد أو ينخفض القسط الشهري. معظم البنوك السعودية توفر التمويل الثابت للمشاريع السكنية المدعومة.";
    }
    else if (question.includes("أقصى مبلغ تمويل") || question.includes("مبلغ يمكنني الحصول عليه")) {
      response = "يعتمد أقصى مبلغ تمويل على عدة عوامل منها: دخلك الشهري، الالتزامات المالية القائمة، نسبة الاستقطاع المسموح بها حسب شريحة الدخل، ومدة التمويل. البنوك السعودية عادة تمول حتى 90% من قيمة المسكن الأول. يمكنك استخدام حاسبة التمويل العقاري لتقدير المبلغ المناسب لك.";
    }
    else {
      response = "شكرًا لسؤالك. للحصول على معلومات دقيقة حول هذا الموضوع، أنصحك بالتواصل مباشرة مع البنك المعني أو زيارة موقع وزارة الإسكان وبرنامج سكني للاطلاع على أحدث المعلومات والتفاصيل الخاصة بالتمويل العقاري والدعم السكني.";
    }
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };
    
    // تحديث الرسائل مع الحفاظ على موضع التمرير
    setMessages(prev => {
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
    
    setIsLoading(false);
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
    setMessages(prev => {
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
    setMessages(prev => {
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
    <section className="py-12 px-6 relative">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">{headerTitle}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            اسأل أي سؤال عن التمويل العقاري، برامج الدعم السكني، أو استفسارات أخرى تتعلق بالعقارات في المملكة
          </p>
        </div>

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
                      <ArrowRight size={16} className="mr-auto rtl:rotate-180" />
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
                    <span>{headerTitle}</span>
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
                      <h3 className="text-lg font-medium mb-2">مرحباً بك في المساعد الذكي</h3>
                      <p className="text-sm text-muted-foreground max-w-md mb-6">
                        أنا هنا للإجابة عن استفساراتك ومساعدتك في مختلف المجالات
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
                                <div className="flex items-center gap-2 mb-1">
                                  {isUser ? (
                                    <User className="h-4 w-4" />
                                  ) : (
                                    <Bot className="h-4 w-4" />
                                  )}
                                  <span className="font-medium">
                                    {isUser ? "أنت" : headerTitle}
                                  </span>
                                </div>
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
                      placeholder={placeholder}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="pr-12 py-3 rounded-xl border-2 focus:border-primary min-h-[50px] pl-14"
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
