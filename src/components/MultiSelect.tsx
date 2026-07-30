import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, X, AlertCircle, Search } from "lucide-react";

interface MultiSelectProps {
  id: string;
  label: string;
  stepNumber?: string;
  isRequired?: boolean;
  isOptional?: boolean;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  maxSelection?: number;
  minSelection?: number;
  maxErrorMessage?: string;
  placeholder?: string;
  helperText?: string;
  customDetailValue?: string;
  onCustomDetailChange?: (value: string) => void;
  customDetailPlaceholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  id,
  label,
  stepNumber,
  isRequired = false,
  isOptional = false,
  options,
  selectedValues,
  onChange,
  maxSelection = 5,
  minSelection = 1,
  maxErrorMessage = "Maksimal 5 pilihan dapat dipilih.",
  placeholder = "Pilih...",
  helperText,
  customDetailValue = "",
  onCustomDetailChange,
  customDetailPlaceholder = "Tuliskan detail spesifik target audiens di sini..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleOption = (option: string) => {
    const exists = selectedValues.includes(option);

    if (exists) {
      // Remove option
      const newValues = selectedValues.filter((v) => v !== option);
      onChange(newValues);
      setWarningMessage(null);
    } else {
      // Add option with max limit check
      if (selectedValues.length >= maxSelection) {
        setWarningMessage(maxErrorMessage);
        return;
      }
      setWarningMessage(null);
      onChange([...selectedValues, option]);
    }
  };

  const handleRemoveValue = (valueToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValues = selectedValues.filter((v) => v !== valueToRemove);
    onChange(newValues);
    setWarningMessage(null);
  };

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isLainnyaSelected = selectedValues.includes("Lainnya");

  return (
    <div ref={containerRef} className="relative space-y-2">
      {/* Label and Selection Counter Header */}
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="block text-sm font-semibold text-slate-200">
          {stepNumber && <span className="mr-1">{stepNumber}</span>}
          {label}{" "}
          {isRequired && <span className="text-rose-400 text-xs font-bold">(Wajib)</span>}
          {isOptional && <span className="text-slate-400 text-xs font-normal">(Opsional)</span>}
        </label>

        {/* Selected Count Indicator */}
        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border transition-colors ${
            selectedValues.length > 0
              ? "bg-sky-500/10 text-sky-400 border-sky-500/30"
              : "bg-slate-800 text-slate-400 border-slate-700"
          }`}
        >
          {selectedValues.length}/{maxSelection} dipilih
        </span>
      </div>

      {/* Selected Items Badges / Chips Display Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-h-[46px] px-3 py-2 rounded-xl bg-slate-950 border text-slate-100 text-sm focus-within:ring-2 focus-within:ring-sky-500/50 transition-all cursor-pointer flex items-center justify-between gap-2 flex-wrap ${
          warningMessage ? "border-rose-500/80" : "border-slate-700 hover:border-slate-600"
        }`}
      >
        <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
          {selectedValues.length === 0 ? (
            <span className="text-slate-500 text-xs py-0.5">{placeholder}</span>
          ) : (
            selectedValues.map((val) => (
              <span
                key={val}
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-sm"
              >
                <span>{val}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemoveValue(val, e)}
                  className="hover:bg-sky-400/20 p-0.5 rounded-md text-sky-300 hover:text-white transition-colors cursor-pointer"
                  title={`Hapus ${val}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Warning / Error Message */}
      {warningMessage && (
        <p className="text-xs text-rose-400 font-medium flex items-center gap-1 animate-in fade-in">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {warningMessage}
        </p>
      )}

      {/* Quick Option Pills for fast clicking */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        <span className="text-[10px] text-slate-500 font-medium py-1">Pilihan Cepat:</span>
        {options.slice(0, 10).map((opt) => {
          const isSelected = selectedValues.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => handleToggleOption(opt)}
              className={`text-[11px] px-2.5 py-0.5 rounded-md border transition-all cursor-pointer ${
                isSelected
                  ? "bg-sky-500/20 text-sky-300 border-sky-500/40 font-semibold"
                  : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700"
              }`}
            >
              {isSelected ? "✓ " : "+ "}
              {opt}
            </button>
          );
        })}
      </div>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute z-30 left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 max-h-72 flex flex-col">
          {/* Search Header */}
          <div className="p-2 border-b border-slate-800 bg-slate-950/80 sticky top-0 z-10 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 ml-2 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pilihan..."
              className="w-full bg-transparent text-slate-100 text-xs focus:outline-none placeholder-slate-500 py-1 pr-2"
              onClick={(e) => e.stopPropagation()}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-slate-400 hover:text-white p-1 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="overflow-y-auto p-1.5 space-y-0.5 scrollbar-thin scrollbar-thumb-slate-700">
            {filteredOptions.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">
                Tidak ada pilihan yang cocok
              </p>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = selectedValues.includes(opt);
                return (
                  <div
                    key={opt}
                    onClick={() => handleToggleOption(opt)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-sky-500/20 text-sky-300 font-semibold"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <Check className="w-4 h-4 text-sky-400 flex-shrink-0" />}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="p-2 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between px-3">
            <span>Pilih 1 hingga 5 opsi.</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-sky-400 hover:underline font-semibold"
            >
              Selesai
            </button>
          </div>
        </div>
      )}

      {/* Helper text */}
      {helperText && <p className="text-[11px] text-slate-400 mt-1">{helperText}</p>}

      {/* Custom Detail Input if 'Lainnya' or custom notes are enabled */}
      {(onCustomDetailChange !== undefined && (isLainnyaSelected || customDetailValue !== undefined)) && (
        <div className="mt-2 pt-1 animate-in fade-in">
          <input
            type="text"
            value={customDetailValue}
            onChange={(e) => onCustomDetailChange(e.target.value)}
            placeholder={customDetailPlaceholder}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
          />
        </div>
      )}
    </div>
  );
};
