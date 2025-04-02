
import React, { useState, useRef, useEffect } from "react";
import { GlassCard, GlassCardContent, GlassCardHeader, GlassCardTitle } from "./ui/glass-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, ArrowRight, User, Bot } from "lucide-react";
import { SlideIn, StaggeredChildren, FadeIn } from "./ui/transitions";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export function AIAssistant() {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Predefined sample questions
  const sampleQuestions = [
    "ما هي شروط التمويل العقاري في البنك الأهلي؟",
    "كيف أحسب الدعم السكني المناسب لي؟",
    "ما الفرق بين التمويل الثابت والمتغير؟",
    "كيف أعرف أقصى مبلغ تمويل يمكنني الحصول عليه؟"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate AI response with predefined answers
  const getAIResponse = async (question: string) => {
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
    
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInput("");
    
    await getAIResponse(input);
  };

  const handleSampleQuestion = async (question: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: question,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    await getAIResponse(question);
  };

  return (
    <section className="py-12 px-6 relative">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">المساعد العقاري الذكي</h2>
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
                <GlassCardTitle className="flex items-center gap-2">
                  <MessageSquare size={20} />
                  <span>المحادثة مع المساعد العقاري</span>
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                      <Bot size={48} className="mb-4 opacity-50" />
                      <p className="text-center">
                        ابدأ محادثة مع المساعد العقاري الذكي للحصول على إجابات لاستفساراتك
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <FadeIn key={message.id}>
                        <div
                          className={`flex ${
                            message.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`flex items-start gap-3 max-w-[80%] ${
                              message.role === "user"
                                ? "flex-row-reverse"
                                : "flex-row"
                            }`}
                          >
                            <div
                              className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                message.role === "user"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-secondary text-secondary-foreground"
                              }`}
                            >
                              {message.role === "user" ? (
                                <User size={16} />
                              ) : (
                                <Bot size={16} />
                              )}
                            </div>
                            <div
                              className={`rounded-2xl px-4 py-3 ${
                                message.role === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                            </div>
                          </div>
                        </div>
                      </FadeIn>
                    ))
                  )}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-3 max-w-[80%]">
                        <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-secondary">
                          <Bot size={16} />
                        </div>
                        <div className="bg-secondary rounded-2xl px-4 py-3">
                          <div className="flex space-x-2 rtl:space-x-reverse">
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0.4s]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="mt-auto">
                  <div className="relative">
                    <Input
                      placeholder="اكتب سؤالك هنا..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="pr-12 py-6"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="submit"
                            size="icon"
                            className="absolute left-1 top-1 bottom-1"
                            disabled={isLoading || !input.trim()}
                          >
                            <Send size={18} />
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
