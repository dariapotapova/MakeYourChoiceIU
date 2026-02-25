// src/pages/admin/AdminElectivesPage/ElectiveEditorModal.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Modal } from '../../ui/components/Modal/Modal';
import type { Draft, ElectiveType } from './useAdminElectivesPage.ts';

type Props = {
    open: boolean;
    mode: 'add' | 'edit';
    locale: 'en' | 'ru';
    types: { type: ElectiveType | 'all'; title: string }[]; // берем из sidebar tabs, но исключим all
    initial?: Draft;
    onClose: () => void;
    onSave: (draft: Draft) => void;
};

const TEXT = {
    en: {
        addTitle: 'Add elective',
        editTitle: 'Edit elective',
        cancel: 'Cancel',
        save: 'Save',
        hint: 'Description supports Markdown (e.g., **bold**, _italic_, lists).',
        fields: {
            type: 'Type',
            title: 'Title',
            teacher: 'Teacher',
            language: 'Language',
            program: 'Program',
            year: 'Year',
            description: 'Description',
        },
    },
    ru: {
        addTitle: 'Добавить электив',
        editTitle: 'Редактировать электив',
        cancel: 'Отмена',
        save: 'Сохранить',
        hint: 'В описании можно использовать Markdown (например, **жирный**, _курсив_, списки).',
        fields: {
            type: 'Тип',
            title: 'Название',
            teacher: 'Преподаватель',
            language: 'Язык',
            program: 'Программы',
            year: 'Курс',
            description: 'Описание',
        },
    },
} as const;

function makeEmpty(type: ElectiveType): Draft {
    return { type, title: '', teacher: '', language: 'EN', program: '', year: 1, description: '' };
}

export function ElectiveEditorModal({
                                        open,
                                        mode,
                                        locale,
                                        types,
                                        initial,
                                        onClose,
                                        onSave,
                                    }: Props) {
    const t = TEXT[locale];
    const allowedTypes = useMemo(
        () => types.filter((x) => x.type !== 'all') as { type: ElectiveType; title: string }[],
        [types]
    );

    const fallbackType = (allowedTypes[0]?.type ?? 'tech') as ElectiveType;

    const [draft, setDraft] = useState<Draft>(() => initial ?? makeEmpty(fallbackType));

    // when opening / switching initial
    useEffect(() => {
        if (!open) return;
        setDraft(initial ?? makeEmpty(fallbackType));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, initial, fallbackType]);

    return (
        <Modal
            open={open}
            title={mode === 'add' ? t.addTitle : t.editTitle}
            onClose={onClose}
            footer={
                <>
                    <button className="button button--outline" type="button" onClick={onClose}>
                        {t.cancel}
                    </button>
                    <button className="button button--primary" type="button" onClick={() => onSave(draft)}>
                        {t.save}
                    </button>
                </>
            }
        >
            <div style={{ display: 'grid', gap: 12 }}>
                <label style={{ display: 'grid', gap: 6 }}>
                    <span>{t.fields.type}</span>
                    <select
                        value={draft.type}
                        onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value as ElectiveType }))}
                    >
                        {allowedTypes.map((x) => (
                            <option key={x.type} value={x.type}>
                                {x.title}
                            </option>
                        ))}
                    </select>
                </label>

                <label style={{ display: 'grid', gap: 6 }}>
                    <span>{t.fields.title}</span>
                    <input value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
                </label>

                <label style={{ display: 'grid', gap: 6 }}>
                    <span>{t.fields.teacher}</span>
                    <input value={draft.teacher} onChange={(e) => setDraft((d) => ({ ...d, teacher: e.target.value }))} />
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <label style={{ display: 'grid', gap: 6 }}>
                        <span>{t.fields.language}</span>
                        <input value={draft.language} onChange={(e) => setDraft((d) => ({ ...d, language: e.target.value }))} />
                    </label>

                    <label style={{ display: 'grid', gap: 6 }}>
                        <span>{t.fields.year}</span>
                        <input
                            type="number"
                            min={1}
                            max={6}
                            value={draft.year}
                            onChange={(e) => setDraft((d) => ({ ...d, year: Number(e.target.value) }))}
                        />
                    </label>
                </div>

                <label style={{ display: 'grid', gap: 6 }}>
                    <span>{t.fields.program}</span>
                    <input value={draft.program} onChange={(e) => setDraft((d) => ({ ...d, program: e.target.value }))} />
                </label>

                <label style={{ display: 'grid', gap: 6 }}>
                    <span>{t.fields.description}</span>
                    <textarea
                        rows={10}
                        value={draft.description}
                        onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                        placeholder="Write description in Markdown..."
                    />
                    <div style={{ fontSize: 12, opacity: 0.75 }}>{t.hint}</div>
                </label>
            </div>
        </Modal>
    );
}