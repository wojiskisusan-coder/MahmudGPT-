// Browser native Text-to-Speech service - Enhanced with natural voice selection

let voicesLoaded = false;
let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): SpeechSynthesisVoice[] {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    cachedVoices = voices;
    voicesLoaded = true;
  }
  return cachedVoices;
}

// Pre-load voices
if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices();
  window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
}

function selectBestVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = loadVoices();
  if (voices.length === 0) return null;

  const langPrefix = lang.split("-")[0];

  // Priority: Natural voices > local voices > any matching voice
  const natural = voices.find(v => v.lang.startsWith(langPrefix) && v.name.includes("Natural"));
  if (natural) return natural;

  const google = voices.find(v => v.lang.startsWith(langPrefix) && v.name.includes("Google"));
  if (google) return google;

  const premium = voices.find(v => v.lang.startsWith(langPrefix) && (v.name.includes("Premium") || v.name.includes("Enhanced")));
  if (premium) return premium;

  const local = voices.find(v => v.lang.startsWith(langPrefix) && v.localService);
  if (local) return local;

  const any = voices.find(v => v.lang.startsWith(langPrefix));
  if (any) return any;

  return voices[0];
}

export function speak(text: string, lang = "en-US"): SpeechSynthesisUtterance {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  const voice = selectBestVoice(lang);
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeaking() {
  window.speechSynthesis.cancel();
}

export function isSpeaking(): boolean {
  return window.speechSynthesis.speaking;
}
