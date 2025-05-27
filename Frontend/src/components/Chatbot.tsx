import React, { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you with HealthSphere?", sender: "bot" },
    { text: "You can ask me anything about HealthSphere. Here are some popular questions:", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);

  const allQuestions = [
    "What is HealthSphere?",
    "What services do you offer?",
    "How do I sign up?",
    "Is my data secure?",
    "Can I consult a doctor online?",
    "What diseases can your AI predict?",
    "How does symptom checking work?",
    "What types of doctors are available?",
    "How can I book an appointment?",
    "Do you support health insurance?",
    "Is HealthSphere free to use?",
    "Can I upload my medical reports?",
    "How do I track my medications?",
    "What makes HealthSphere different?",
    "How can doctors use HealthSphere?",
    "Can hospitals integrate with your system?",
    "Do you support multiple languages?",
    "How can I contact support?",
    "Is AI diagnosis accurate?",
    "How do I cancel appointments?"
  ];

  const responses = {
    "what is healthsphere": "HealthSphere is an AI-powered healthcare platform for disease prediction, doctor consultations, health tracking, and more.",
    "what services do you offer": "We offer AI-driven disease prediction, doctor consultations, medication tracking, fitness & nutrition planning, and medical image analysis.",
    "how do i sign up": "Click on 'Sign Up' at the top of the page and follow the instructions.",
    "is my data secure": "Absolutely! We prioritize your privacy and use encryption to keep your health data safe.",
    "can i consult a doctor online": "Yes! You can book a video consultation with certified doctors through HealthSphere.",
    "what diseases can your ai predict": "Our AI can predict diseases from Chest X-rays, Eye scans, Skin conditions, Cardiovascular issues, and even Mental Health analysis.",
    "what can this chatbot do": "I can answer questions about HealthSphere, guide you through features, and help you with website navigation!",
    "can i ask medical questions here": "I can provide general health information, but for medical advice, please consult a doctor through our platform.",
    "how do i turn off the chatbot": "Just click the X button in the top right corner or the chat icon to minimize.",
    "how can i book an appointment": "Go to the Appointments section, select your preferred doctor, choose an available time slot, and confirm your booking.",
    "what types of doctors are available": "We have general physicians, cardiologists, dermatologists, pediatricians, mental health experts, and more specialists.",
    "how do i cancel appointments": "Visit your dashboard, find the appointment you want to modify, and click 'Cancel' or 'Reschedule'.",
    "what diseases can healthsphere detect": "Our AI can detect various conditions through medical imaging, including eye diseases, skin conditions, and cardiovascular issues.",
    "how does symptom checking work": "Simply describe your symptoms, and our AI will analyze them to suggest possible conditions and recommend appropriate next steps.",
    "is ai diagnosis accurate": "Our AI provides preliminary insights with high accuracy, but all results should be confirmed by a healthcare professional.",
    "can i upload my medical reports": "Yes! You can securely upload medical reports and images for AI analysis and professional review.",
    "how do i track my medications": "Use our medication tracker to set reminders, log doses, and monitor your medication schedule.",
    "do you support health insurance": "Yes! We support insurance claims processing and can help you find suitable health insurance plans.",
    "how can doctors use healthsphere": "Doctors can manage appointments, access patient records, use AI diagnostics, and conduct video consultations.",
    "can hospitals integrate with your system": "Yes! We offer complete hospital management solutions including patient records, scheduling, and resource management.",
    "what makes healthsphere different": "We uniquely combine AI diagnostics, telemedicine, and health tracking in one secure, user-friendly platform.",
    "how can i contact support": "Email us at support@healthsphere.com or call our 24/7 helpline at 1-800-HEALTH.",
    "is healthsphere free to use": "Basic features are free. Premium services like AI diagnostics and specialist consultations have nominal fees.",
    "do you support multiple languages": "We currently support English, with more languages coming soon!",
    default: "I'm not sure about that. Try asking about our services, features, or how to use HealthSphere!"
  };

  // Function to shuffle array
  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Update suggestions every 30 seconds
  useEffect(() => {
    const updateSuggestions = () => {
      const shuffled = shuffleArray(allQuestions);
      setCurrentSuggestions(shuffled.slice(0, 8)); // Show 8 random questions
    };

    updateSuggestions(); // Initial suggestions
    const interval = setInterval(updateSuggestions, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (text = input) => {
    if (!text.trim()) return;
    
    const userMessage = { text, sender: "user" };
    
    // Find the closest matching question
    const userQuestion = text.toLowerCase().trim();
    let response = responses[userQuestion];
    
    // If no exact match, try to find a similar question
    if (!response) {
      const possibleMatches = Object.keys(responses).filter(key => 
        key !== "default" && (userQuestion.includes(key) || key.includes(userQuestion))
      );
      
      if (possibleMatches.length > 0) {
        response = responses[possibleMatches[0]];
      } else {
        response = responses.default;
      }
    }

    setMessages(prev => [...prev, userMessage]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { text: response, sender: "bot" }]);
      
      // Show new suggestions after bot response
      const shuffled = shuffleArray(allQuestions);
      setCurrentSuggestions(shuffled.slice(0, 8));
    }, 600);

    setInput("");
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end z-50">
      {isOpen ? (
        <div className="bg-white shadow-lg rounded-lg w-96 p-4 border border-gray-300">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-semibold">HealthSphere Assistant</h2>
            <button onClick={() => setIsOpen(false)} className="hover:bg-gray-100 p-1 rounded-full">
              <X size={20} />
            </button>
          </div>
          
          {/* Main chat area */}
          <div className="h-96 overflow-y-auto p-2 space-y-4 mb-2">
            {messages.map((msg, index) => (
              <div key={index} className={`p-2 rounded-lg max-w-[80%] ${
                msg.sender === "user" 
                  ? "bg-blue-500 text-white ml-auto" 
                  : "bg-gray-100 text-gray-800 mr-auto"
              }`}>
                {msg.text}
              </div>
            ))}
          </div>

          {/* Horizontal scrolling suggestions */}
          <div className="border-t border-b py-2 mb-2">
            <div className="overflow-x-auto whitespace-nowrap flex gap-2 pb-2" style={{ scrollbarWidth: 'thin' }}>
              {currentSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(suggestion)}
                  className="inline-block px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors whitespace-nowrap flex-shrink-0"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Input area */}
          <div className="flex items-center">
            <input
              type="text"
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button 
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              onClick={() => handleSendMessage()}
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)} 
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
};

export default Chatbot;