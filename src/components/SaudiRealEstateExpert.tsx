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

type Message = {
  id: string;
  role: "user" | "assistant";
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Updated sample questions with emojis
  const sampleQuestions = [
    { emoji: "🔑", text: "ما هي خطوات شراء عقار في السعودية؟" },
    { emoji: "💰", text: "كيف أختار أفضل تمويل عقاري يناسبني؟" },
    { emoji: "📈", text: "ما هي نصائحك للاستثمار العقاري الآمن؟" },
    { emoji: "🧾", text: "كم رسوم التسجيل وضريبة التصرفات العقارية؟" },
    { emoji: "🆚", text: "ما الفرق بين إيجار منتهي بالتمليك والتمويل العادي؟" },
    { emoji: "⏰", text: "هل الوقت الحالي مناسب لشراء عقار؟" },
    { emoji: "💻", text: "كيف أتعامل مع منصة إيجار؟" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // إضافة رسالة ترحيب عند تحميل الصفحة
    if (user?.name) {
      setMessages([
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `مرحباً ${user.name}، أنا مستشارك العقاري الذكي. كيف يمكنني مساعدتك اليوم؟ يمكنني تقديم المشورة حول:\n\n- التمويل العقاري\n- اختيار العقار المناسب\n- تحليل الأسعار\n- نصائح الاستثمار العقاري\n- وغيرها من المواضيع المتعلقة بالعقارات`,
          timestamp: new Date(),
        }
      ]);
    }
  }, [user]);

  const getAIResponse = async (question: string) => {
    setIsLoading(true);
    setActiveModel(null);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: question,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

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
      
      setMessages(prev => [...prev, assistantMessage]);
      setActiveModel(modelUsed); 

    } catch (error) {
      console.error("Error processing AI response:", error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من الحصول على رد. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    const currentInput = input;
    setInput("");
    
    await getAIResponse(currentInput);
  };

  const handleSampleQuestion = async (question: string) => {
    if (isLoading) return;
    await getAIResponse(question);
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
                  <span>جرب تسألني عن</span>
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
                    <span>البوت العقاري الذكي</span>
                  </span>
                </GlassCardTitle>
              </GlassCardHeader>
              <GlassCardContent className="flex-1 overflow-hidden flex flex-col p-0">
                <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-primary/50 scrollbar-track-transparent">
                  {messages.length === 0 && !isLoading && (
                    <FadeIn delay={300}>
                      <div className="flex items-start gap-3 justify-start">
                        <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-tr from-primary to-secondary text-primary-foreground shadow-md">
                          <Bot size={17} />
                        </div>
                        <div className="max-w-[85%] md:max-w-[75%] rounded-xl rounded-bl-none px-4 py-3 shadow-sm bg-background border border-border" dir="rtl">
                           <p className="text-base font-semibold mb-1">أهلاً بك! أنا أبو محمد، خبيرك العقاري.</p>
                           <p className="text-sm text-muted-foreground">
                             اسألني عن أي شيء يخص العقار في السعودية!
                           </p>
                        </div>
                      </div>
                    </FadeIn>
                  )}
                  {messages.map((message) => (
                    <FadeIn key={message.id} duration={500}>
                      <div
                        className={`flex items-end gap-2.5 ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {message.role === "assistant" && (
                          <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-tr from-primary to-secondary text-primary-foreground shadow-md self-start mt-1">
                            <Bot size={17} />
                          </div>
                        )}
                        <div
                          dir="rtl"
                          className={`max-w-[85%] md:max-w-[75%] rounded-xl px-4 py-3 shadow-md transition-all duration-300 ease-out text-sm leading-relaxed break-words ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground rounded-br-none"
                              : "bg-gradient-to-br from-background to-primary/5 border border-border rounded-bl-none"
                          }`}
                          style={{ whiteSpace: 'pre-wrap' }}
                        >
                           {message.content}
                        </div>
                        {message.role === "user" && (
                          <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-muted text-muted-foreground shadow-md self-start mt-1">
                            <User size={16} />
                          </div>
                        )}
                      </div>
                    </FadeIn>
                  ))}
                  {isLoading && (
                    <FadeIn duration={300}>
                      <div className="flex items-start gap-3 justify-start pl-11 pb-2">
                        <div className="bg-background border rounded-xl px-4 py-2.5 shadow-md rounded-bl-none">
                          <div className="flex space-x-2 rtl:space-x-reverse items-center">
                            <Loader2 size={14} className="text-muted-foreground animate-spin"/>
                            <span className="text-xs text-muted-foreground">أبو محمد يفكر...</span>
                          </div>
                        </div>
                      </div>
                    </FadeIn>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="mt-auto p-4 border-t bg-background/95 backdrop-blur-sm sticky bottom-0">
                  <div className="relative">
                    <Input
                      placeholder="اسأل أبو محمد..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="pr-12 pl-4 h-12 text-base rounded-full border-2 border-border focus-visible:border-primary transition-colors duration-200 bg-background shadow-sm"
                      disabled={isLoading}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
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
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 scale-100 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
                            disabled={isLoading || !input.trim()}
                          >
                            <Send size={16} />
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
