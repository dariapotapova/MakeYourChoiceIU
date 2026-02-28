// src/pages/admin/AdminElectivesPage/AdminElectivesSidebar.tsx
import React from 'react';

type Item = { type: 'all' | 'tech' | 'hum' | 'math' | 'custom'; title: string };

type Props = {
    items: Item[];
    active: Item['type'];
    onChange: (t: Item['type']) => void;
    addLabel: string;
    onAdd: () => void;
};

export function AdminElectivesSidebar({ items, active, onChange, addLabel, onAdd }: Props) {
    return (
        <aside
            style={{
                position: 'sticky',
                top: 12,
                alignSelf: 'start',
                background: 'var(--color-main-background)',
                borderRadius: 16,
                padding: 'var(--spacing-xl)',
                border: '1px solid rgba(0,0,0,0.08)',
            }}
        >
            <button
                type="button"
                onClick={onAdd}
                className="button button--primary"
                style={{ width: '100%', marginBottom: 'var(--spacing-lg)' }}
            >
                {addLabel}
            </button>

            <nav style={{ display: 'grid', gap: 8 }}>
                {items.map((x) => (
                    <button
                        key={x.type}
                        type="button"
                        onClick={() => onChange(x.type)}
                        style={{
                            textAlign: 'left',
                            padding: '10px 12px',
                            borderRadius: 12,
                            border: '1px solid rgba(0,0,0,0.08)',
                            background: active === x.type ? 'rgba(0,0,0,0.06)' : 'transparent',
                            cursor: 'pointer',
                        }}
                    >
                        {x.title}
                    </button>
                ))}
            </nav>
        </aside>
    );
}