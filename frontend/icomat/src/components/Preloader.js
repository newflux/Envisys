import gsap from 'gsap';

/**
 * Icomat Canvas Preloader Component
 * Reconstructs the exact alternating SVG path arcs animation and preloader fade-out
 */
export class IcomatPreloader {
  constructor(containerElement, onComplete) {
    this.container = containerElement;
    this.onComplete = onComplete;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    // The exact 7 curves of the Icomat mark (from smallest inner to outer arc)
    this.svgPaths = [
      "M21.8711 89.867C39.461 80.3294 64.0023 80.3218 81.5922 89.867L81.4113 90.4777C78.9986 89.784 76.5633 89.1809 74.1129 88.6757C59.4258 85.5241 44.045 85.5241 29.3579 88.6757C26.9075 89.1884 24.4723 89.7916 22.0596 90.4777L21.8786 89.867H21.8711Z",
      "M11.2578 79.9181C35.3167 65.246 68.1591 65.246 92.218 79.9181L91.9692 80.5062C88.7875 79.1943 85.5379 78.0332 82.2431 77.0455C62.512 71.0214 40.9714 71.0214 21.2327 77.0455C17.9379 78.0332 14.6883 79.1868 11.5066 80.5062L11.2578 79.9181Z",
      "M4.61274 69.2364C31.9965 50.4629 71.4588 50.4629 98.8426 69.2364L98.5486 69.8095C94.9296 67.9924 91.1974 66.394 87.39 65.0218C64.5978 56.6604 38.85 56.6604 16.0503 65.0218C12.2428 66.394 8.51825 67.9924 4.8917 69.8095L4.61274 69.2364H4.61274Z",
      "M0.827852 57.4856C29.9608 36.0204 73.5096 36.0204 102.643 57.4856L102.326 58.0436C98.4732 55.9023 94.4847 54.0174 90.3907 52.3889C65.887 42.4894 37.5758 42.4894 13.0722 52.3889C8.97816 54.0099 4.98971 55.9023 1.13698 58.0436L0.820312 57.4856H0.827852Z",
      "M0 44.1798C29.4949 22.0963 73.971 22.0963 103.466 44.1798L103.149 44.7377C99.2437 42.5286 95.2025 40.5683 91.0481 38.887C66.175 28.6331 37.2908 28.6331 12.4177 38.887C8.2634 40.5683 4.22217 42.5286 0.316663 44.7377L0 44.1798Z",
      "M3.58984 28.4147C31.4562 8.9399 72.0041 8.9399 99.878 28.4147L99.584 28.9801C95.8971 27.0802 92.0971 25.4064 88.2143 23.9663C64.9546 15.2053 38.5208 15.2053 15.2611 23.9663C11.3782 25.4064 7.57829 27.0802 3.89143 28.9801L3.59738 28.4147H3.58984Z",
      "M17.906 8.44246C37.9613 -2.81415 65.5034 -2.81415 85.5663 8.44246L85.3552 9.04563C82.6485 8.14842 79.9041 7.35676 77.1295 6.68574C60.5349 2.57666 42.9299 2.57666 26.3352 6.68574C23.5607 7.35676 20.8163 8.14088 18.1095 9.04563L17.8984 8.44246H17.906Z"
    ];

    this.pathObjects = [];
    this.arcItems = Array(7).fill(null).map(() => ({ progress: 0 }));
    this.tweens = [];
    this.animationFrameId = null;

    this.init();
  }

  init() {
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.display = 'block';
    this.container.appendChild(this.canvas);

    // Build 2D Path objects
    this.pathObjects = this.svgPaths.map(p => new Path2D(p));

    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Start render loop
    this.render();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = 104 * dpr;
    this.canvas.height = 91 * dpr;
    if (this.ctx) {
      this.ctx.scale(dpr, dpr);
    }
  }

  render() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, 104, 91);

    this.arcItems.forEach((item, index) => {
      if (item.progress > 0) {
        this.ctx.save();
        this.ctx.beginPath();
        // Alternating sweep direction:
        // Even indices reveal from left to right (0 to progress * 104)
        // Odd indices reveal from right to left (104 * (1 - progress) to progress * 104)
        if (index % 2 === 0) {
          this.ctx.rect(0, 0, 104 * item.progress, 91);
        } else {
          const startX = 104 * (1 - item.progress);
          this.ctx.rect(startX, 0, 104 * item.progress, 91);
        }
        this.ctx.clip();
        this.ctx.fillStyle = "#CFD9E0";
        this.ctx.fill(this.pathObjects[index]);
        this.ctx.restore();
      }
    });

    this.animationFrameId = requestAnimationFrame(() => this.render());
  }

  play() {
    // Reset progress
    this.arcItems.forEach(item => item.progress = 0);
    this.tweens.forEach(t => t.kill());
    this.tweens = [];

    // Staggered reveal timeline
    this.arcItems.forEach((item, i) => {
      const tween = gsap.to(item, {
        progress: 1,
        duration: 1.2,
        delay: 0.08 * i,
        ease: "power2.out"
      });
      this.tweens.push(tween);
    });

    // Complete timeline
    gsap.delayedCall(1.2 + 0.08 * 6 + 0.3, () => {
      if (this.onComplete) {
        this.onComplete();
      }
    });
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.tweens.forEach(t => t.kill());
  }
}
