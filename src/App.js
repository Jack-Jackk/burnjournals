import './App.css';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';

// Using lightweight image tiles for the carousel for improved performance

function App() {
  const [showBetaModal, setShowBetaModal] = useState(false);
  
  // Memoize screenshot data for carousel
  const screenshots = useMemo(() => [
    { src: "/brand_kit/Burn-1-portrait.png", alt: "Burn Journal Burn 1" },
    { src: "/brand_kit/Burn-2-portrait.png", alt: "Burn Journal Burn 2" },
    { src: "/brand_kit/Burn-3-portrait.png", alt: "Burn Journal Burn 3" },
    { src: "/brand_kit/Burn-4-portrait.png", alt: "Burn Journal Burn 4" },
  ], []);

  // Optimized carousel component (renders a duplicated set of tiles and animates via requestAnimationFrame)
  const OptimizedCarousel = ({ items, speed = 0.03 }) => {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const rafRef = useRef(null);
    const lastTimeRef = useRef(null);
    const offsetRef = useRef(0);
    const pausedRef = useRef(false);
  const cycleWidthRef = useRef(0); // width of one full cycle (one original set * repeats)
  const [repeatCount, setRepeatCount] = useState(2);
    // measure widths after preload and keep updated with ResizeObserver
    useEffect(() => {
      let ro;
      let io;
      let cancelled = false;

      const preloadImages = async () => {
        const promises = items.map(it => new Promise((res) => {
          const img = new Image();
          img.src = it.src;
          img.onload = img.onerror = () => res();
        }));
        await Promise.all(promises);
        if (cancelled) return;

  const track = trackRef.current;
  const containerEl = containerRef.current;
        if (track) {
          // compute width of single original set by summing first `items.length` tiles
          const tiles = track.querySelectorAll('.carousel-tile');
          let originalWidth = 0;
          const gapPx = parseFloat(getComputedStyle(track).gap) || 0;
          if (tiles.length >= items.length) {
            for (let i = 0; i < items.length; i++) {
              originalWidth += tiles[i].offsetWidth;
              if (i < items.length - 1) originalWidth += gapPx;
            }
          } else {
            originalWidth = track.scrollWidth / 2; // fallback
          }

          // Determine how many original sets we need so when we render that set twice
          // the track covers the viewport without gaps. We aim for cycleWidth >= containerWidth + originalWidth
          const containerWidth = (containerEl && containerEl.clientWidth) || window.innerWidth;
          const desired = containerWidth + originalWidth;
          let repeats = 1;
          if (originalWidth > 0) repeats = Math.max(1, Math.ceil(desired / originalWidth));
          repeats = Math.max(2, repeats); // ensure at least 2 for natural looping
          setRepeatCount(repeats);

          cycleWidthRef.current = originalWidth * repeats;
        }

        // ResizeObserver to update measurement when layout changes
        if (typeof ResizeObserver !== 'undefined') {
          ro = new ResizeObserver(() => {
            const track2 = trackRef.current;
            if (track2) {
              const tiles2 = track2.querySelectorAll('.carousel-tile');
              let originalWidth2 = 0;
              const gapPx2 = parseFloat(getComputedStyle(track2).gap) || 0;
              if (tiles2.length >= items.length) {
                for (let i = 0; i < items.length; i++) {
                  originalWidth2 += tiles2[i].offsetWidth;
                  if (i < items.length - 1) originalWidth2 += gapPx2;
                }
              } else {
                originalWidth2 = track2.scrollWidth / 2;
              }
              const container2 = containerRef.current;
              const containerWidth2 = (container2 && container2.clientWidth) || window.innerWidth;
              const desired2 = containerWidth2 + originalWidth2;
              let repeats2 = 1;
              if (originalWidth2 > 0) repeats2 = Math.max(1, Math.ceil(desired2 / originalWidth2));
              repeats2 = Math.max(2, repeats2);
              setRepeatCount(repeats2);
              cycleWidthRef.current = originalWidth2 * repeats2;
            }
          });
          if (track) ro.observe(track);
        }

        // IntersectionObserver to pause when offscreen
        const containerObserve = containerRef.current;
        if (containerObserve && typeof IntersectionObserver !== 'undefined') {
          io = new IntersectionObserver(entries => {
            entries.forEach(entry => {
              pausedRef.current = !entry.isIntersecting;
            });
          }, { threshold: 0.05 });
          io.observe(containerObserve);
        }
      };

      preloadImages();

      return () => {
        cancelled = true;
        if (ro) ro.disconnect();
        if (io) io.disconnect();
      };
    }, [items]);

    useEffect(() => {
      const track = trackRef.current;
      if (!track) return;

      const step = (t) => {
        if (pausedRef.current) {
          lastTimeRef.current = t;
          rafRef.current = requestAnimationFrame(step);
          return;
        }
        if (lastTimeRef.current == null) lastTimeRef.current = t;
        const dt = t - lastTimeRef.current;
        lastTimeRef.current = t;

        // speed is px per ms; update offset
        const delta = speed * dt;
        offsetRef.current -= delta;

        // wrap using measured half width to avoid abrupt jumps
        const cycle = cycleWidthRef.current || (track.scrollWidth / 2);
        if (cycle > 0) {
          if (-offsetRef.current >= cycle) {
            offsetRef.current += Math.floor((-offsetRef.current) / cycle) * cycle;
          }
        }

        // apply transform with translate3d for GPU acceleration
        // Use a rounded value to avoid subpixel layout jitter on some devices
        track.style.transform = `translate3d(${Math.round(offsetRef.current)}px, 0, 0)`;

        rafRef.current = requestAnimationFrame(step);
      };

      rafRef.current = requestAnimationFrame(step);
      return () => cancelAnimationFrame(rafRef.current);
    }, [speed, items]);

    return (
      <div className="carousel-container" ref={containerRef} aria-hidden>
        <div className="carousel-track" ref={trackRef}>
          {Array.from({ length: repeatCount }).map((_, r) => (
            items.map((it, i) => (
              <div className="carousel-tile" key={`r${r}-c${i}`}>
                <img src={it.src} alt={it.alt} loading="lazy" decoding="async" width="280" height="560" />
              </div>
            ))
          ))}
          {/* render one more set to guarantee continuous coverage */}
          {items.map((it, i) => (
            <div className="carousel-tile" key={`extra-${i}`}>
              <img src={it.src} alt={it.alt} loading="lazy" decoding="async" width="280" height="560" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleContactSubmit = useCallback((e) => {
    e.preventDefault();
    
    // Get form elements directly for better compatibility
    const form = e.target;
    const name = form.elements.name.value;
    const email = form.elements.email.value;
    const subject = form.elements.subject.value;
    const message = form.elements.message.value;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      alert('Please fill in all fields before submitting.');
      return;
    }
    
    // Create mailto URL with form data
    const emailBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailtoUrl = `mailto:info@junepoint.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Try to open email client
    try {
      window.location.href = mailtoUrl;
    } catch (error) {
      // Fallback: copy email to clipboard and show instructions
      navigator.clipboard.writeText(`info@junepoint.com\n\nSubject: ${subject}\n\n${emailBody}`).then(() => {
        alert('Email details copied to clipboard! Please paste into your email client.');
      }).catch(() => {
        alert(`Please send an email to: info@junepoint.com\n\nSubject: ${subject}\n\n${emailBody}`);
      });
    }
  }, []);

  const handleBetaSubmit = useCallback((e) => {
    e.preventDefault();
    
    const form = e.target;
    const email = form.elements.email.value;
    const device = form.elements.device.value;
    const message = form.elements.message.value;
    
    // Validate required fields
    if (!email || !device || !message) {
      alert('Please fill in all fields before submitting.');
      return;
    }
    
    // Create mailto URL with beta signup data
    const subject = 'Android Beta Signup - Burn Journal';
    const emailBody = `Android Beta Signup Request\n\nEmail: ${email}\nDevice: ${device}\n\nWhy I want to join the beta:\n${message}`;
    const mailtoUrl = `mailto:info@junepoint.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Try to open email client
    try {
      window.location.href = mailtoUrl;
      // Close modal after submission
      setTimeout(() => setShowBetaModal(false), 500);
    } catch (error) {
      alert(`Please send your beta request to: info@junepoint.com\n\nSubject: ${subject}\n\n${emailBody}`);
    }
  }, []);

  return (
    <div className="App">
      {/* Animated Background */}
      <div className="app-background"></div>

      {/* Main Content */}
      <div className="content-wrapper">
        {/* Navigation */}
        <nav className="nav">
          <a href="#home" className="nav-logo">
            <img 
              src="/brand_kit/burn-journal-high-resolution-logo-transparent-pfp.png" 
              alt="Burn Journal Logo" 
              className="logo-img"
              fetchPriority="high"
              decoding="async"
              width="50"
              height="50"
            />
            <span className="stacked-logo">
              <span className="logo-line">Burn</span>
              <span className="logo-line">Journal</span>
            </span>
          </a>
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#download">Download</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>

        {/* Hero Section */}
        <section id="home" className="hero">
          <div className="hero-content">
            <div className="hero-badge">
              ✨ Therapeutic Journaling Reimagined
            </div>
            <h1>Write, Reflect, Let Go</h1>
            <p className="hero-subtitle">
              A therapeutic journaling app designed to help you process emotions, 
              track growth, and experience the cathartic power of letting go.
            </p>
            <div className="hero-cta">
              <a href="#download" className="btn btn-primary">
                Download Now
                <span>→</span>
              </a>
              <a href="#features" className="btn btn-secondary">
                Learn More
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features">
          <div className="section-header">
            <div className="section-badge">FEATURES</div>
            <h2>Everything You Need to Heal</h2>
            <p>
              Powerful journaling tools designed with your emotional wellness in mind. 
              Each feature is crafted to support your journey of self-discovery.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card fade-in">
              <span className="feature-icon">📝</span>
              <h3>Quick Notes</h3>
              <p>
                Write down your thoughts and feelings, then watch them scramble and burn away. 
                Experience instant emotional release with our unique burn animation.
              </p>
            </div>

            <div className="feature-card fade-in fade-in-delay-1">
              <span className="feature-icon">📖</span>
              <h3>Weekly Journal</h3>
              <p>
                7-day reflection journey with write-only format. Auto-pagination with 500 character 
                limit per page. Lock and burn entries at week's end for complete catharsis.
              </p>
            </div>

            <div className="feature-card fade-in fade-in-delay-2">
              <span className="feature-icon">📅</span>
              <h3>Monthly Journal</h3>
              <p>
                Calendar-view interface for the entire month. Daily entries with multi-page support. 
                Past days are locked and read-only. Track patterns and growth over time.
              </p>
            </div>

            <div className="feature-card fade-in">
              <span className="feature-icon">✅</span>
              <h3>Daily Tasks</h3>
              <p>
                Track your journaling progress with 3 main tasks and 2 bonus tasks. 
                Automatically marks tasks as completed and resets daily for fresh starts.
              </p>
            </div>

            <div className="feature-card fade-in fade-in-delay-1">
              <span className="feature-icon">🎨</span>
              <h3>Custom Themes (Coming Soon)</h3>
              <p>
                Personalize your journaling experience with fully interchangeable UI themes. 
                Complete visual facelifts to match your mood, style, and preferences.
              </p>
            </div>

            <div className="feature-card fade-in fade-in-delay-2">
              <span className="feature-icon">👥</span>
              <h3>Community (Coming Soon)</h3>
              <p>
                Share anonymized entries, participate in monthly burning ceremonies, 
                and experience collective healing in a safe, supportive environment.
              </p>
            </div>
          </div>
        </section>

        {/* iPhone Carousel Section */}
        <section className="carousel-section">
          <div className="section-header">
            <div className="section-badge">PREVIEW</div>
            <h2>See It In Action</h2>
            <p>
              Experience the beautiful interface and smooth interactions that make 
              journaling a truly therapeutic experience.
            </p>
          </div>
          {/* Optimized carousel rendering */}
          <div style={{ marginTop: '2.5rem' }}>
            <OptimizedCarousel items={screenshots} speed={0.03} />
          </div>
        </section>

        {/* CTA Section */}
        <section id="download" className="cta-section">
          <div className="cta-content">
            <h2>Ready to Start Your Journey?</h2>
            <p>
              Join thousands of users who have discovered the therapeutic power of 
              writing and letting go. Download Burn Journal today.
            </p>
            <div className="hero-cta">
              <a 
                href="https://apps.apple.com/us/app/burn-journal/id6753882779" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-white"
              >
                Download for iOS
                <span>📱</span>
              </a>
              <button 
                className="btn btn-white"
                onClick={() => setShowBetaModal(true)}
              >
                Download for Android
                <span>🤖</span>
              </button>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="contact-section">
          <div className="contact-content">
            <div className="section-header">
              <div className="section-badge">CONTACT</div>
              <h2>Get In Touch</h2>
              <p>
                Have questions, feedback, or need support? We'd love to hear from you. 
                Send us a message and we'll get back to you as soon as possible.
              </p>
            </div>
            
            <div className="contact-container">
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <div>
                    <h3>Email Us</h3>
                    <p>Send us your questions or feedback</p>
                    <a href="mailto:info@junepoint.com" className="contact-link">
                      info@junepoint.com
                    </a>
                  </div>
                </div>
                
                <div className="contact-item">
                  <span className="contact-icon">🕒</span>
                  <div>
                    <h3>Response Time</h3>
                    <p>We typically respond within 24-48 hours</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <span className="contact-icon">💬</span>
                  <div>
                    <h3>What We Help With</h3>
                    <p>Technical support, feature requests, general inquiries</p>
                  </div>
                </div>
              </div>
              
              <div className="contact-form-container">
                <form className="contact-form" onSubmit={handleContactSubmit}>
                  <div className="form-group">
                    <label htmlFor="contact-name">Name</label>
                    <input 
                      type="text" 
                      id="contact-name" 
                      name="name" 
                      required 
                      className="form-input"
                      placeholder="Your name"
                      autoComplete="name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="contact-email">Email</label>
                    <input 
                      type="email" 
                      id="contact-email" 
                      name="email" 
                      required 
                      className="form-input"
                      placeholder="your@email.com"
                      autoComplete="email"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="contact-subject">Subject</label>
                    <input 
                      type="text" 
                      id="contact-subject" 
                      name="subject" 
                      required 
                      className="form-input"
                      placeholder="What's this about?"
                      autoComplete="off"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="contact-message">Message</label>
                    <textarea 
                      id="contact-message" 
                      name="message" 
                      required 
                      className="form-textarea"
                      placeholder="Tell us what's on your mind..."
                      rows="6"
                      autoComplete="off"
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="btn btn-primary form-submit">
                    Send Message
                    <span>→</span>
                  </button>
                </form>
                
                <div className="contact-form-note">
                  <p>
                    <span className="note-icon">ℹ️</span>
                    Clicking "Send Message" will open your email client with a pre-filled message to info@junepoint.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <ul className="footer-links">
            <li><a href="/privacy_policy/privacy.html">Privacy Policy</a></li>
            <li><a href="/terms_of_service/terms.html">Terms of Service</a></li>
          </ul>
          <p>© 2025 Burn Journal. All rights reserved.</p>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
            A therapeutic journaling app focused on the cathartic experience of writing and letting go.
          </p>
        </footer>
      </div>

      {/* Android Beta Signup Modal */}
      {showBetaModal && (
        <div className="modal-overlay" onClick={() => setShowBetaModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowBetaModal(false)}>
              ✕
            </button>
            
            <div className="modal-header">
              <div className="section-badge">COMING SOON</div>
              <h2>Android Beta Program</h2>
              <p>
                Burn Journal for Android is currently in development. Sign up to be 
                considered for our beta testing program!
              </p>
            </div>

            <div className="beta-info-notice">
              <span className="info-icon">ℹ️</span>
              <p>
                <strong>Important:</strong> Beta spots are limited. Submitting this form 
                does not guarantee acceptance into the beta program. We'll review all 
                applications and contact selected testers via email.
              </p>
            </div>

            <form className="beta-form" onSubmit={handleBetaSubmit}>
              <div className="form-group">
                <label htmlFor="beta-email">Email Address *</label>
                <input 
                  type="email" 
                  id="beta-email" 
                  name="email" 
                  required 
                  className="form-input"
                  placeholder="your@email.com"
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="beta-device">Android Device *</label>
                <input 
                  type="text" 
                  id="beta-device" 
                  name="device" 
                  required 
                  className="form-input"
                  placeholder="e.g., Samsung Galaxy S23, Google Pixel 8"
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label htmlFor="beta-message">Why do you want to join the beta? *</label>
                <textarea 
                  id="beta-message" 
                  name="message" 
                  required 
                  className="form-textarea"
                  placeholder="Tell us why you're interested in testing Burn Journal on Android..."
                  rows="5"
                  autoComplete="off"
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowBetaModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Application
                  <span>→</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
