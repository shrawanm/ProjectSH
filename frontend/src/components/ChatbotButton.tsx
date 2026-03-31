import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GROQ_API_KEY = "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"; 
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Namaste! Welcome to Shrawan Handicrafts How can I help you today?'
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  
  const handleChat = async () => {
    if (!input.trim() || loading) return;

    const userInput = input.trim();

    setMessages(prev => [...prev, { role: 'user', text: userInput }]);
    setInput('');
    setLoading(true);

    try {
      setStatusMsg('Searching inventory...');

      const dbResponse = await fetch(
        `http://localhost/ShrawanHandicraftsFYP/backend/api/get_products_chatbot.php?query=${encodeURIComponent(userInput)}`
      );

      const dbData = await dbResponse.json();

      setStatusMsg('Composing response...');

      const hasProducts = dbData.products && dbData.products.length > 0;

      const systemPrompt = `
You are a helpful sales assistant for Shrawan Handicrafts, a Nepali store selling pashmina, yak wool items, crafts, and paintings.
greet the  user if said hi or hello
STRICT RULES:
1. NO markdown or symbols (*, #, etc)
2. Plain clean text only
3. Keep responses short and structured
4. ONLY use DATABASE RESULTS
5. If EMPTY → say item not found and suggest categories
6. NEVER invent products


STRICT FORMATTING RULES:
1. NO MARKDOWN: Never use asterisks (**), hashes (#), or bold symbols. Plain text and line breaks only.
2. NO GREETING SPAM: Use 'Namaste' only once at the very start of a conversation, never again.
3. CONCISE: Keep responses short and friendly. Do not repeat information.

ANSWERING RULES:
4. ALWAYS use DATABASE RESULTS as your ONLY source for products.
5. CRITICAL: If DATABASE RESULTS is "EMPTY", you MUST NOT list, invent, or hallucinate any products! Just apologize, say the item is not found, and suggest categories from AVAILABLE COLLECTIONS.
6. If stock is 0 for an item, say "Out of stock", if the customer want the product which is out of stock, tell the customer that it is possible to get the product in stock and leave the contact information of the owner for futher communication. Do not share contact information of the owner if the customer is not interested in buying the product which is out of stock.
7. NEVER say "no specific products listed" if DATABASE RESULTS contains items.
8. If a product has no subcategory, just list it under its category name.
9. For specific products always mention: Name, Price (NPR), Material, Colors, Sizes, and Stock.
10. UNDER NO CIRCUMSTANCES should you invent product names, prices, or details. Only use exactly what is provided in DATABASE RESULTS.

STORE POLICIES:
- Payment: eSewa only.
- Reservation: Items can be held 48 hours for in-store pickup.
- Owner: Shrawan | Phone: 9840123456 | Location: Kathmandu
  (Share contact only when customer is ready to buy or specifically asks)

PRODUCT FORMAT:

<Name>
Price: NPR <price>
Material: <material>
Colors: <colors>
Sizes: <sizes>
Stock: <stock>

DATA:
DATABASE RESULTS: ${hasProducts ? JSON.stringify(dbData.products) : "EMPTY"}
AVAILABLE COLLECTIONS: ${JSON.stringify(dbData.store_map)}
      `.trim();

      const groqMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({
          role: m.role,
          content: m.text
        })),
        { role: 'user', content: userInput }
      ];

      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: groqMessages,
          temperature: 0.1,
          max_tokens: 800
        })
      });

      const data = await response.json();

      if (data.error) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', text: 'API error. Please check configuration.' }
        ]);
        return;
      }

      const botReply =
        data.choices?.[0]?.message?.content ||
        'No response generated.';

      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: botReply }
      ]);

    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          text: 'Connection error. Make sure XAMPP is running and backend is accessible.'
        }
      ]);
    } finally {
      setLoading(false);
      setStatusMsg('');
    }
  };


  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-accent text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
      >
        {isOpen ? <X /> : <MessageCircle />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-[350px] h-[500px] bg-bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* HEADER */}
            <div className="bg-accent text-white p-4 flex justify-between items-center">
              <h3 className="font-semibold">Customer Support</h3>
              <button onClick={() => setIsOpen(false)}>
                <X />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-bg-light flex flex-col gap-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.role === 'user'
                      ? 'self-end bg-accent text-white px-3 py-2 rounded-2xl text-sm max-w-[85%]'
                      : 'self-start bg-white text-gray-800 px-3 py-2 rounded-2xl border text-sm max-w-[85%] whitespace-pre-wrap'
                  }
                >
                  {m.text}
                </div>
              ))}

              {loading && (
                <div className="text-xs text-accent italic">
                  {statusMsg}
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            <div className="flex p-3 border-t bg-white">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                placeholder="Ask about products..."
                disabled={loading}
                className="flex-1 px-4 py-2 border rounded-full text-sm outline-none"
              />
              <button
                onClick={handleChat}
                disabled={loading}
                className="ml-2 bg-accent text-white px-4 rounded-full text-sm font-semibold"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}