// src/components/common/ToggleSwitch.tsx
import React from 'react';
import '../../styles/common/ToggleSwitch.css';

interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label, disabled = false }) => {
    return (
        <label className={`toggle-switch ${disabled ? 'disabled' : ''}`}>
            {label && <span className="toggle-label">{label}</span>}
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
            />
            <span className="toggle-slider"></span>
        </label>
    );
};

export default ToggleSwitch;