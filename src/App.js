import './App.css';

function App() {
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
            />
            <span className="stacked-logo">
              <span className="logo-line">Burn</span>
              <span className="logo-line">Journal</span>
            </span>
          </a>
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#download">Download</a></li>
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

          <div className="iphone-carousel">
            <div className="carousel-track">
              <div className="iphone-mockup">
                <div className="iphone-frame">
                  <div className="iphone-notch"></div>
                  <div className="iphone-screen">
                    <img 
                      src="/brand_kit/IMG_2828 (1).PNG" 
                      alt="Burn Journal App Screenshot 1"
                      className="screenshot"
                    />
                  </div>
                </div>
              </div>

              <div className="iphone-mockup">
                <div className="iphone-frame">
                  <div className="iphone-notch"></div>
                  <div className="iphone-screen">
                    <img 
                      src="/brand_kit/IMG_2829 (1).PNG" 
                      alt="Burn Journal App Screenshot 2"
                      className="screenshot"
                    />
                  </div>
                </div>
              </div>

              <div className="iphone-mockup">
                <div className="iphone-frame">
                  <div className="iphone-notch"></div>
                  <div className="iphone-screen">
                    <img 
                      src="/brand_kit/IMG_2830 (1).PNG" 
                      alt="Burn Journal App Screenshot 3"
                      className="screenshot"
                    />
                  </div>
                </div>
              </div>

              <div className="iphone-mockup">
                <div className="iphone-frame">
                  <div className="iphone-notch"></div>
                  <div className="iphone-screen">
                    <img 
                      src="/brand_kit/IMG_2831 (1).PNG" 
                      alt="Burn Journal App Screenshot 4"
                      className="screenshot"
                    />
                  </div>
                </div>
              </div>

              {/* Duplicate for infinite loop effect */}
              <div className="iphone-mockup">
                <div className="iphone-frame">
                  <div className="iphone-notch"></div>
                  <div className="iphone-screen">
                    <img 
                      src="/brand_kit/IMG_2828 (1).PNG" 
                      alt="Burn Journal App Screenshot 1"
                      className="screenshot"
                    />
                  </div>
                </div>
              </div>

              <div className="iphone-mockup">
                <div className="iphone-frame">
                  <div className="iphone-notch"></div>
                  <div className="iphone-screen">
                    <img 
                      src="/brand_kit/IMG_2829 (1).PNG" 
                      alt="Burn Journal App Screenshot 2"
                      className="screenshot"
                    />
                  </div>
                </div>
              </div>
            </div>
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
              <button className="btn btn-white">
                Download for iOS
                <span>📱</span>
              </button>
              <button className="btn btn-white">
                Download for Android
                <span>🤖</span>
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <ul className="footer-links">
            <li><a href="/privacy_policy/privacy.html">Privacy Policy</a></li>
            <li><a href="/terms_of_service/terms.html">Terms of Service</a></li>
            <li><a href="#support">Support</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <p>© 2025 Burn Journal. All rights reserved.</p>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
            A therapeutic journaling app focused on the cathartic experience of writing and letting go.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
