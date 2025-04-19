import { WebsiteGenerationResult } from "../client/src/lib/ai-service";
import { generateWebsiteWithAI, analyzeCanvaDesignWithAI } from "./openai-service";

/**
 * Generates a website based on a text prompt
 * Uses OpenAI GPT-4o to generate HTML, CSS, and JavaScript
 */
export async function generateWebsite(prompt: string): Promise<WebsiteGenerationResult> {
  try {
    // Use the OpenAI service to generate website
    return await generateWebsiteWithAI(prompt);
  } catch (error) {
    console.error("Error in generateWebsite:", error);
    
    // Fallback to template in case of API failure
    const title = prompt.split(" ").slice(0, 3).join(" ");
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body>
  <header>
    <nav>
      <div class="container">
        <h1>${title}</h1>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
    </nav>
  </header>
  
  <section id="home" class="hero">
    <div class="container">
      <h2>Welcome to ${title}</h2>
      <p>This website was generated with AI based on your prompt.</p>
      <a href="#contact" class="btn">Get Started</a>
    </div>
  </section>
  
  <section id="about" class="about">
    <div class="container">
      <h2>About Us</h2>
      <p>We are a company dedicated to providing the best services in the industry.</p>
      <div class="features">
        <div class="feature">
          <h3>Feature 1</h3>
          <p>Description of feature 1.</p>
        </div>
        <div class="feature">
          <h3>Feature 2</h3>
          <p>Description of feature 2.</p>
        </div>
        <div class="feature">
          <h3>Feature 3</h3>
          <p>Description of feature 3.</p>
        </div>
      </div>
    </div>
  </section>
  
  <section id="services" class="services">
    <div class="container">
      <h2>Our Services</h2>
      <div class="service-grid">
        <div class="service">
          <h3>Service 1</h3>
          <p>Description of service 1.</p>
        </div>
        <div class="service">
          <h3>Service 2</h3>
          <p>Description of service 2.</p>
        </div>
        <div class="service">
          <h3>Service 3</h3>
          <p>Description of service 3.</p>
        </div>
        <div class="service">
          <h3>Service 4</h3>
          <p>Description of service 4.</p>
        </div>
      </div>
    </div>
  </section>
  
  <section id="contact" class="contact">
    <div class="container">
      <h2>Contact Us</h2>
      <form>
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <textarea id="message" name="message" rows="5" required></textarea>
        </div>
        <button type="submit" class="btn">Send Message</button>
      </form>
    </div>
  </section>
  
  <footer>
    <div class="container">
      <p>&copy; 2023 ${title}. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>
    `;
    
    const css = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Navigation */
header {
  background-color: #3a86ff;
  color: white;
  padding: 1rem 0;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

nav .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

nav h1 {
  font-size: 1.5rem;
}

nav ul {
  display: flex;
  list-style: none;
}

nav ul li {
  margin-left: 1.5rem;
}

nav a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

nav a:hover {
  color: #f0f0f0;
}

/* Hero Section */
.hero {
  background: linear-gradient(to right, #3a86ff, #8338ec);
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.hero h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.btn {
  display: inline-block;
  background-color: white;
  color: #3a86ff;
  padding: 0.8rem 2rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  transition: transform 0.3s, box-shadow 0.3s;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* Sections */
section {
  padding: 4rem 0;
}

section h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

/* About Section */
.about {
  background-color: #f9f9f9;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.feature {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}

.feature:hover {
  transform: translateY(-10px);
}

.feature h3 {
  margin-bottom: 1rem;
  color: #3a86ff;
}

/* Services Section */
.service-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.service {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s;
}

.service:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.service h3 {
  margin-bottom: 1rem;
  color: #3a86ff;
}

/* Contact Section */
.contact {
  background-color: #f9f9f9;
}

form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

input,
textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #3a86ff;
}

button.btn {
  cursor: pointer;
  border: none;
  margin-top: 1rem;
}

/* Footer */
footer {
  background-color: #333;
  color: white;
  padding: 2rem 0;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  nav .container {
    flex-direction: column;
  }
  
  nav ul {
    margin-top: 1rem;
  }
  
  nav ul li {
    margin-left: 1rem;
    margin-right: 1rem;
  }
  
  .hero h2 {
    font-size: 2rem;
  }
  
  .hero p {
    font-size: 1rem;
  }
}
    `;
    
    const js = `
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Form submission
const form = document.querySelector('form');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Form submitted! In a real website, this would send the data to a server.');
  });
}

// Simple animation for features on scroll
window.addEventListener('scroll', function() {
  const features = document.querySelectorAll('.feature');
  features.forEach(feature => {
    const position = feature.getBoundingClientRect();
    
    // If element is in viewport
    if(position.top >= 0 && position.bottom <= window.innerHeight) {
      feature.style.opacity = 1;
      feature.style.transform = 'translateY(0)';
    }
  });
});

// Initialize features with opacity 0
document.addEventListener('DOMContentLoaded', function() {
  const features = document.querySelectorAll('.feature');
  features.forEach(feature => {
    feature.style.opacity = 0;
    feature.style.transform = 'translateY(20px)';
    feature.style.transition = 'opacity 0.5s, transform 0.5s';
  });
});
    `;
    
    return {
      html,
      css,
      js,
      preview: ""
    };
  }
}

/**
 * Analyzes a Canva design image and generates website code
 * Uses OpenAI Vision to analyze the design and generate code
 */
export async function analyzeCanvaDesign(imageData: string): Promise<WebsiteGenerationResult> {
  try {
    // Use the OpenAI service to analyze the design
    return await analyzeCanvaDesignWithAI(imageData);
  } catch (error) {
    console.error("Error in analyzeCanvaDesign:", error);
    
    // Fallback to template in case of API failure
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Canva Design Import</title>
</head>
<body>
  <header>
    <div class="container">
      <h1>Design Portfolio</h1>
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#portfolio">Portfolio</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <section id="home" class="hero">
    <div class="container">
      <div class="hero-content">
        <h2>Creative Design Solutions</h2>
        <p>Bringing your vision to life with stunning visuals</p>
        <a href="#portfolio" class="btn">View My Work</a>
      </div>
    </div>
  </section>

  <section id="portfolio" class="portfolio">
    <div class="container">
      <h2>Portfolio</h2>
      <div class="portfolio-grid">
        <div class="portfolio-item">
          <div class="portfolio-image image-placeholder"></div>
          <h3>Project One</h3>
          <p>Brand Identity</p>
        </div>
        <div class="portfolio-item">
          <div class="portfolio-image image-placeholder"></div>
          <h3>Project Two</h3>
          <p>Web Design</p>
        </div>
        <div class="portfolio-item">
          <div class="portfolio-image image-placeholder"></div>
          <h3>Project Three</h3>
          <p>Illustration</p>
        </div>
        <div class="portfolio-item">
          <div class="portfolio-image image-placeholder"></div>
          <h3>Project Four</h3>
          <p>Photography</p>
        </div>
      </div>
    </div>
  </section>

  <section id="about" class="about">
    <div class="container">
      <div class="about-content">
        <div class="about-image image-placeholder"></div>
        <div class="about-text">
          <h2>About Me</h2>
          <p>I'm a passionate designer with over 5 years of experience creating stunning visual solutions for clients worldwide. My approach combines creativity with strategic thinking to deliver results that exceed expectations.</p>
          <p>My skills include brand identity design, web design, illustration, and photography. I believe in the power of visual communication to transform businesses and create meaningful connections with audiences.</p>
          <a href="#contact" class="btn">Get in Touch</a>
        </div>
      </div>
    </div>
  </section>

  <section id="contact" class="contact">
    <div class="container">
      <h2>Contact Me</h2>
      <div class="contact-content">
        <form>
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="5" required></textarea>
          </div>
          <button type="submit" class="btn">Send Message</button>
        </form>
        <div class="contact-info">
          <h3>Let's Connect</h3>
          <p>I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.</p>
          <ul>
            <li>📧 hello@designportfolio.com</li>
            <li>📱 (123) 456-7890</li>
            <li>📍 New York, NY</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <footer>
    <div class="container">
      <p>&copy; 2023 Design Portfolio. All rights reserved.</p>
      <div class="social-links">
        <a href="#" class="social-link">Twitter</a>
        <a href="#" class="social-link">Instagram</a>
        <a href="#" class="social-link">Dribbble</a>
        <a href="#" class="social-link">LinkedIn</a>
      </div>
    </div>
  </footer>
</body>
</html>
    `;
    
    const css = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

a {
  text-decoration: none;
  color: inherit;
}

ul {
  list-style: none;
}

/* Placeholder for images */
.image-placeholder {
  background-color: #f0f0f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}

.image-placeholder::after {
  content: "Image";
}

/* Header */
header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 100;
}

header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

header h1 {
  font-size: 1.8rem;
  color: #333;
}

nav ul {
  display: flex;
}

nav ul li {
  margin-left: 2rem;
}

nav a {
  font-weight: 500;
  transition: color 0.3s;
}

nav a:hover {
  color: #ff006e;
}

/* Hero Section */
.hero {
  height: 100vh;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  text-align: center;
  padding-top: 80px;
}

.hero-content {
  max-width: 700px;
  margin: 0 auto;
}

.hero h2 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.btn {
  display: inline-block;
  background-color: #ff006e;
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 30px;
  font-weight: 500;
  transition: transform 0.3s, box-shadow 0.3s;
}

.btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* Portfolio Section */
.portfolio {
  padding: 100px 0;
  background-color: #f9f9f9;
}

.portfolio h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
}

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.portfolio-item {
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s;
}

.portfolio-item:hover {
  transform: translateY(-10px);
}

.portfolio-image {
  height: 200px;
  width: 100%;
}

.portfolio-item h3 {
  margin: 1.5rem 0 0.5rem 0;
  padding: 0 1.5rem;
}

.portfolio-item p {
  color: #666;
  padding: 0 1.5rem 1.5rem;
}

/* About Section */
.about {
  padding: 100px 0;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.about-image {
  height: 400px;
  border-radius: 10px;
}

.about h2 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.about p {
  margin-bottom: 1.5rem;
  color: #555;
}

/* Contact Section */
.contact {
  padding: 100px 0;
  background-color: #f9f9f9;
}

.contact h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input,
textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #764ba2;
}

.contact-info {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.contact-info h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.contact-info p {
  margin-bottom: 1.5rem;
  color: #555;
}

.contact-info ul {
  color: #555;
}

.contact-info ul li {
  margin-bottom: 0.5rem;
}

/* Footer */
footer {
  background-color: #333;
  color: white;
  padding: 3rem 0;
}

footer .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.social-links {
  display: flex;
  gap: 1.5rem;
}

.social-link {
  opacity: 0.8;
  transition: opacity 0.3s;
}

.social-link:hover {
  opacity: 1;
}

/* Responsive */
@media (max-width: 900px) {
  .hero h2 {
    font-size: 2.5rem;
  }
  
  .about-content,
  .contact-content {
    grid-template-columns: 1fr;
  }
  
  .about-image {
    margin-bottom: 2rem;
  }
}

@media (max-width: 600px) {
  header .container {
    flex-direction: column;
  }
  
  nav ul {
    margin-top: 1rem;
  }
  
  nav ul li {
    margin: 0 1rem;
  }
  
  .hero h2 {
    font-size: 2rem;
  }
  
  .hero p {
    font-size: 1.2rem;
  }
  
  footer .container {
    flex-direction: column;
    text-align: center;
  }
  
  .social-links {
    margin-top: 1.5rem;
  }
}
    `;
    
    const js = `
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Form submission
const form = document.querySelector('form');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Form submitted! In a real website, this would send the data to a server.');
  });
}

// Header scroll effect
const header = document.querySelector('header');
window.addEventListener('scroll', function() {
  if (window.scrollY > 100) {
    header.style.background = 'rgba(255, 255, 255, 0.95)';
    header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.background = 'white';
    header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
  }
});

// Animation for portfolio items
const portfolioItems = document.querySelectorAll('.portfolio-item');
window.addEventListener('scroll', function() {
  portfolioItems.forEach(item => {
    const position = item.getBoundingClientRect();
    
    // If element is in viewport
    if(position.top >= 0 && position.bottom <= window.innerHeight) {
      item.style.opacity = 1;
      item.style.transform = 'translateY(0)';
    }
  });
});

// Initialize animations
document.addEventListener('DOMContentLoaded', function() {
  // Set initial state for portfolio items
  portfolioItems.forEach(item => {
    item.style.opacity = 0;
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s, transform 0.6s';
  });
});
    `;
    
    return {
      html,
      css,
      js,
      preview: ""
    };
  }
}