/* ═══════════════════════════════════════════════════════════════
   GRAPH THEORY — Main Application Script
   Initializes Mermaid.js diagrams, theme toggle, scroll effects
   ═══════════════════════════════════════════════════════════════ */

import './style.css';
import mermaid from 'mermaid';

// ─── STATE ───
let currentTheme = localStorage.getItem('gt-theme') || 'light';

// ─── MERMAID INITIALIZATION ───
function initMermaid(theme) {
  const isDark = theme === 'dark';
  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    themeVariables: {
      // Background
      primaryColor: isDark ? '#2d2f4e' : '#e0e7ff',
      primaryBorderColor: isDark ? '#818cf8' : '#6366f1',
      primaryTextColor: isDark ? '#e8eaf4' : '#1a1c2e',

      // Secondary
      secondaryColor: isDark ? '#3b2d5e' : '#ede9fe',
      secondaryBorderColor: isDark ? '#a78bfa' : '#8b5cf6',
      secondaryTextColor: isDark ? '#e8eaf4' : '#1a1c2e',

      // Tertiary
      tertiaryColor: isDark ? '#2d3e4e' : '#dbeafe',
      tertiaryBorderColor: isDark ? '#60a5fa' : '#3b82f6',

      // Lines & labels
      lineColor: isDark ? '#6b6f8d' : '#94a3b8',
      textColor: isDark ? '#e8eaf4' : '#1a1c2e',

      // Fonts
      fontFamily: "'Inter', system-ui, sans-serif",
      fontSize: '14px',

      // Node
      nodeBorder: isDark ? '#818cf8' : '#6366f1',
      mainBkg: isDark ? '#2d2f4e' : '#e0e7ff',

      // Edge labels
      edgeLabelBackground: isDark ? '#1e2035' : '#f8f9fc',

      // Cluster
      clusterBkg: isDark ? '#1e2035' : '#f0f2f8',
      clusterBorder: isDark ? '#4a4e6a' : '#c7d2fe',
    },
    flowchart: {
      curve: 'basis',
      padding: 20,
      htmlLabels: true,
      useMaxWidth: true,
    },
    securityLevel: 'loose',
  });
}

// ─── RENDER ALL MERMAID DIAGRAMS ───
async function renderMermaid() {
  // Remove any previously rendered SVGs
  document.querySelectorAll('.mermaid[data-processed]').forEach((el) => {
    el.removeAttribute('data-processed');
  });

  // Re-render
  await mermaid.run({
    querySelector: '.mermaid',
  });
}

// ─── THEME ───
function applyTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('gt-theme', theme);

  const icon = document.querySelector('.theme-icon');
  if (icon) icon.textContent = theme === 'dark' ? '☾' : '☀';

  // Re-init mermaid with new theme and re-render
  initMermaid(theme);

  // We need to reset the mermaid elements before re-rendering
  document.querySelectorAll('.mermaid').forEach((el) => {
    // Store original definition if not already stored
    if (!el.dataset.original) {
      el.dataset.original = el.textContent;
    }
    // Restore original text content to let mermaid re-parse
    el.innerHTML = el.dataset.original;
    el.removeAttribute('data-processed');
  });

  renderMermaid();
}

function toggleTheme() {
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

// ─── SCROLL EFFECTS ───
function setupScrollEffects() {
  const nav = document.getElementById('main-nav');
  const scrollBtn = document.getElementById('scroll-top-btn');
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav__link');

  // Intersection observer for section reveal
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  sections.forEach((s) => revealObserver.observe(s));

  // Intersection observer for active nav link
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: '-64px 0px -40% 0px' }
  );

  sections.forEach((s) => navObserver.observe(s));

  // Scroll listener for nav shadow + scroll-to-top
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 20);
    scrollBtn.classList.toggle('visible', y > 500);
  });

  // Scroll to top
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── SMOOTH SCROLL FOR NAV LINKS ───
function setupNavLinks() {
  document.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ─── QUIZ LOGIC ───
function setupQuizzes() {
  const quizContainers = document.querySelectorAll('.quiz-container');

  quizContainers.forEach(container => {
    const labels = container.querySelectorAll('.quiz-label');
    const radios = container.querySelectorAll('input[type="radio"]');
    const btn = container.querySelector('.quiz-btn');
    const feedback = container.querySelector('.quiz-feedback');

    // Handle selection styling
    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        // Clear selected class from all labels
        labels.forEach(l => l.classList.remove('selected'));
        // Add selected class to the checked one
        if (radio.checked) {
          radio.closest('.quiz-label').classList.add('selected');
        }
        btn.disabled = false;
      });
    });

    // Check Answer
    btn.addEventListener('click', () => {
      const selectedRadio = container.querySelector('input[type="radio"]:checked');
      if (!selectedRadio) return;

      const isCorrect = selectedRadio.hasAttribute('data-correct');

      feedback.classList.remove('hidden', 'correct', 'incorrect');
      feedback.classList.add('visible');

      if (isCorrect) {
        feedback.classList.add('correct');
        feedback.innerHTML = '<strong>Correct!</strong> Well done.';
      } else {
        feedback.classList.add('incorrect');
        feedback.innerHTML = '<strong>Incorrect.</strong> Try again!';
      }
    });

    // Initial state: disable button until a selection is made
    btn.disabled = true;
  });
}

// ─── BOOT ───
document.addEventListener('DOMContentLoaded', async () => {
  // Store original mermaid definitions
  document.querySelectorAll('.mermaid').forEach((el) => {
    el.dataset.original = el.textContent;
  });

  // Apply theme
  applyTheme(currentTheme);

  // Theme toggle
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  // Scroll effects
  setupScrollEffects();

  // Nav links
  setupNavLinks();

  // Initialize Quizzes
  setupQuizzes();
});
