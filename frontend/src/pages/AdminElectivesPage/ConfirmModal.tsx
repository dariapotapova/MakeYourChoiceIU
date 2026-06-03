// src/pages/admin/AdminElectivesPage/ConfirmModal.tsx
import React from 'react';
import { Modal } from '../../ui/components/Modal/Modal';

type Props = {
    open: boolean;
    locale: 'en' | 'ru';
    onClose: () => void;
    onConfirm: () => void;
};

const TEXT = {
    en: {
        title: 'Remove elective',
        body: 'Are you sure you want to remove this elective? This action cannot be undone.',
        cancel: 'Cancel',
        remove: 'Remove',
    },
    ru: {
        title: 'Удалить электив',
        body: 'Точно удалить этот электив? Действие нельзя отменить.',
        cancel: 'Отмена',
        remove: 'Удалить',
    },
} as const;

export function ConfirmModal({ open, locale, onClose, onConfirm }: Props) {
    const t = TEXT[locale];
    return (
        <Modal
            open={open}
            title={t.title}
            onClose={onClose}
            footer={
                <>
                    <button className="button button--outline" type="button" onClick={onClose}>
                        {t.cancel}
                    </button>
                    <button className="button button--danger" type="button" onClick={onConfirm}>
                        {t.remove}
                    </button>
                </>
            }
        >
            <p style={{ margin: 0 }}>{t.body}</p>
        </Modal>
    );
}