/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { AvailableTypes } from '$app/pages/settings/custom-fields/components';
import { ChangeEvent, useEffect, useState, useRef } from 'react';
import { InputField } from '.';
import Toggle from './Toggle';
import { useColorScheme } from '$app/common/colors';

export interface Props {
  defaultValue: any;
  field: string;
  value: string;
  onValueChange: (value: string | number | boolean | null) => unknown;
}

export function InputCustomField(props: Props) {
  const [type, setType] = useState('single_line_text');
  const [allOptions, setAllOptions] = useState<{ value: string; label: string }[]>([]);
  const [displayedOptions, setDisplayedOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedValue, setSelectedValue] = useState<string | null>(props.defaultValue || null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const colors = useColorScheme();

  useEffect(() => {
    const [, fieldType] = props.value.includes('|')
      ? props.value.split('|')
      : [props.value, 'multi_line_text'];

    setType(fieldType);
  }, [props.field]);

  useEffect(() => {
    // Create options and set both allOptions and displayedOptions
    const newOptions = type.split(',').map((value) => ({ value, label: value }));
    setAllOptions(newOptions);
    setDisplayedOptions(newOptions.slice(0, 20)); // Show only 20 items initially
    setSelectedValue(props.defaultValue || null);
  }, [type, props.defaultValue]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectChange = (value: string | null) => {
    setSelectedValue(value);
    props.onValueChange(value);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    props.onValueChange(newValue);
    setIsDropdownOpen(true);
  };

  const handleOptionClick = (value: string) => {
    setSelectedValue(value);
    handleSelectChange(value);
    setIsDropdownOpen(false);
  };

  const handleClearClick = () => {
    setSelectedValue(null);
    props.onValueChange(null);
    setIsDropdownOpen(false);
  };

  const filteredOptions = allOptions.filter(option => 
    option.label.toLowerCase().includes(selectedValue?.toLowerCase() || '')
  );

  // Update displayed options based on the filtered results
  useEffect(() => {
    setDisplayedOptions(filteredOptions.slice(0, 20)); // Show only 20 items
  }, [filteredOptions]);

  return (
    <>
      {type === AvailableTypes.SingleLineText && (
        <InputField
          style={{ color: colors.$3, colorScheme: colors.$0 }}
          type="text"
          id={props.field}
          onValueChange={props.onValueChange}
          value={props.defaultValue || ''}
        />
      )}

      {type === AvailableTypes.MultiLineText && (
        <InputField
          style={{ color: colors.$3, colorScheme: colors.$0 }}
          element="textarea"
          id={props.field}
          onValueChange={props.onValueChange}
          value={props.defaultValue || ''}
        />
      )}

      {type === AvailableTypes.Switch && (
        <Toggle
          style={{ color: colors.$3, colorScheme: colors.$0 }}
          onChange={(value) => props.onValueChange(value)}
          checked={
            typeof props.defaultValue === 'string'
              ? props.defaultValue === 'true' || props.defaultValue === '1'
              : props.defaultValue
          }
        />
      )}

      {type === AvailableTypes.Date && (
        <InputField
          style={{ color: colors.$3, colorScheme: colors.$0 }}
          type="date"
          id={props.field}
          onValueChange={props.onValueChange}
          value={props.defaultValue || ''}
        />
      )}

      {!Object.values(AvailableTypes).includes(type as AvailableTypes) && (
        <div>
          <input
            type="text"
            value={selectedValue || ''}
            onChange={handleInputChange}
            onClick={() => setIsDropdownOpen(true)}
            className="w-30 text-color3 bg-color0 p-2 border border-gray-300 rounded-md pr-10 box-border"
            style={{ width: "200px" }}
          />

          {isDropdownOpen && (
            <ul
              ref={dropdownRef}
              className="absolute z-10 bg-white border border-gray-300 rounded-md w-60 max-h-40 overflow-y-scroll overflow-x-scroll list-none p-0 m-0 mt-1 shadow-md"
              style={{ height: "170px", width: "250px" }}
            >
              {displayedOptions.length > 0 &&
                displayedOptions.map(option => (
                  <li
                    key={option.value}
                    onClick={() => handleOptionClick(option.value)}
                    className="p-2 cursor-pointer bg-color0 border-b border-gray-200 transition-colors duration-200 ease-in-out hover:bg-slate-200"
                  >
                    {option.label}
                  </li>
                ))}
              {filteredOptions.length === 0 ? (
                <li className="p-2 text-gray-500 text-center">
                  No data found
                </li>
              ) : null}
            </ul>
          )}
        </div>
      )}
    </>
  );
}
