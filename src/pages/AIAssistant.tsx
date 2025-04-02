import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Send, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    // إضافة رسالة ترحيب عند تحميل الصفحة
    if (user?.name) {
      setMessages([
        {
          role: "assistant",
          content: `مرحباً ${user.name}، أنا مستشارك العقاري الذكي. كيف يمكنني مساعدتك اليوم؟ يمكنني تقديم المشورة حول:\n\n- التمويل العقاري\n- اختيار العقار المناسب\n- تحليل الأسعار\n- نصائح الاستثمار العقاري\n- وغيرها من المواضيع المتعلقة بالعقارات`
        }
      ]);
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Generate response based on user input
      let response = "";
      if (userMessage.toLowerCase().includes("مرحبا") || userMessage.toLowerCase().includes("اهلا")) {
        response = `مرحباً ${user?.name}، كيف يمكنني مساعدتك اليوم؟`;
      } else if (userMessage.toLowerCase().includes("شكرا")) {
        response = `على الرحب والسعة ${user?.name}، هل هناك أي شيء آخر يمكنني مساعدتك به؟`;
      } else {
        response = "أنا مستشارك العقاري الذكي. يمكنني مساعدتك في:\n\n- تقديم نصائح حول التمويل العقاري\n- تحليل الأسعار في مناطق مختلفة\n- تقديم إرشادات حول اختيار العقار المناسب\n- تقديم نصائح للاستثمار العقاري\n\nما هو سؤالك بالتحديد؟";
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "عذراً، حدث خطأ أثناء معالجة طلبك. الرجاء المحاولة مرة أخرى."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            المستشار العقاري الذكي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] rounded-md border p-4 mb-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.role === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                      <span className="font-medium">
                        {message.role === "user" ? "أنت" : "المستشار العقاري"}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب سؤالك هنا..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 