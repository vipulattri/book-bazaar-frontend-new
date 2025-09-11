"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";

export default function ChatAssistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<any>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const modelRef = useRef<any>(null);
  const morphTargetsRef = useRef<any[]>([]);
  const animationIdRef = useRef<number | null>(null);
  const visemeMapRef = useRef<{[key: number]: number}>({});

  // Welcome message on first load
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = { 
        role: "assistant", 
        content: "Welcome to BookBazaar AI! How can I help you today?" 
      };
      setMessages([welcomeMessage]);
      speak(welcomeMessage.content);
    }
  }, []);

  // Initialize 3D scene and model
  useEffect(() => {
    if (!canvasRef.current) return;

    const initThreeJS = async () => {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls");

      // Set up Three.js scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      camera.position.z = 2;
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      canvasRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);

      // Add orbit controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.enablePan = false;

      // Load 3D model with morph targets
      const loader = new GLTFLoader();
      loader.load(
        'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
        (gltf) => {
          const model = gltf.scene;
          model.scale.set(0.5, 0.5, 0.5);
          model.position.y = -0.5;
          scene.add(model);
          modelRef.current = model;

          // Get morph targets for expressions
          const mesh = model.children[0];
          if (mesh.morphTargetDictionary && mesh.morphTargetInfluences) {
            morphTargetsRef.current = mesh.morphTargetInfluences;
            
            // Viseme map for lip sync
            visemeMapRef.current = {
              0: mesh.morphTargetDictionary["viseme_sil"] || 0,  // Neutral
              1: mesh.morphTargetDictionary["viseme_PP"] || 1,   // A
              2: mesh.morphTargetDictionary["viseme_FF"] || 2,   // E
              3: mesh.morphTargetDictionary["viseme_I"] || 3,    // I
              4: mesh.morphTargetDictionary["viseme_O"] || 4,    // O
              5: mesh.morphTargetDictionary["viseme_U"] || 5,    // U
            };
          }

          // Start animation loop
          const animate = () => {
            animationIdRef.current = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
          };
          animate();

          // Handle window resize
          const handleResize = () => {
            camera.aspect = canvasRef.current!.clientWidth / canvasRef.current!.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvasRef.current!.clientWidth, canvasRef.current!.clientHeight);
          };
          window.addEventListener('resize', handleResize);

          return () => window.removeEventListener('resize', handleResize);
        },
        undefined,
        (error) => {
          console.error('Error loading 3D model:', error);
        }
      );
    };

    initThreeJS();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current && canvasRef.current && canvasRef.current.contains(rendererRef.current.domElement)) {
        canvasRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  // Emotional expressions
  const setExpression = (expression: string) => {
    if (!modelRef.current || !morphTargetsRef.current.length) return;
    
    const mesh = modelRef.current.children[0];
    if (!mesh.morphTargetDictionary) return;

    const targetIndex = mesh.morphTargetDictionary[expression];
    if (targetIndex === undefined) return;

    // Reset all expressions first
    gsap.to(morphTargetsRef.current, {
      duration: 0.3,
      ...Object.keys(mesh.morphTargetDictionary).reduce((acc, key) => {
        acc[mesh.morphTargetDictionary[key]] = 0;
        return acc;
      }, {} as Record<number, number>)
    });

    // Set the desired expression
    gsap.to(morphTargetsRef.current, {
      [targetIndex]: 1,
      duration: 0.3
    });
  };

  // Thumbs up animation
  const doThumbsUp = () => {
    setExpression("expression_joy");
    setTimeout(() => {
      setExpression("viseme_sil"); // Return to neutral
    }, 2000);
  };

  // Initialize speech synthesis and recognition
  useEffect(() => {
    // Speech Synthesis
    synthRef.current = window.speechSynthesis;

    // Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + ' ' + transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      // Cleanup speech synthesis
      if (synthRef.current?.speaking) {
        synthRef.current.cancel();
      }
      
      // Cleanup speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Simple fade-in animation on mount
  useEffect(() => {
    gsap.from(".chat-container", {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: "power2.out",
    });
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;
    
    // Cancel any ongoing speech
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    // Configure voice options
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes("Google") || voice.name.includes("English") || voice.name.includes("Hindi")
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Set thinking expression while preparing to speak
    setExpression("expression_sad");

    utterance.onstart = () => {
      setExpression("expression_smile");
    };

    // Lip sync animation based on speech
    utterance.onboundary = (event) => {
      if (event.name === 'word' && morphTargetsRef.current.length > 0) {
        const word = text.substring(event.charIndex, event.charIndex + event.charLength);
        const firstVowel = word.match(/[aeiou]/i)?.[0]?.toLowerCase();
        
        if (firstVowel) {
          let visemeIndex = 0;
          switch(firstVowel) {
            case 'a': visemeIndex = 1; break;
            case 'e': visemeIndex = 2; break;
            case 'i': visemeIndex = 3; break;
            case 'o': visemeIndex = 4; break;
            case 'u': visemeIndex = 5; break;
            default: visemeIndex = 0;
          }

          if (visemeMapRef.current[visemeIndex] !== undefined) {
            const targetIndex = visemeMapRef.current[visemeIndex];
            gsap.to(morphTargetsRef.current, {
              [targetIndex]: 1,
              duration: 0.1,
              onComplete: () => {
                gsap.to(morphTargetsRef.current, {
                  [targetIndex]: 0,
                  duration: 0.2,
                  delay: 0.1
                });
              }
            });
          }
        }
      }
    };

    utterance.onend = () => {
      setExpression("viseme_sil"); // Return to neutral
    };
    
    synthRef.current.speak(utterance);
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const sendMessage = async () => {
    const newMessage = input.trim();
    if (!newMessage) return;

    // Add user message
    const userMessage = { role: "user", content: newMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Set thinking expression
    setExpression("expression_sad");

    try {
      let aiReply = "";
      
      // Check for identity question
      if (newMessage.toLowerCase().includes("who are you") || 
          newMessage.toLowerCase().includes("what are you")) {
        aiReply = "I am BookBazaar AI, your virtual assistant for all things books! How can I help you today?";
      } else {
        const res = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyD7476rnu8j7VrIQjZvy3xBl6QnqK7Kj8s",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: newMessage }],
                },
              ],
            }),
          }
        );

        const data = await res.json();
        aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response from AI.";
      }

      setMessages((prev) => [...prev, { role: "assistant", content: aiReply }]);
      
      // Do thumbs up for certain responses
      if (aiReply.toLowerCase().includes("great") || 
          aiReply.toLowerCase().includes("welcome") ||
          aiReply.toLowerCase().includes("help you")) {
        doThumbsUp();
      }
      
      // Speak the AI's response
      speak(aiReply);
    } catch (err) {
      console.error("Fetch error", err);
      const errorMessage = "❌ Error communicating with BookBazaar AI.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMessage },
      ]);
      setExpression("expression_angry");
      speak(errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-white p-4 gap-4">
      {/* 3D Model Container */}
      <div className="w-full md:w-1/3 h-[40vh] md:h-[80vh] bg-gray-100 rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Chat Container */}
      <div
        ref={containerRef}
        className="chat-container w-full md:w-2/3 max-w-2xl h-[50vh] md:h-[80vh] flex flex-col bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
      >
        {/* Header */}
        <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 mr-4"></div>
            <h2 className="text-lg font-semibold text-gray-800">BookBazaar AI Assistant</h2>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                if (synthRef.current?.speaking) {
                  synthRef.current.cancel();
                }
              }}
              className="text-gray-500 hover:text-gray-700"
              title="Stop speech"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <rect x="9" y="9" width="6" height="6"></rect>
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-2xl mb-2">✨</div>
                <p>How can I help you today?</p>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800 border border-gray-200"}`}
                >
                  <div className="flex items-start">
                    {msg.role === "assistant" && (
                      <div className="w-6 h-6 rounded-full bg-purple-500 mr-2 flex-shrink-0"></div>
                    )}
                    <div>
                      {msg.role === "assistant" && (
                        <div className="text-xs font-medium text-purple-600 mb-1">BookBazaar AI</div>
                      )}
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 rounded-lg p-3 max-w-[80%] border border-gray-200">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-75"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="message-input w-full bg-white text-gray-800 rounded-lg p-3 pr-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 transition-all"
                placeholder="Message BookBazaar AI..."
                rows={1}
                style={{ minHeight: "44px", maxHeight: "120px" }}
              />
              <div className="absolute right-2 bottom-2 flex space-x-1">
                <button
                  onClick={toggleVoiceInput}
                  className={`p-1 rounded-md ${isListening ? "text-red-500 animate-pulse" : "text-gray-500 hover:text-gray-700"}`}
                  title={isListening ? "Listening..." : "Voice input"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className={`p-1 rounded-md ${input.trim() ? "text-blue-500 hover:text-blue-600" : "text-gray-400"}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            BookBazaar may produce inaccurate information about people, places, or facts.
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}