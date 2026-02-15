export class SoundManager {
    private context: AudioContext;
    private enabled: boolean = true;

    constructor() {
        // Initialize AudioContext on user interaction (handled lazily or caught)
        const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
        this.context = new AudioContextClass();
    }

    private playTone(freq: number, type: OscillatorType, duration: number, startTime: number = 0) {
        if (!this.enabled) return;
        if (this.context.state === 'suspended') {
            this.context.resume();
        }

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.context.currentTime + startTime);

        gain.gain.setValueAtTime(0.1, this.context.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + startTime + duration);

        osc.connect(gain);
        gain.connect(this.context.destination);

        osc.start(this.context.currentTime + startTime);
        osc.stop(this.context.currentTime + startTime + duration);
    }

    playJump() {
        // Retro "Jump" - Rising tone
        if (!this.enabled) return;
        if (this.context.state === 'suspended') this.context.resume();

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(150, this.context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, this.context.currentTime + 0.1);

        gain.gain.setValueAtTime(0.1, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(this.context.destination);

        osc.start();
        osc.stop(this.context.currentTime + 0.1);
    }

    playDie() {
        // Retro "Die" - Falling low tone + noise (simulated with chaotic connection or just low saw)
        if (!this.enabled) return;
        if (this.context.state === 'suspended') this.context.resume();

        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, this.context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, this.context.currentTime + 0.5);

        gain.gain.setValueAtTime(0.2, this.context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(this.context.destination);

        osc.start();
        osc.stop(this.context.currentTime + 0.5);
    }

    playScore() {
        // "Checkpoint" - High double beep
        this.playTone(800, 'square', 0.1, 0);
        this.playTone(1200, 'square', 0.1, 0.15);
    }
}
