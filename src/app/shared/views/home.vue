<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">{{ $t('home.hero.title') }}</h1>
        <p class="hero-subtitle">{{ $t('home.hero.subtitle') }}</p>
        <div class="hero-actions">
          <router-link to="/rentals" class="btn btn-primary">
            <span class="btn-icon">🔍</span>
            {{ $t('home.hero.cta') }}
          </router-link>
          <router-link to="/register" class="btn btn-secondary">
            <span class="btn-icon">🚗</span>
            {{ $t('home.hero.ctaOwner') }}
          </router-link>
        </div>
      </div>
      <div class="hero-image">
        <div class="car-illustration">🚗</div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="container">
        <h2 class="section-title">{{ $t('home.features.title') }}</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🛡️</div>
            <h3 class="feature-title">{{ $t('home.features.trust.title') }}</h3>
            <p class="feature-description">{{ $t('home.features.trust.description') }}</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💰</div>
            <h3 class="feature-title">{{ $t('home.features.flexible.title') }}</h3>
            <p class="feature-description">{{ $t('home.features.flexible.description') }}</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📞</div>
            <h3 class="feature-title">{{ $t('home.features.support.title') }}</h3>
            <p class="feature-description">{{ $t('home.features.support.description') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works">
      <div class="container">
        <h2 class="section-title">{{ $t('home.howItWorks.title') }}</h2>
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3 class="step-title">{{ $t('home.howItWorks.step1.title') }}</h3>
              <p class="step-description">{{ $t('home.howItWorks.step1.description') }}</p>
            </div>
            <div class="step-icon">🔍</div>
          </div>
          <div class="step-connector">→</div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3 class="step-title">{{ $t('home.howItWorks.step2.title') }}</h3>
              <p class="step-description">{{ $t('home.howItWorks.step2.description') }}</p>
            </div>
            <div class="step-icon">📝</div>
          </div>
          <div class="step-connector">→</div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3 class="step-title">{{ $t('home.howItWorks.step3.title') }}</h3>
              <p class="step-description">{{ $t('home.howItWorks.step3.description') }}</p>
            </div>
            <div class="step-icon">🎉</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">¿Listo para comenzar?</h2>
          <p class="cta-description">Únete a miles de usuarios que confían en MOVEO para sus necesidades de movilidad.</p>
          <router-link to="/rentals" class="btn btn-large">
            Explorar Vehículos Ahora
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// No additional logic needed for static home page
</script>

<style scoped>
/* Hero Section */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  min-height: 500px;
}

.hero-content {
  max-width: 600px;
  animation: fadeInUp 0.8s ease;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  line-height: 1.2;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.hero-subtitle {
  font-size: 1.25rem;
  margin: 0 0 2rem 0;
  opacity: 0.95;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-image {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeInRight 0.8s ease;
}

.car-illustration {
  font-size: 15rem;
  animation: float 3s ease-in-out infinite;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.05rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
}

.btn-large {
  padding: 1.25rem 2.5rem;
  font-size: 1.15rem;
}

.btn-icon {
  font-size: 1.3rem;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Section Title */
.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin: 0 0 3rem 0;
  color: #1a202c;
}

/* Features Section */
.features {
  padding: 5rem 0;
  background: #f7fafc;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.feature-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: #2d3748;
}

.feature-description {
  color: #718096;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
}

/* How It Works Section */
.how-it-works {
  padding: 5rem 0;
  background: white;
}

.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.step {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 16px;
  max-width: 280px;
  position: relative;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.step:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
}

.step-number {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  background: white;
  color: #667eea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.step-content {
  margin-top: 1rem;
}

.step-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
}

.step-description {
  font-size: 0.95rem;
  opacity: 0.9;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.step-icon {
  font-size: 3rem;
  text-align: center;
}

.step-connector {
  font-size: 2rem;
  color: #667eea;
  font-weight: 700;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 5rem 2rem;
}

.cta-content {
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
}

.cta-description {
  font-size: 1.2rem;
  margin: 0 0 2rem 0;
  opacity: 0.95;
  line-height: 1.6;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 3rem 1.5rem;
  }

  .hero-content {
    margin: 0 auto;
  }

  .hero-actions {
    justify-content: center;
  }

  .car-illustration {
    font-size: 10rem;
  }

  .steps {
    flex-direction: column;
  }

  .step-connector {
    transform: rotate(90deg);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .cta-title {
    font-size: 2rem;
  }

  .features,
  .how-it-works,
  .cta-section {
    padding: 3rem 0;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.75rem;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .car-illustration {
    font-size: 8rem;
  }
}
</style>
