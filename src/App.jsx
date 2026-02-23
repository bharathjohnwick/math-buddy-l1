import React, { useState, useEffect, useRef } from 'react';
import { 
  Star, 
  ArrowRight, 
  Calculator, 
  Smile, 
  CheckCircle, 
  Sparkles,
  Camera,     
  Keyboard,   
  MousePointer, 
  Delete,
  Monitor,
  Check,
  RotateCcw
} from 'lucide-react';

// ==========================================
// SECTION 1: MAIN APP COMPONENT
// ==========================================

export default function App() {
  const [score, setScore] = useState(0);             
  const [currentPage, setCurrentPage] = useState('welcome'); 
  const [flash, setFlash] = useState(false);         

  const updateScore = (newPoints) => {
    setScore(score + newPoints);
  };

  const handleScreenCapture = () => {
    setFlash(true);
    setTimeout(() => {
      setFlash(false);
      window.print(); 
    }, 300);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'welcome': 
        return <WelcomePage onStart={() => setCurrentPage('page1')} />;
      case 'page1': 
        return <LevelOne 
                 onCorrect={() => updateScore(10)} 
                 onRestart={() => {
                   setScore(0);
                   setCurrentPage('welcome');
                 }} 
               />;
      default: 
        return <WelcomePage onStart={() => setCurrentPage('page1')} />;
    }
  };

  return (
    <div className="app-container">
      {/* =========================================
        GLOBAL STYLESHEET (NO TAILWIND REQUIRED)
        =========================================
      */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { width: 100%; min-height: 100vh; margin: 0; padding: 0; }
        #root { max-width: none !important; text-align: left !important; }
        body { font-family: system-ui, -apple-system, sans-serif; background-color: #f8fafc; color: #1e293b; }
        
        .app-container { min-height: 100vh; display: flex; flex-direction: column; position: relative; width: 100%; }
        
        .flash-overlay { position: fixed; inset: 0; background: white; z-index: 100; pointer-events: none; opacity: 0; transition: opacity 0.2s; }
        .flash-overlay.active { opacity: 1; }

        .app-header { background: #ffffff; border-bottom: 4px solid #e0e7ff; position: sticky; top: 0; z-index: 50; box-shadow: 0 1px 3px rgba(0,0,0,0.05); width: 100%; display: flex; justify-content: center; }
        .header-inner { max-width: 900px; width: 100%; padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; }
        
        .header-left { display: flex; align-items: center; gap: 0.75rem; }
        .logo-box { background: #4f46e5; color: white; padding: 0.5rem; border-radius: 0.75rem; display: flex; }
        .app-title { font-size: 1.25rem; font-weight: bold; color: #312e81; }
        .app-subtitle { font-size: 0.65rem; color: #818cf8; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; display: block; }
        
        .header-right { display: flex; align-items: center; gap: 1rem; }
        .btn-capture { display: flex; align-items: center; gap: 0.5rem; background: #f1f5f9; border: 2px solid #e2e8f0; padding: 0.5rem 1rem; border-radius: 9999px; font-weight: 600; color: #475569; cursor: pointer; transition: background 0.2s; }
        .btn-capture:hover { background: #e2e8f0; }
        .score-badge { display: flex; align-items: center; gap: 0.5rem; background: #fef9c3; border: 2px solid #fde047; padding: 0.5rem 1rem; border-radius: 9999px; font-weight: bold; color: #ca8a04; }

        .main-content { max-width: 900px; margin: 0 auto; padding: 2rem 1rem; flex: 1; width: 100%; }

        /* Welcome Page Styles */
        .welcome-page { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 4rem 1rem; gap: 2rem; animation: fadeIn 0.5s ease-out; }
        .hero-title { font-size: 3.5rem; font-weight: 900; color: #312e81; line-height: 1.2; }
        .hero-title span { background: linear-gradient(to right, #4f46e5, #9333ea); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .features-badge { display: inline-flex; gap: 1.5rem; background: #ffffff; padding: 0.75rem 1.5rem; border-radius: 9999px; border: 1px solid #e2e8f0; color: #64748b; font-size: 0.875rem; justify-content: center; flex-wrap: wrap; }
        .feature-item { display: flex; align-items: center; gap: 0.35rem; }
        .welcome-text { font-size: 1.125rem; color: #475569; line-height: 1.6; max-width: 400px; margin: 0 auto; }
        .btn-start { display: inline-flex; align-items: center; gap: 0.5rem; background: #4f46e5; color: white; border: none; padding: 1rem 2.5rem; border-radius: 1rem; font-size: 1.25rem; font-weight: bold; cursor: pointer; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3); transition: transform 0.1s; }
        .btn-start:active { transform: scale(0.95); }

        /* Level One Styles */
        .level-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .level-title { font-size: 1.5rem; font-weight: bold; color: #312e81; display: flex; align-items: center; gap: 0.5rem; }
        .btn-reset { display: flex; align-items: center; gap: 0.5rem; background: #e2e8f0; color: #475569; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: bold; cursor: pointer; transition: background 0.2s; }
        .btn-reset:hover { background: #cbd5e1; }

        .ops-tabs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
        .tab-btn { background: #ffffff; border: 1px solid #e2e8f0; border-bottom: 4px solid #e2e8f0; padding: 1rem; border-radius: 1rem; cursor: pointer; color: #64748b; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; }
        .tab-btn.active { background: #4f46e5; border-color: #4338ca; border-bottom-width: 2px; transform: translateY(2px); color: white; }
        .tab-icon { font-size: 1.5rem; font-weight: bold; margin-bottom: 0.25rem; }
        .tab-label { font-size: 0.65rem; text-transform: uppercase; font-weight: bold; letter-spacing: 0.05em; }

        .game-card { background: #ffffff; border-radius: 1.5rem; padding: 2.5rem 2rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); border: 2px solid #f1f5f9; display: flex; flex-direction: column; align-items: center; gap: 2.5rem; position: relative; }
        .typing-badge { position: absolute; top: 1rem; right: 1rem; font-size: 0.75rem; color: #94a3b8; display: flex; align-items: center; gap: 0.25rem; }

        .equation-area { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 1.25rem; font-size: 3.5rem; font-weight: 900; color: #334155; }
        .num-box { width: 5.5rem; height: 5.5rem; background: #e0e7ff; color: #4f46e5; border: 2px solid #c7d2fe; border-radius: 1.25rem; display: flex; justify-content: center; align-items: center; }
        .operator { color: #cbd5e1; font-weight: 300; }
        
        .input-wrapper { position: relative; display: flex; justify-content: center; }
        
        /* THE FIX FOR THE UGLY NUMBER SPINNERS */
        .eq-input { width: 6.5rem; height: 6.5rem; text-align: center; font-size: 3.5rem; font-weight: 900; background: #ffffff; border: 4px solid #c7d2fe; border-radius: 1.25rem; color: #312e81; outline: none; transition: border-color 0.2s; -moz-appearance: textfield; appearance: textfield; }
        .eq-input::-webkit-outer-spin-button, .eq-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .eq-input:focus { border-color: #4f46e5; }
        
        .btn-check { position: absolute; bottom: -1rem; background: #4f46e5; color: white; border: none; padding: 0.35rem 1.25rem; border-radius: 9999px; font-weight: bold; font-size: 0.875rem; display: flex; align-items: center; gap: 0.35rem; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); transition: transform 0.1s; }
        .btn-check:active { transform: scale(0.95); }

        .options-section { width: 100%; text-align: center; }
        .options-label { font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; font-weight: bold; margin-bottom: 0.75rem; letter-spacing: 0.05em; }
        .options-grid { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }
        .opt-btn { background: #fef9c3; color: #854d0e; border: none; border-bottom: 4px solid #fde047; padding: 1rem 1.5rem; border-radius: 1rem; font-size: 1.5rem; font-weight: bold; cursor: pointer; transition: transform 0.1s; min-width: 5.5rem; }
        .opt-btn:active { transform: translateY(2px); border-bottom-width: 2px; }

        .feedback-msg { padding: 0.5rem 1.5rem; border-radius: 9999px; font-weight: bold; font-size: 1.125rem; display: flex; align-items: center; gap: 0.5rem; animation: bounce 0.5s; }
        .feedback-msg.success { background: #dcfce7; color: #15803d; }
        .feedback-msg.error { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }

        .keypad-section { border-top: 1px solid #f1f5f9; padding-top: 1.5rem; width: 100%; max-width: 22rem; margin-top: 1rem; }
        .keypad-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
        .key-btn { background: #f8fafc; border: 1px solid #e2e8f0; padding: 1.25rem; border-radius: 0.75rem; font-size: 1.5rem; font-weight: bold; color: #475569; cursor: pointer; display: flex; justify-content: center; align-items: center; transition: all 0.1s; }
        .key-btn:active { background: #e0e7ff; border-color: #c7d2fe; transform: scale(0.95); }
        .key-btn.del { background: #fef2f2; color: #f87171; border-color: #fee2e2; }
        .key-btn.go { background: #10b981; color: white; border-color: #059669; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15%); } }
        
        @media print { .print-hide { display: none !important; } .app-container { background: white; } }
        @media (max-width: 600px) {
          .equation-area { font-size: 2.5rem; gap: 0.75rem; }
          .num-box, .eq-input { width: 4.5rem; height: 4.5rem; font-size: 2.5rem; }
          .ops-tabs { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      {/* Flash Overlay Effect */}
      <div className={`flash-overlay print-hide ${flash ? 'active' : ''}`} />

      {/* Application Header */}
      <header className="app-header print-hide">
        <div className="header-inner">
          <div className="header-left">
            <div className="logo-box">
              <Smile size={24} />
            </div>
            <div>
              <div className="app-title">Math Buddy</div>
              <span className="app-subtitle">Basic Operations</span>
            </div>
          </div>
          
          <div className="header-right">
            <button onClick={handleScreenCapture} className="btn-capture" title="Save as PDF / Capture">
              <Camera size={18} />
              <span style={{display: window.innerWidth > 600 ? 'inline' : 'none'}}>Capture</span>
            </button>
            <div className="score-badge">
              <Star size={18} fill="currentColor" />
              <span>{score} Stars</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

// ==========================================
// SECTION 2: WELCOME PAGE COMPONENT
// ==========================================

const WelcomePage = ({ onStart }) => (
  <div className="welcome-page">
    <h2 className="hero-title">
      Let's Play <br/><span>With Math!</span>
    </h2>

    <div className="features-badge print-hide">
      <div className="feature-item"><MousePointer size={16} color="#4f46e5" /> Mouse</div>
      <div className="feature-item"><Keyboard size={16} color="#4f46e5" /> Keyboard</div>
      <div className="feature-item"><Camera size={16} color="#4f46e5" /> Capture</div>
    </div>

    <p className="welcome-text">
      A fun, safe space to learn numbers, and operations. 
      <br/>Collect stars and become a Math Wizard!
    </p>

    <button onClick={onStart} className="btn-start print-hide">
      Start Learning 
      <ArrowRight size={24} />
    </button>
  </div>
);

// ==========================================
// SECTION 3: BASIC OPERATIONS (LEVEL 1)
// ==========================================

const LevelOne = ({ onCorrect, onRestart }) => {
  const [mode, setMode] = useState('add');
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const generateProblem = React.useCallback(() => {
    setMessage('');
    setIsCorrect(null);
    setInputValue(''); 
    
    let n1, n2, ans;
    n1 = Math.floor(Math.random() * 9) + 1; 
    n2 = Math.floor(Math.random() * 9) + 1;

    switch (mode) {
      case 'add': ans = n1 + n2; break;
      case 'sub': n1 = Math.max(n1, n2); n2 = Math.min(n1, n2); ans = n1 - n2; break;
      case 'mul': n1 = Math.floor(Math.random() * 5) + 1; ans = n1 * n2; break;
      case 'div': n2 = Math.floor(Math.random() * 4) + 2; ans = Math.floor(Math.random() * 5) + 1; n1 = n2 * ans; break;
      default: ans = n1 + n2;
    }

    setNum1(n1); setNum2(n2);

    const wrong1 = Math.abs(ans - 1);
    const wrong2 = ans + 2;
    setOptions([ans, wrong1, wrong2].sort(() => Math.random() - 0.5));
    
    if(inputRef.current) inputRef.current.focus();
  }, [mode]);

  useEffect(() => { generateProblem(); }, [generateProblem]);

  const handleInputSubmit = (e) => {
    e.preventDefault();
    const val = parseInt(inputValue);
    if (!isNaN(val)) checkAnswer(val);
  };

  const handleKeypadClick = (key) => {
    if (key === 'del') {
      setInputValue(prev => prev.slice(0, -1));
    } else if (key === 'enter') {
      handleInputSubmit({ preventDefault: () => {} });
    } else {
      setInputValue(prev => prev + key);
    }
    if(inputRef.current) inputRef.current.focus();
  };

  const checkAnswer = (selected) => {
    let correctAns;
    if (mode === 'add') correctAns = num1 + num2;
    else if (mode === 'sub') correctAns = num1 - num2;
    else if (mode === 'mul') correctAns = num1 * num2;
    else if (mode === 'div') correctAns = num1 / num2;

    if (selected === correctAns) {
      setIsCorrect(true);
      setMessage('Great Job! 🎉');
      onCorrect(); 
      setTimeout(generateProblem, 1500); 
    } else {
      setIsCorrect(false);
      setMessage('Not quite! Try again.');
      setInputValue(''); 
    }
  };

  const getSymbol = () => {
    switch(mode) { 
      case 'add': return '+'; 
      case 'sub': return '-'; 
      case 'mul': return '×'; 
      case 'div': return '÷'; 
      default: return '+'; 
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      
      <div className="level-header print-hide">
        <h2 className="level-title">
          <Calculator size={24} color="#6366f1" /> Math Garden
        </h2>
        <button onClick={onRestart} className="btn-reset">
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <div className="ops-tabs print-hide">
        {[
          { id: 'add', label: 'Add', icon: '+' }, 
          { id: 'sub', label: 'Subtract', icon: '-' }, 
          { id: 'mul', label: 'Multiply', icon: '×' }, 
          { id: 'div', label: 'Divide', icon: '÷' }
        ].map((m) => (
          <button 
            key={m.id} 
            onClick={() => setMode(m.id)} 
            className={`tab-btn ${mode === m.id ? 'active' : ''}`}
          >
            <div className="tab-icon">{m.icon}</div>
            <div className="tab-label">{m.label}</div>
          </button>
        ))}
      </div>

      <div className="game-card">
        <div className="typing-badge print-hide">
          <Monitor size={14} /> Typing Enabled
        </div>

        <div className="equation-area">
          <div className="num-box">{num1}</div>
          <div className="operator">{getSymbol()}</div>
          <div className="num-box">{num2}</div>
          <div className="operator">=</div>
          
          <form onSubmit={handleInputSubmit} className="input-wrapper">
            <input 
              ref={inputRef}
              type="number" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="eq-input"
              placeholder="?"
            />
            {inputValue && (
              <button type="submit" className="btn-check">
                Check <Check size={14} />
              </button>
            )}
          </form>
        </div>

        <div className="options-section print-hide">
          <div className="options-label">Quick Select Options</div>
          <div className="options-grid">
            {options.map((opt, idx) => (
              <button key={idx} onClick={() => checkAnswer(opt)} className="opt-btn">
                {opt}
              </button>
            ))}
          </div>
        </div>

        {message && (
          <div className={`feedback-msg ${isCorrect ? 'success' : 'error'}`}>
            {isCorrect ? <CheckCircle size={20} /> : <Sparkles size={20} color="#60a5fa" />}
            {message}
          </div>
        )}

        <div className="keypad-section print-hide">
           <div className="options-label">On-Screen Keypad</div>
           <div className="keypad-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <button key={n} onClick={() => handleKeypadClick(n)} className="key-btn">{n}</button>
              ))}
              <button onClick={() => handleKeypadClick('del')} className="key-btn del"><Delete size={20} /></button>
              <button onClick={() => handleKeypadClick(0)} className="key-btn">0</button>
              <button onClick={() => handleKeypadClick('enter')} className="key-btn go">Go</button>
           </div>
        </div>
      </div>
    </div>
  );
};