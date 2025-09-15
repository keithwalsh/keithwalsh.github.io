import React, { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Prism, ensureLanguagesLoaded } from '../utils/prism-languages';
import './CodeHighlighter.css';

export interface CodeHighlighterProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  title?: string;
  style?: React.CSSProperties;
}

const CodeHighlighter: React.FC<CodeHighlighterProps> = ({ 
  code, 
  language,
  showLineNumbers = false,
  title,
  style
}) => {
  const muiTheme = useTheme();
  const backgroundColor = muiTheme.palette.mode === 'dark' ? '#1e1e1e' : '#f6f8fa';
  const textColor = muiTheme.palette.mode === 'dark' ? '#d4d4d4' : '#393A34';

  useEffect(() => {
    // Verify all languages are loaded
    const languageStatus = ensureLanguagesLoaded();
    console.log('PrismJS language status:', languageStatus);
    if (!languageStatus.isPhpLoaded) {
      console.warn('PHP language not loaded! Available languages:', languageStatus.loaded);
    }
  }, []);

  // Process magic comments
  const processCodeWithMagicComments = (codeString: string) => {
    
    const lines = codeString.split('\n');
    const lineHighlights = new Set<number>();
    const wordHighlights: {line: number, word: string, type: 'add' | 'delete'}[] = [];
    const errorLines = new Set<number>();
    const addLines = new Set<number>();
    const linesToFilter = new Set<number>();
    
    // First pass - identify special lines
    lines.forEach((line, index) => {
      // Check for highlight-next-line comment (supports //, #, <!-- -->)
      if ((line.includes('// highlight-next-line') || 
           line.includes('# highlight-next-line') || 
           line.includes('<!-- highlight-next-line -->')) && index < lines.length - 1) {
        lineHighlights.add(index + 1);
        linesToFilter.add(index); // Filter out the comment line
      }
      
      // Check for highlight-word
      if (line.includes('highlight-word')) {
        const wordMatch = line.match(/highlight-word\s+(\S+)/);
        if (wordMatch && wordMatch[1]) {
          wordHighlights.push({ line: index, word: wordMatch[1], type: 'add' });
        }
      }
      
      // Check for Remove comment (apply to next line) - supports multiple comment styles
      const removePattern = /^\s*(?:\/\/|#|<!--.*-->)\s*Remove\s*$/;
      if (removePattern.test(line.trim()) && index < lines.length - 1) {
        errorLines.add(index + 1);
        linesToFilter.add(index); // Filter out the comment line
      }
      
      // Check for Add comment (apply to next line) - supports multiple comment styles  
      const addPattern = /^\s*(?:\/\/|#|<!--.*-->)\s*Add\s*$/;
      if (addPattern.test(line.trim()) && index < lines.length - 1) {
        addLines.add(index + 1);
        linesToFilter.add(index); // Filter out the comment line
      }

      // Check for word highlighting markers and remove them from the line
      const deleteMatches = [...line.matchAll(/\[-([^-\]]+)-\]/g)];
      const addMatches = [...line.matchAll(/\[\+([^+\]]+)\+\]/g)];

      deleteMatches.forEach(match => {
        if (match[1]) {
          wordHighlights.push({ line: index, word: match[1], type: 'delete' });
          // Remove the marker from the line
          lines[index] = lines[index].replace(match[0], match[1]);
        }
      });

      addMatches.forEach(match => {
        if (match[1]) {
          wordHighlights.push({ line: index, word: match[1], type: 'add' });
          // Remove the marker from the line
          lines[index] = lines[index].replace(match[0], match[1]);
        }
      });
    });
    
    // Find highlight-start and highlight-end blocks
    let inHighlightBlock = false;
    lines.forEach((line, index) => {
      if (line.includes('// highlight-start') || 
          line.includes('# highlight-start') || 
          line.includes('<!-- highlight-start -->')) {
        inHighlightBlock = true;
        linesToFilter.add(index); // Filter out the comment line
      } else if (line.includes('// highlight-end') || 
                 line.includes('# highlight-end') || 
                 line.includes('<!-- highlight-end -->')) {
        inHighlightBlock = false;
        linesToFilter.add(index); // Filter out the comment line
      } else if (inHighlightBlock) {
        lineHighlights.add(index);
      }
    });
    
    // Filter out the marker comment lines
    const filteredLines = lines.filter((_, index) => !linesToFilter.has(index));
    
    // Adjust indices for the filtered lines
    const adjustedLineHighlights = new Set<number>();
    const adjustedWordHighlights: {line: number, word: string, type: 'add' | 'delete'}[] = [];
    const adjustedErrorLines = new Set<number>();
    const adjustedAddLines = new Set<number>();
    
    let lineOffset = 0;
    lines.forEach((_, originalIndex) => {
      if (linesToFilter.has(originalIndex)) {
        lineOffset++;
        return;
      }
      
      const adjustedIndex = originalIndex - lineOffset;
      
      if (lineHighlights.has(originalIndex)) {
        adjustedLineHighlights.add(adjustedIndex);
      }
      
      if (errorLines.has(originalIndex)) {
        adjustedErrorLines.add(adjustedIndex);
      }
      
      if (addLines.has(originalIndex)) {
        adjustedAddLines.add(adjustedIndex);
      }
    });
    
    // Adjust word highlights
    wordHighlights.forEach(({ line, word, type }) => {
      if (!linesToFilter.has(line)) {
        const adjustedIndex = line - [...linesToFilter].filter(idx => idx < line).length;
        adjustedWordHighlights.push({ line: adjustedIndex, word, type });
      }
    });
    
    return { 
      code: filteredLines.join('\n'), 
      lineHighlights: adjustedLineHighlights, 
      wordHighlights: adjustedWordHighlights,
      errorLines: adjustedErrorLines,
      addLines: adjustedAddLines
    };
  };

  const { 
    code: processedCode, 
    lineHighlights, 
    wordHighlights,
    errorLines,
    addLines 
  } = processCodeWithMagicComments(code);

  // Get syntax highlighting from Prism
  const getHighlightedCode = (code: string, lang: string) => {
    try {
      // Check if language is supported
      if (Prism.languages && Prism.languages[lang]) {
        const highlighted = Prism.highlight(code, Prism.languages[lang], lang);
        return highlighted;
      } else {
        console.warn(`Language ${lang} not supported. Available:`, Object.keys(Prism.languages || {}));
        return code;
      }
    } catch (error) {
      console.warn(`Failed to highlight language: ${lang}`, error);
      return code;
    }
  };

  // Apply syntax highlighting to the entire code block first
  const highlightedCode = getHighlightedCode(processedCode, language);
  
  // Split highlighted code into lines for rendering
  const highlightedLines = highlightedCode.split('\n');

  return (
    <div className={`codeBlockContainer ${muiTheme.palette.mode === 'dark' ? 'prism-dark-theme' : ''}`} style={{ ...style, background: backgroundColor, color: textColor }}>
      {title && (
        <div className="codeBlockTitle" style={{ background: backgroundColor }}>
          {title}
        </div>
      )}
      <pre className={`language-${language}`} style={{ 
        margin: 0, 
        flex: 1,
        overflow: 'auto',
        position: 'relative',
        background: backgroundColor,
        color: textColor,
        padding: '1rem',
        borderRadius: '4px',
      }}>
        {highlightedLines.map((highlightedLine: string, i: number) => {
          // Build className for line
          let lineClass = 'code-line';
          
          // Apply line highlights
          if (lineHighlights.has(i)) {
            lineClass += ' theme-code-block-highlighted-line';
          }
          
          // Apply error/add styling
          if (errorLines.has(i)) {
            lineClass += ' code-block-error-line';
          }
          if (addLines.has(i)) {
            lineClass += ' code-block-not-error-line';
          }

          return (
            <div key={i} className={lineClass} style={{ display: 'flex' }}>
              {showLineNumbers && (
                <span className="line-number-gutter">{i + 1}</span>
              )}
              <span className="line-content">
                {(() => {
                  // Check if this line contains words to highlight
                  const lineWordHighlights = wordHighlights.filter(wh => wh.line === i);
                  
                  if (lineWordHighlights.length === 0) {
                    // Just use the syntax highlighted HTML
                    return <span dangerouslySetInnerHTML={{ __html: highlightedLine }} />;
                  }
                  
                  // Apply word highlights on top of syntax highlighting
                  let processedLine = highlightedLine;
                  lineWordHighlights.forEach(({ word, type }) => {
                    const highlightClass = type === 'add' ? 'word-add' : 'word-delete';
                    // Escape special regex characters in the word
                    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    // Replace the word while preserving HTML tags
                    processedLine = processedLine.replace(
                      new RegExp(`(>[^<]*)(${escapedWord})([^<]*<)`, 'g'),
                      `$1<span class="${highlightClass}">$2</span>$3`
                    );
                    // Also handle cases where the word is not inside HTML tags
                    processedLine = processedLine.replace(
                      new RegExp(`^(${escapedWord})`, 'g'),
                      `<span class="${highlightClass}">$1</span>`
                    );
                    processedLine = processedLine.replace(
                      new RegExp(`(\\s)(${escapedWord})(\\s|$)`, 'g'),
                      `$1<span class="${highlightClass}">$2</span>$3`
                    );
                  });
                  
                  return <span dangerouslySetInnerHTML={{ __html: processedLine }} />;
                })()}
              </span>
            </div>
          );
        })}
      </pre>
    </div>
  );
};

export default CodeHighlighter; 