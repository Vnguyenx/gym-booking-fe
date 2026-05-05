// ============================================================
// Component: PricingGrid
// src/components/pricing/PricingGrid.tsx
// ============================================================

import React from 'react';
import PricingCard from '../../common/PricingCard';
import { Membership } from '../../../types/models';

interface PricingGridProps {
    memberships: Membership[];
    onRegister: (membership: Membership) => void;
}

const PricingGrid: React.FC<PricingGridProps> = ({ memberships, onRegister }) => {
    return (
        <div className="pricing-grid">
            {memberships.map((membership) => (
                <PricingCard
                    key={membership.id ?? membership.durationMonths}
                    membership={membership}
                    onRegister={onRegister}
                />
            ))}
        </div>
    );
};

export default PricingGrid;