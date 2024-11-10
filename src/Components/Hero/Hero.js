import React from 'react';
import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Travel Together</h1>
        <p>Connect with travel enthusiasts and explore the world together!</p>
        <a href="#about" className="btn-primary">Learn More</a>
      </div>
    </section>
  );
}

export default Hero;
