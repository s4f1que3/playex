import { useEffect, useState } from 'react';
import i18n from '../../i18n';

// Simple translation wrapper that doesn't rely on React context
const TranslatedText = ({ textKey, defaultText }) => {
  const [text, setText] = useState(i18n.t(textKey) || defaultText || textKey);

  useEffect(() => {
    const updateText = () => {
      setText(i18n.t(textKey) || defaultText || textKey);
    };

    // Update text when language changes
    i18n.on('languageChanged', updateText);
    
    return () => {
      i18n.off('languageChanged', updateText);
    };
  }, [textKey, defaultText]);

  return text;
};

export default TranslatedText;
