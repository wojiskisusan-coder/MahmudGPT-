/**
 * Global Audio Controller - Singleton that prevents overlapping audio playback
 * and provides loading/playing state management.
 */
class AudioController {
  private currentAudio: HTMLAudioElement | null = null;
  private currentUrl: string | null = null;
  private listeners: Set<() => void> = new Set();
  
  private _isPlaying = false;
  private _isLoading = false;
  private _activeMessageId: string | null = null;

  get isPlaying() { return this._isPlaying; }
  get isLoading() { return this._isLoading; }
  get activeMessageId() { return this._activeMessageId; }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  /** Stop any current playback and clean up */
  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.removeAttribute('src');
      this.currentAudio.load();
      this.currentAudio = null;
    }
    if (this.currentUrl) {
      URL.revokeObjectURL(this.currentUrl);
      this.currentUrl = null;
    }
    this._isPlaying = false;
    this._isLoading = false;
    this._activeMessageId = null;
    this.notify();
  }

  /** Play audio from a blob, stopping any previous playback */
  async playBlob(blob: Blob, messageId?: string) {
    this.stop();
    this._activeMessageId = messageId || null;
    
    const url = URL.createObjectURL(blob);
    this.currentUrl = url;
    const audio = new Audio(url);
    this.currentAudio = audio;

    audio.onplay = () => { this._isPlaying = true; this._isLoading = false; this.notify(); };
    audio.onended = () => this.stop();
    audio.onerror = () => this.stop();
    audio.onpause = () => {
      if (this.currentAudio === audio) {
        this._isPlaying = false;
        this.notify();
      }
    };

    this._isPlaying = true;
    this.notify();
    await audio.play();
  }

  /** Set loading state for a specific message */
  setLoading(messageId: string) {
    this.stop();
    this._isLoading = true;
    this._activeMessageId = messageId;
    this.notify();
  }

  /** Check if currently active for a specific message */
  isActiveFor(messageId: string) {
    return this._activeMessageId === messageId;
  }
}

export const audioController = new AudioController();
