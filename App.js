import React, { useState, useEffect } from 'react';
import { LineChart, Calculator, Target, BookOpen, CheckCircle, XCircle, ArrowLeftRight, ClipboardCheck, Award, RefreshCw } from 'lucide-react';

// --- Utility Functions ---
const formatEquation = (a, b, c) => {
  let eq = '';
  if (a !== 0) {
    if (a === 1) eq += 'x²';
    else if (a === -1) eq += '-x²';
    else eq += `${a}x²`;
  }
  if (b !== 0) {
    if (b === 1) eq += eq ? ' + x' : 'x';
    else if (b === -1) eq += eq ? ' - x' : '-x';
    else if (b > 0) eq += eq ? ` + ${b}x` : `${b}x`;
    else eq += eq ? ` - ${Math.abs(b)}x` : `${b}x`;
  }
  if (c !== 0) {
    if (c > 0) eq += eq ? ` + ${c}` : `${c}`;
    else eq += eq ? ` - ${Math.abs(c)}` : `${c}`;
  }
  return eq || '0';
};

// --- Module 1: Parabola Explorer (Transformations) ---
const ParabolaExplorer = () => {
  const [a, setA] = useState(1);
  const [h, setH] = useState(0);
  const [k, setK] = useState(0);

  const width = 400;
  const height = 400;
  const scale = 20;
  const originX = width / 2;
  const originY = height / 2;

  const generatePath = () => {
    let path = '';
    for (let x = -10; x <= 10; x += 0.2) {
      const y = a * Math.pow(x - h, 2) + k;
      const svgX = originX + x * scale;
      const svgY = originY - y * scale;
      if (x === -10) path += `M ${svgX} ${svgY} `;
      else path += `L ${svgX} ${svgY} `;
    }
    return path;
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start animate-fade-in">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 w-full md:w-auto flex justify-center">
        <svg width={width} height={height} className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
          {[...Array(21)].map((_, i) => (
            <React.Fragment key={i}>
              <line x1={0} y1={i * scale} x2={width} y2={i * scale} stroke="#e2e8f0" strokeWidth="1" />
              <line x1={i * scale} y1={0} x2={i * scale} y2={height} stroke="#e2e8f0" strokeWidth="1" />
            </React.Fragment>
          ))}
          <line x1={0} y1={originY} x2={width} y2={originY} stroke="#94a3b8" strokeWidth="2" />
          <line x1={originX} y1={0} x2={originX} y2={height} stroke="#94a3b8" strokeWidth="2" />
          <line x1={originX + h * scale} y1={0} x2={originX + h * scale} y2={height} stroke="#f43f5e" strokeWidth="2" strokeDasharray="5,5" className="opacity-50" />
          <path d={generatePath()} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={originX + h * scale} cy={originY - k * scale} r="5" fill="#f43f5e" />
        </svg>
      </div>

      <div className="flex-1 space-y-6 w-full">
        <div className="bg-indigo-50 p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-2">Vertex Form Equation</h3>
          <div className="text-3xl font-serif text-indigo-900 font-bold">
            y = {a === 1 ? '' : a === -1 ? '-' : a}(x {h < 0 ? '+ ' + Math.abs(h) : h > 0 ? '- ' + h : ''})² {k < 0 ? '- ' + Math.abs(k) : k > 0 ? '+ ' + k : ''}
          </div>
        </div>

        <div className="space-y-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <label className="flex justify-between text-sm font-medium text-slate-700 mb-1">
              <span>Vertical Stretch/Shrink (a)</span>
              <span className="font-bold text-indigo-600">{a}</span>
            </label>
            <input type="range" min="-5" max="5" step="0.5" value={a} onChange={(e) => setA(parseFloat(e.target.value) || 0.1)} className="w-full accent-indigo-500" />
          </div>
          <div>
            <label className="flex justify-between text-sm font-medium text-slate-700 mb-1">
              <span>Horizontal Shift (h)</span>
              <span className="font-bold text-indigo-600">{h}</span>
            </label>
            <input type="range" min="-10" max="10" step="1" value={h} onChange={(e) => setH(parseInt(e.target.value))} className="w-full accent-indigo-500" />
          </div>
          <div>
            <label className="flex justify-between text-sm font-medium text-slate-700 mb-1">
              <span>Vertical Shift (k)</span>
              <span className="font-bold text-indigo-600">{k}</span>
            </label>
            <input type="range" min="-10" max="10" step="1" value={k} onChange={(e) => setK(parseInt(e.target.value))} className="w-full accent-indigo-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
            <h4 className="text-rose-600 font-semibold text-sm mb-1">Vertex</h4>
            <p className="text-2xl font-bold text-rose-900">({h}, {k})</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
            <h4 className="text-emerald-600 font-semibold text-sm mb-1">Axis of Symmetry</h4>
            <p className="text-2xl font-bold text-emerald-900">x = {h}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Module 2: Factoring Master ---
const FactoringMaster = () => {
  const [problem, setProblem] = useState({ b: 0, c: 0, r1: 0, r2: 0 });
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [status, setStatus] = useState('idle');

  const generateProblem = () => {
    let r1 = 0, r2 = 0;
    while (r1 === 0 || r2 === 0) {
      r1 = Math.floor(Math.random() * 17) - 8;
      r2 = Math.floor(Math.random() * 17) - 8;
    }
    setProblem({ b: r1 + r2, c: r1 * r2, r1, r2 });
    setInput1(''); setInput2(''); setStatus('idle');
  };

  useEffect(() => { generateProblem(); }, []);

  const checkAnswer = () => {
    const val1 = parseInt(input1), val2 = parseInt(input2);
    if ((val1 === problem.r1 && val2 === problem.r2) || (val1 === problem.r2 && val2 === problem.r1)) setStatus('correct');
    else setStatus('incorrect');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Factoring Trinomials (a=1)</h2>
        <p className="text-slate-500">Find two numbers that multiply to <span className="font-bold text-indigo-600">c</span> and add to <span className="font-bold text-emerald-600">b</span>.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center">
        <div className="text-4xl font-serif font-bold text-slate-800 mb-8">{formatEquation(1, problem.b, problem.c)}</div>

        <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-px bg-slate-200 absolute rotate-45"></div>
            <div className="w-full h-px bg-slate-200 absolute -rotate-45"></div>
          </div>
          <div className="absolute top-0 w-full text-center">
            <span className="text-sm font-semibold text-slate-400 uppercase">Multiply to (c)</span>
            <div className="text-3xl font-bold text-indigo-600">{problem.c}</div>
          </div>
          <div className="absolute bottom-0 w-full text-center">
            <div className="text-3xl font-bold text-emerald-600">{problem.b}</div>
            <span className="text-sm font-semibold text-slate-400 uppercase">Add to (b)</span>
          </div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <input type="number" value={input1} onChange={e => { setInput1(e.target.value); setStatus('idle'); }} className="w-16 h-16 text-center text-2xl font-bold border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0" placeholder="?" />
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <input type="number" value={input2} onChange={e => { setInput2(e.target.value); setStatus('idle'); }} className="w-16 h-16 text-center text-2xl font-bold border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0" placeholder="?" />
          </div>
        </div>

        <div className="flex justify-center items-center gap-4">
          <button onClick={checkAnswer} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-sm">Check Answer</button>
          <button onClick={generateProblem} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors">New Problem</button>
        </div>

        {status === 'correct' && (
          <div className="mt-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center gap-2 font-bold animate-bounce">
            <CheckCircle className="w-6 h-6" /> Awesome! Factored form: (x {problem.r1 < 0 ? '-' : '+'} {Math.abs(problem.r1)})(x {problem.r2 < 0 ? '-' : '+'} {Math.abs(problem.r2)})
          </div>
        )}
        {status === 'incorrect' && (
          <div className="mt-6 p-4 bg-rose-50 text-rose-700 rounded-xl flex items-center justify-center gap-2 font-bold">
            <XCircle className="w-6 h-6" /> Not quite. Check your math and try again.
          </div>
        )}
      </div>
    </div>
  );
};

// --- Module 3: Zero Product Trainer ---
const ZeroProductTrainer = () => {
  const [problem, setProblem] = useState({ r1: 0, r2: 0 });
  const [ans1, setAns1] = useState('');
  const [ans2, setAns2] = useState('');
  const [status, setStatus] = useState('idle');

  const generateProblem = () => {
    let r1 = Math.floor(Math.random() * 10) - 5;
    let r2 = Math.floor(Math.random() * 10) - 5;
    if (r1 === r2) r2 += 1;
    setProblem({ r1, r2 }); setAns1(''); setAns2(''); setStatus('idle');
  };

  useEffect(() => { generateProblem(); }, []);

  const checkZeros = () => {
    const v1 = parseInt(ans1), v2 = parseInt(ans2);
    if ((v1 === problem.r1 && v2 === problem.r2) || (v1 === problem.r2 && v2 === problem.r1)) setStatus('correct');
    else setStatus('incorrect');
  };

  const formatFactor = (root) => {
    if (root === 0) return 'x';
    if (root > 0) return `(x - ${root})`;
    return `(x + ${Math.abs(root)})`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Zero Product Property</h2>
        <p className="text-slate-500">If <span className="italic">a · b = 0</span>, then either <span className="italic">a = 0</span> or <span className="italic">b = 0</span>.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex flex-col items-center mb-8">
          <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Solve for x</div>
          <div className="text-4xl font-serif font-bold text-indigo-900 bg-indigo-50 px-8 py-4 rounded-2xl border border-indigo-100">
            {formatFactor(problem.r1)}{formatFactor(problem.r2)} = 0
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="text-center text-lg font-medium text-slate-600">{formatFactor(problem.r1)} = 0</div>
            <div className="flex items-center justify-center gap-3 text-xl">
              <span className="font-serif italic">x =</span>
              <input type="number" value={ans1} onChange={e => { setAns1(e.target.value); setStatus('idle'); }} className="w-24 px-4 py-2 text-center text-xl font-bold border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="text-center text-lg font-medium text-slate-600">{formatFactor(problem.r2)} = 0</div>
            <div className="flex items-center justify-center gap-3 text-xl">
              <span className="font-serif italic">x =</span>
              <input type="number" value={ans2} onChange={e => { setAns2(e.target.value); setStatus('idle'); }} className="w-24 px-4 py-2 text-center text-xl font-bold border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0" />
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-4">
          <button onClick={checkZeros} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-sm">Submit Zeros</button>
          <button onClick={generateProblem} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors">Next Problem</button>
        </div>

        {status === 'correct' && (
          <div className="mt-6 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl animate-fade-in">
            <h4 className="flex items-center gap-2 text-emerald-800 font-bold text-lg mb-2"><CheckCircle className="w-6 h-6" /> Exactly right!</h4>
            <p className="text-emerald-700">The x-intercepts (zeros) of this parabola are at <strong>({problem.r1}, 0)</strong> and <strong>({problem.r2}, 0)</strong>.</p>
          </div>
        )}
        {status === 'incorrect' && (
          <div className="mt-6 p-4 bg-rose-50 text-rose-700 rounded-xl flex items-center justify-center gap-2 font-bold">
            <XCircle className="w-6 h-6" /> Incorrect. Remember to use the opposite sign to make the factor zero!
          </div>
        )}
      </div>
    </div>
  );
};

// --- Module 4: Symmetry Solver ---
const SymmetrySolver = () => {
  const [problem, setProblem] = useState({ a: 1, b: 0, c: 0, h: 0, d: 0, r1: 0, r2: 0 });
  const [inputs, setInputs] = useState({ h: '', d: '', r1: '', r2: '' });
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');

  const generateProblem = () => {
    const h = Math.floor(Math.random() * 9) - 4;
    const d = Math.floor(Math.random() * 4) + 2;
    const a = 1, b = -2 * h, c = (h * h) - (d * d);
    setProblem({ a, b, c, h, d, r1: h - d, r2: h + d });
    setInputs({ h: '', d: '', r1: '', r2: '' }); setStep(1); setErrorMsg('');
  };

  useEffect(() => { generateProblem(); }, []);

  const handleCheck = () => {
    setErrorMsg('');
    if (step === 1) {
      if (parseInt(inputs.h) === problem.h) setStep(2);
      else setErrorMsg(`Check your math: h = -(${problem.b}) / 2(1)`);
    } else if (step === 2) {
      if (parseInt(inputs.d) === problem.d) setStep(3);
      else setErrorMsg(`Check your math: d = √(${problem.h}² - ${problem.c})`);
    } else if (step === 3) {
      const v1 = parseInt(inputs.r1), v2 = parseInt(inputs.r2);
      if ((v1 === problem.r1 && v2 === problem.r2) || (v1 === problem.r2 && v2 === problem.r1)) setStep(4);
      else setErrorMsg(`Incorrect zeros. Remember: x = h ± d`);
    }
  };

  const width = 350, height = 350, scale = 15;
  const originX = width / 2, originY = height * 0.7;

  const generateSymmetryPath = () => {
    let path = '';
    for (let x = -12; x <= 12; x += 0.5) {
      const y = problem.a * Math.pow(x, 2) + problem.b * x + problem.c;
      const svgX = originX + x * scale, svgY = originY - y * scale;
      if (x === -12) path += `M ${svgX} ${svgY} `;
      else path += `L ${svgX} ${svgY} `;
    }
    return path;
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start animate-fade-in">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 w-full md:w-auto flex justify-center">
        <svg width={width} height={height} className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
          <line x1={0} y1={originY} x2={width} y2={originY} stroke="#94a3b8" strokeWidth="2" />
          <line x1={originX} y1={0} x2={originX} y2={height} stroke="#94a3b8" strokeWidth="2" />
          {step > 1 && <line x1={originX + problem.h * scale} y1={0} x2={originX + problem.h * scale} y2={height} stroke="#f43f5e" strokeWidth="2" strokeDasharray="5,5" />}
          <path d={generateSymmetryPath()} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
          {step > 1 && <circle cx={originX + problem.h * scale} cy={originY - (problem.a * Math.pow(problem.h, 2) + problem.b * problem.h + problem.c) * scale} r="5" fill="#f43f5e" />}
          {step > 2 && (
            <g>
              <line x1={originX + problem.h * scale} y1={originY} x2={originX + problem.r2 * scale} y2={originY} stroke="#10b981" strokeWidth="3" />
              <line x1={originX + problem.h * scale} y1={originY} x2={originX + problem.r1 * scale} y2={originY} stroke="#10b981" strokeWidth="3" />
              <text x={originX + (problem.h + problem.d/2) * scale} y={originY - 10} fill="#059669" fontSize="14" fontWeight="bold">d = {problem.d}</text>
            </g>
          )}
          {step > 3 && (
            <g>
              <circle cx={originX + problem.r1 * scale} cy={originY} r="6" fill="#10b981" />
              <circle cx={originX + problem.r2 * scale} cy={originY} r="6" fill="#10b981" />
            </g>
          )}
        </svg>
      </div>

      <div className="flex-1 space-y-6 w-full">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Find the zeros for:</h3>
          <div className="text-3xl font-serif text-slate-800 font-bold">f(x) = {formatEquation(problem.a, problem.b, problem.c)}</div>
        </div>

        {[
          { s: 1, label: 'Step 1: Find Axis of Symmetry (h = -b/2a)', field: 'h', prefix: 'h =' },
          { s: 2, label: 'Step 2: Find Horizontal Distance (d = √(h² - c/a))', field: 'd', prefix: 'd =' },
        ].map(({ s, label, field, prefix }) => (
          <div key={s} className={`p-5 rounded-2xl border-2 transition-all ${step === s ? 'border-indigo-400 bg-indigo-50' : step < s ? 'border-slate-100 opacity-40' : 'border-slate-100 bg-white opacity-60'}`}>
            <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
            <div className="flex items-center gap-3">
              <span className="font-serif text-lg italic">{prefix}</span>
              <input type="number" disabled={step !== s} value={inputs[field]} onChange={e => setInputs({...inputs, [field]: e.target.value})} className="w-20 px-3 py-2 text-center font-bold border-2 rounded-lg focus:border-indigo-500 focus:ring-0 disabled:bg-transparent" />
              {step === s && <button onClick={handleCheck} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700">Check</button>}
              {step > s && <CheckCircle className="text-emerald-500 w-6 h-6" />}
            </div>
          </div>
        ))}

        <div className={`p-5 rounded-2xl border-2 transition-all ${step === 3 ? 'border-indigo-400 bg-indigo-50' : step < 3 ? 'border-slate-100 opacity-40' : 'border-slate-100 bg-emerald-50'}`}>
          <label className="block text-sm font-bold text-slate-700 mb-2">Step 3: Calculate Zeros (x = h ± d)</label>
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg italic">x =</span>
            <input type="number" disabled={step !== 3} value={inputs.r1} onChange={e => setInputs({...inputs, r1: e.target.value})} className="w-20 px-3 py-2 text-center font-bold border-2 rounded-lg focus:border-indigo-500 focus:ring-0 disabled:bg-transparent" />
            <span className="font-serif text-lg font-bold mx-1">,</span>
            <input type="number" disabled={step !== 3} value={inputs.r2} onChange={e => setInputs({...inputs, r2: e.target.value})} className="w-20 px-3 py-2 text-center font-bold border-2 rounded-lg focus:border-indigo-500 focus:ring-0 disabled:bg-transparent" />
            {step === 3 && <button onClick={handleCheck} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700">Solve!</button>}
            {step > 3 && <CheckCircle className="text-emerald-500 w-6 h-6" />}
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 text-rose-700 rounded-xl flex items-center gap-2 font-bold text-sm">
            <XCircle className="w-5 h-5" /> {errorMsg}
          </div>
        )}
        {step === 4 && (
          <div className="p-4 bg-emerald-100 text-emerald-800 rounded-xl font-bold flex justify-between items-center">
            <span>Great job!</span>
            <button onClick={generateProblem} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">Next Problem</button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Module 5: Practice Test ---
const PracticeTest = () => {
  const [questions, setQuestions] = useState([]);
  const [status, setStatus] = useState('start');
  const [score, setScore] = useState(0);

  const generateTest = () => {
    const newQs = [];

    let h1 = 0, k1 = 0;
    while (h1 === 0 || k1 === 0) { h1 = Math.floor(Math.random() * 11) - 5; k1 = Math.floor(Math.random() * 11) - 5; }
    newQs.push({ id: 1, topic: 'Transformations & Vertex Form', q: `Identify the vertex of the parabola: y = (x ${h1 < 0 ? '+ ' + Math.abs(h1) : '- ' + h1})² ${k1 < 0 ? '- ' + Math.abs(k1) : '+ ' + k1}`, type: 'vertex', ansH: h1, ansK: k1, userH: '', userK: '', feedback: `The vertex form is y = a(x - h)² + k. The vertex is (h, k). Remember the x-coordinate has the opposite sign of what is inside the parentheses! Correct answer: (${h1}, ${k1})` });

    let f1 = 0, f2 = 0;
    while (f1 === 0 || f2 === 0 || (f1 + f2 === 0)) { f1 = Math.floor(Math.random() * 9) - 4; f2 = Math.floor(Math.random() * 9) - 4; }
    newQs.push({ id: 2, topic: 'Factoring Trinomials', q: `Find the two values that complete the factored form of: f(x) = ${formatEquation(1, f1 + f2, f1 * f2)}`, hint: '(Enter negative values if the factor uses subtraction)', type: 'factor', ans1: f1, ans2: f2, user1: '', user2: '', feedback: `You need two numbers that multiply to ${f1 * f2} and add to ${f1 + f2}. Those numbers are ${f1} and ${f2}.` });

    let z1 = 0, z2 = 0;
    while (z1 === 0 || z2 === 0 || z1 === z2) { z1 = Math.floor(Math.random() * 9) - 4; z2 = Math.floor(Math.random() * 9) - 4; }
    const fmtFactor = (z) => z < 0 ? `(x + ${Math.abs(z)})` : `(x - ${z})`;
    newQs.push({ id: 3, topic: 'Zero Product Property', q: `Find the x-intercepts (zeros) of the function: f(x) = ${fmtFactor(z1)}${fmtFactor(z2)}`, type: 'roots', ans1: z1, ans2: z2, user1: '', user2: '', feedback: `Set each factor to zero to solve. The roots are x = ${z1} and x = ${z2}.` });

    let h4 = 0, d4 = 0;
    while (h4 === 0 || d4 === 0) { h4 = Math.floor(Math.random() * 9) - 4; d4 = Math.floor(Math.random() * 4) + 2; }
    newQs.push({ id: 4, topic: 'Symmetry Solver', q: `A parabola has an axis of symmetry at x = ${h4}. The horizontal distance from the axis of symmetry to the x-intercepts is ${d4}. What are the x-intercepts?`, type: 'roots', ans1: h4 - d4, ans2: h4 + d4, user1: '', user2: '', feedback: `The x-intercepts are equidistant from the axis of symmetry: ${h4} ± ${d4} = ${h4 - d4} and ${h4 + d4}.` });

    let h5 = 0;
    while (h5 === 0) { h5 = Math.floor(Math.random() * 7) - 3; }
    const b5 = -2 * h5, c5 = Math.floor(Math.random() * 11) - 5;
    newQs.push({ id: 5, topic: 'Axis of Symmetry Formula', q: `Find the axis of symmetry for the quadratic: y = ${formatEquation(1, b5, c5)}`, type: 'aos', ansX: h5, userX: '', feedback: `The formula is x = -b / (2a). Here, a = 1 and b = ${b5}. x = -(${b5}) / 2(1) = ${h5}.` });

    let a6 = Math.floor(Math.random() * 4) + 2, f6_1 = 0, f6_2 = 0;
    while (f6_1 === 0 || f6_2 === 0 || (f6_1 + f6_2 === 0)) { f6_1 = Math.floor(Math.random() * 9) - 4; f6_2 = Math.floor(Math.random() * 9) - 4; }
    newQs.push({ id: 6, topic: 'Challenge: Factoring with a GCF', q: `Factor completely by first factoring out the GCF: f(x) = ${formatEquation(a6, a6 * (f6_1 + f6_2), a6 * (f6_1 * f6_2))}`, hint: '(Enter negative values if the factor uses subtraction)', type: 'factorGcf', ansA: a6, ans1: f6_1, ans2: f6_2, userA: '', user1: '', user2: '', feedback: `First factor out the GCF of ${a6}, then factor the remaining trinomial.` });

    let r7_1 = 0, r7_2 = 0;
    while (r7_1 === 0 || r7_2 === 0 || r7_1 === r7_2) { r7_1 = Math.floor(Math.random() * 7) - 3; r7_2 = Math.floor(Math.random() * 7) - 3; }
    newQs.push({ id: 7, topic: 'Challenge: Roots to Standard Form', q: `A parabola has x-intercepts at x = ${r7_1} and x = ${r7_2}. If a = 1, write its equation in standard form.`, hint: '(Enter negative values if the term involves subtraction)', type: 'standardFromRoots', ansB: -(r7_1 + r7_2), ansC: r7_1 * r7_2, userB: '', userC: '', feedback: `If roots are ${r7_1} and ${r7_2}, the factored form is (x ${r7_1 < 0 ? '+ ' + Math.abs(r7_1) : '- ' + r7_1})(x ${r7_2 < 0 ? '+ ' + Math.abs(r7_2) : '- ' + r7_2}). Multiply to get standard form: ${formatEquation(1, -(r7_1 + r7_2), r7_1 * r7_2)}.` });

    return newQs;
  };

  const handleStart = () => { setQuestions(generateTest()); setStatus('active'); setScore(0); };
  const handleInput = (id, field, value) => setQuestions(qs => qs.map(q => q.id === id ? { ...q, [field]: value } : q));

  const handleSubmit = () => {
    let numCorrect = 0;
    const graded = questions.map(q => {
      let isCorrect = false;
      if (q.type === 'vertex') isCorrect = parseInt(q.userH) === q.ansH && parseInt(q.userK) === q.ansK;
      else if (q.type === 'factor' || q.type === 'roots') { const u1 = parseInt(q.user1), u2 = parseInt(q.user2); isCorrect = (u1 === q.ans1 && u2 === q.ans2) || (u1 === q.ans2 && u2 === q.ans1); }
      else if (q.type === 'aos') isCorrect = parseInt(q.userX) === q.ansX;
      else if (q.type === 'factorGcf') { const uA = parseInt(q.userA), u1 = parseInt(q.user1), u2 = parseInt(q.user2); isCorrect = uA === q.ansA && ((u1 === q.ans1 && u2 === q.ans2) || (u1 === q.ans2 && u2 === q.ans1)); }
      else if (q.type === 'standardFromRoots') isCorrect = parseInt(q.userB) === q.ansB && parseInt(q.userC) === q.ansC;
      if (isCorrect) numCorrect++;
      return { ...q, isCorrect };
    });
    setQuestions(graded); setScore(numCorrect); setStatus('graded');
  };

  if (status === 'start') return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 text-center shadow-sm max-w-2xl mx-auto animate-fade-in">
      <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6"><ClipboardCheck className="w-10 h-10" /></div>
      <h2 className="text-3xl font-bold text-slate-800 mb-4">Unit 4 Mastery Test</h2>
      <p className="text-slate-500 mb-8 max-w-md">Ready to prove your skills? This test will generate 7 brand new questions covering transformations, factoring, the zero product property, symmetry, and two challenge concepts.</p>
      <button onClick={handleStart} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold rounded-xl shadow-md transition-transform transform hover:scale-105">Start Practice Test</button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {status === 'graded' && (
        <div className={`p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between shadow-sm border-2 ${score === 7 ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-6 mb-4 sm:mb-0">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${score === 7 ? 'bg-emerald-500 text-white' : 'bg-indigo-100 text-indigo-600'}`}><Award className="w-8 h-8" /></div>
            <div><h2 className="text-2xl font-bold text-slate-800">Test Completed</h2><p className="text-slate-500">You scored <strong className={`text-lg ${score === 7 ? 'text-emerald-600' : 'text-indigo-600'}`}>{score} out of 7</strong></p></div>
          </div>
          <button onClick={handleStart} className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"><RefreshCw className="w-5 h-5" /> Retake Test</button>
        </div>
      )}

      {questions.map((q, index) => (
        <div key={q.id} className={`p-6 bg-white rounded-2xl shadow-sm border-2 transition-colors duration-300 ${status === 'graded' ? (q.isCorrect ? 'border-emerald-400' : 'border-rose-400') : 'border-slate-100'}`}>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Question {index + 1}: {q.topic}</h3>
          <p className="text-lg font-medium text-slate-800 mb-1">{q.q}</p>
          {q.hint && <p className="text-sm text-slate-500 italic mb-5">{q.hint}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-lg">
            {q.type === 'vertex' && (<div className="flex items-center gap-2"><span className="font-serif">Vertex: (</span><input type="number" disabled={status === 'graded'} value={q.userH} onChange={e => handleInput(q.id, 'userH', e.target.value)} className="w-16 text-center border-b-2 border-slate-300 focus:border-indigo-500 bg-transparent disabled:opacity-75 focus:outline-none" /><span className="font-serif">,</span><input type="number" disabled={status === 'graded'} value={q.userK} onChange={e => handleInput(q.id, 'userK', e.target.value)} className="w-16 text-center border-b-2 border-slate-300 focus:border-indigo-500 bg-transparent disabled:opacity-75 focus:outline-none" /><span className="font-serif">)</span></div>)}
            {q.type === 'factor' && (<div className="flex items-center gap-2"><span className="font-serif">( x +</span><input type="number" disabled={status === 'graded'} value={q.user1} onChange={e => handleInput(q.id, 'user1', e.target.value)} className="w-16 text-center border-b-2 border-slate-300 focus:border-indigo-500 bg-transparent disabled:opacity-75 focus:outline-none" /><span className="font-serif">)( x +</span><input type="number" disabled={status === 'graded'} value={q.user2} onChange={e => handleInput(q.id, 'user2', e.target.value)} className="w-16 text-center border-b-2 border-slate-300 focus:border-indigo-500 bg-transparent disabled:opacity-75 focus:outline-none" /><span className="font-serif">)</span></div>)}
            {q.type === 'roots' && (<div className="flex items-center gap-4"><div className="flex items-center gap-2"><span className="font-serif">x = </span><input type="number" disabled={status === 'graded'} value={q.user1} onChange={e => handleInput(q.id, 'user1', e.target.value)} className="w-16 text-center border-b-2 border-slate-300 focus:border-indigo-500 bg-transparent disabled:opacity-75 focus:outline-none" /></div><span className="text-slate-400 font-bold">AND</span><div className="flex items-center gap-2"><span className="font-serif">x = </span><input type="number" disabled={status === 'graded'} value={q.user2} onChange={e => handleInput(q.id, 'user2', e.target.value)} className="w-16 text-center border-b-2 border-slate-300 focus:border-indigo-500 bg-transparent disabled:opacity-75 focus:outline-none" /></div></div>)}
            {q.type === 'aos' && (<div className="flex items-center gap-2"><span className="font-serif">x = </span><input type="number" disabled={status === 'graded'} value={q.userX} onChange={e => handleInput(q.id, 'userX', e.target.value)} className="w-20 text-center border-b-2 border-slate-300 focus:border-indigo-500 bg-transparent disabled:opacity-75 focus:outline-none" /></div>)}
            {q.type === 'factorGcf' && (<div className="flex items-center gap-2"><input type="number" disabled={status === 'graded'} value={q.userA} onChange={e => handleInput(q.id, 'userA', e.target.value)} className="w-16 text-center border-b-2 border-slate-300 focus:border-indigo-500 bg-transparent disabled:opacity-75 focus:outline-none" placeholder="GCF" /><span className="font-serif">( x +</span><input type="number" disabled={status === 'graded'} value={q.user1} onChange={e => handleInput(q.id, 'user1', e.target.value)} className="w-16 text-center border-b-2 border-slate-300 focus:border-indigo-500 bg-transparent disabled:opacity-75 focus:outline-none" /><span className="font-serif">)( x +</span><input type="number" disabled={status === 'graded'} value={q.user2} onChange={e => handleInput(q.id, 'user2', e.target.value)} className="w-16 text-center border-b-2 border-slate-300 focus:border-indigo-500 bg-transparent disabled:opacity-75 focus:outline-none" /><span className="font-serif">)</span></div>)}
            {q.type === 'standardFromRoots' && (<div className="flex items-center gap-2"><span className="font-serif">y = x² + </span><input type="number" disabled={status === 'graded'} value={q.userB} onChange={e => handleInput(q.id, 'userB', e.target.value)} className="w-16 text-center border-b-2 border-slate-300 focus:border-indigo-500 bg-transparent disabled:opacity-75 focus:outline-none" /><span className="font-serif">x + </span><input type="number" disabled={status === 'graded'} value={q.userC} onChange={e => handleInput(q.id, 'userC', e.target.value)} className="w-16 text-center border-b-2 border-slate-300 focus:border-indigo-500 bg-transparent disabled:opacity-75 focus:outline-none" /></div>)}
          </div>
          {status === 'graded' && (
            <div className={`mt-5 p-4 rounded-xl text-sm font-medium flex items-start gap-3 ${q.isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
              {q.isCorrect ? <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />}
              <div>{q.isCorrect ? "Correct!" : q.feedback}</div>
            </div>
          )}
        </div>
      ))}

      {status === 'active' && (
        <div className="flex justify-end pt-4 pb-10">
          <button onClick={handleSubmit} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center gap-2">
            <CheckCircle className="w-5 h-5" /> Submit Answers
          </button>
        </div>
      )}
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [activeTab, setActiveTab] = useState('explorer');

  const tabs = [
    { id: 'explorer', label: '1. Parabola Explorer', icon: LineChart, desc: 'Transformations' },
    { id: 'factoring', label: '2. Factoring Master', icon: Calculator, desc: 'Sum & Product' },
    { id: 'zeros', label: '3. Zero Product', icon: Target, desc: 'Find x-intercepts' },
    { id: 'symmetry', label: '4. Symmetry Solver', icon: ArrowLeftRight, desc: 'Use axis & distance' },
    { id: 'test', label: '5. Practice Test', icon: ClipboardCheck, desc: 'Assess Mastery' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-2 text-indigo-600">
            <BookOpen size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Unit 4: <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-500">Quadratic Functions</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">Interactive lessons covering transformations, factoring trinomials, and finding zeros.</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-200 ${isActive ? 'border-indigo-500 bg-white shadow-md transform -translate-y-1' : 'border-transparent bg-white shadow-sm hover:border-slate-300 hover:bg-slate-50'}`}>
                <Icon className={`w-7 h-7 mb-2 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className={`font-bold text-sm ${isActive ? 'text-indigo-900' : 'text-slate-600'}`}>{tab.label}</span>
                <span className="text-xs text-slate-500 mt-1 hidden sm:block">{tab.desc}</span>
              </button>
            );
          })}
        </div>

        <main className="min-h-[500px]">
          {activeTab === 'explorer' && <ParabolaExplorer />}
          {activeTab === 'factoring' && <FactoringMaster />}
          {activeTab === 'zeros' && <ZeroProductTrainer />}
          {activeTab === 'symmetry' && <SymmetrySolver />}
          {activeTab === 'test' && <PracticeTest />}
        </main>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
      `}} />
    </div>
  );
}
