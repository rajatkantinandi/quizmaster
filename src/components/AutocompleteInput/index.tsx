import React, { useState } from 'react';
import FormInput from '../FormInput';
import styles from './styles.module.css';

interface Props {
  inputProps?: any;
  name: string;
  rules: object;
  control: any;
  errorMessage: string;
  componentType?: string;
  label?: String;
  id: String;
  suggestions: string[];
  setInputValue: Function;
}

function AutocompleteInput({ suggestions, inputProps, setInputValue, ...restProps }: Props) {
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  let suggestionsListComponent;

  function onInputChange(ev) {
    const userInput = ev.currentTarget.value;

    const filteredSuggestions = suggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(userInput.toLowerCase()),
    );

    setActiveSuggestion(0);
    setFilteredSuggestions(filteredSuggestions);
    setShowSuggestions(true);

    if (inputProps.onChange) {
      inputProps.onChange(ev);
    }
  }

  function onClick(ev) {
    setActiveSuggestion(0);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    setInputValue(ev.currentTarget.innerText);
  }

  function onKeyDown(ev) {
    if (ev.keyCode === 13) {
      setActiveSuggestion(0);
      setShowSuggestions(false);
      setInputValue(filteredSuggestions[activeSuggestion]);
    } else if (ev.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }
      setActiveSuggestion(activeSuggestion - 1);
    }
    // User pressed the down arrow, increment the index
    else if (ev.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }
      setActiveSuggestion(activeSuggestion + 1);
    }
  }

  if (showSuggestions) {
    if (filteredSuggestions.length) {
      suggestionsListComponent = (
        <ul className={styles.suggestions}>
          {filteredSuggestions.map((suggestion, index) => {
            let className;

            // Flag the active suggestion with a class
            if (index === activeSuggestion) {
              className = styles.suggestionActive;
            }

            return (
              <li className={className} key={suggestion} onClick={onClick}>
                {suggestion}
              </li>
            );
          })}
        </ul>
      );
    } else {
      suggestionsListComponent = (
        <div className={styles.noSuggestions}>
          <em>No suggestions available.</em>
        </div>
      );
    }
  }

  return (
    <div className="relative">
      <FormInput
        inputProps={{
          ...inputProps,
          onChange: onInputChange,
          onKeyDown,
        }}
        {...restProps}
      />
      {suggestionsListComponent}
    </div>
  );
}

export default AutocompleteInput;
