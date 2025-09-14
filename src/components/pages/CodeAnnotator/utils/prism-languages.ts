// Centralized PrismJS language loader
// Import PrismJS core first
import Prism from 'prismjs';

// Import base languages that other languages depend on
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-markup-templating';

// Import all supported languages
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-sql';

// Import base theme
import 'prismjs/themes/prism.css';

// Ensure all languages are properly loaded
const ensureLanguagesLoaded = () => {
  const supportedLanguages = [
    'markup', 'php', 'javascript', 'typescript', 
    'css', 'bash', 'json', 'markdown', 'sql'
  ];
  
  const loadedLanguages = Object.keys(Prism.languages || {});
  const missingLanguages = supportedLanguages.filter(lang => !loadedLanguages.includes(lang));
  
  if (missingLanguages.length > 0) {
    console.warn('Some PrismJS languages failed to load:', missingLanguages);
  }
  
  return {
    loaded: loadedLanguages,
    missing: missingLanguages,
    isPhpLoaded: loadedLanguages.includes('php')
  };
};

export { Prism, ensureLanguagesLoaded }; 