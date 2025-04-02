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

  // Predefined sample questions
  const sampleQuestions = [
    "ما هي شروط التمويل العقاري في البنك الأهلي؟",
    "كيف أحسب الدعم السكني المناسب لي؟",
    "ما الفرق بين التمويل الثابت والمتغير؟",
    "كيف أعرف أقصى مبلغ تمويل يمكنني الحصول عليه؟",
    "ما هي أفضل مناطق الاستثمار العقاري في الرياض؟",
    "كيف يمكنني الاستفادة من برنامج سكني؟",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get AI response using the deepseek model
  const getAIResponse = async (question: string) => {
    setIsLoading(true);

    try {
      // Convert messages to the format expected by the deepseek service
      const conversationHistory = messages
        .filter((msg) => msg.role !== "system")
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      try {
        // محاولة استخدام نموذج Gemini أولاً
        const response = await queryGeminiModel(question, conversationHistory);
        return response;
      } catch (error) {
        console.log(
          "فشل الاتصال بنموذج Gemini، استخدام النموذج المحلي بدلاً من ذلك",
          error,
        );
        // استخدام النموذج المحلي كخطة بديلة
        return await mockGeminiQuery(question);
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast({
        title: "حدث خطأ",
        description:
          "لم نتمكن من الحصول على رد من المساعد الذكي. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

    setMessages((prev) => [...prev, newMessage]);
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

    setMessages((prev) => [...prev, newMessage]);
    await getAIResponse(question);
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
                <GlassCardTitle className="flex items-center gap-2">
                  <MessageSquare size={20} />
                  <span>المحادثة مع المساعد العقاري الذكي</span>
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                      <Bot size={48} className="mb-4 opacity-50" />
                      <p className="text-center">
                        ابدأ محادثة مع المساعد العقاري الذكي للحصول على إجابات
                        دقيقة لاستفساراتك العقارية
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <FadeIn key={message.id}>
                        <div
                          className={`flex ${
                            message.role === "user"
                              ? "justify-end"
                              : "justify-start"
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
                      dir="rtl"
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
