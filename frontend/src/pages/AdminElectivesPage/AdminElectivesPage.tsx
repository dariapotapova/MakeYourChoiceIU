// src/pages/admin/AdminElectivesPage/AdminElectivesPage.tsx
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { useLocale } from '../../app/locale/LocaleContext';
import { Header } from '../../ui/components/Header/Header';
import { ElectivesList } from '../../ui/components/ElectivesList/ElectivesList';

import { AdminElectivesSidebar } from './AdminElectivesSidebar';
import { useAdminElectives, type Draft, type ElectiveType } from './useAdminElectivesPage.ts';
import { ElectiveEditorModal } from './ElectiveEditorModal';
import { ConfirmModal } from './ConfirmModal';

export function AdminElectivesPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { locale, toggleLocale } = useLocale();

    const groupId = 'mock-group';
    const loc = locale as 'en' | 'ru';

    const admin = useAdminElectives({ groupId, locale: loc });

    // modal state
    const [editorOpen, setEditorOpen] = useState(false);
    const [editorMode, setEditorMode] = useState<'add' | 'edit'>('add');
    const [editingId, setEditingId] = useState<string | null>(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [removeId, setRemoveId] = useState<string | null>(null);

    const initialDraft: Draft | undefined = useMemo(() => {
        if (editorMode !== 'edit' || !editingId) return undefined;
        const e = admin.getById(editingId);
        if (!e) return undefined;
        return {
            type: e.type,
            title: e.title,
            teacher: e.teacher,
            language: e.language,
            program: e.program,
            year: e.year,
            description: e.description,
        };
    }, [admin, editorMode, editingId]);

    const openAdd = () => {
        setEditorMode('add');
        setEditingId(null);
        setEditorOpen(true);
    };

    const openEdit = (id: string) => {
        setEditorMode('edit');
        setEditingId(id);
        setEditorOpen(true);
    };

    const onSave = (draft: Draft) => {
        if (editorMode === 'add') admin.addElective(draft);
        if (editorMode === 'edit' && editingId) admin.editElective(editingId, draft);
        setEditorOpen(false);
    };

    const requestRemove = (id: string) => {
        setRemoveId(id);
        setConfirmOpen(true);
    };

    const confirmRemove = () => {
        if (removeId) admin.removeElective(removeId);
        setRemoveId(null);
        setConfirmOpen(false);
    };

    return (
        <div style={{ background: 'var(--color-main-background)', minHeight: '100vh' }}>
            <Header
                email={user?.email ?? ''}
                role={user?.role ?? 'admin'}
                locale={loc}
                onToggleLocale={toggleLocale}
                onLogout={() => navigate('/logout')}
                onSwitchToStudent={() => navigate('/student')}
            />

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '260px 1fr',
                    gap: 'var(--spacing-xxl)',
                    padding: 'var(--spacing-xxl)',
                    alignItems: 'start',
                }}
            >
                <AdminElectivesSidebar
                    items={admin.tabs as any}
                    active={admin.activeType as any}
                    onChange={(t) => admin.setActiveType(t as any)}
                    addLabel={loc === 'ru' ? 'Добавить электив' : 'Add electives'}
                    onAdd={openAdd}
                />

                <div>
                    <ElectivesList
                        role="admin"
                        locale={loc}
                        electives={admin.items as any}
                        query={admin.query}
                        onQueryChange={admin.setQuery}
                        onEdit={openEdit}
                        onArchive={admin.archiveElective}
                        onDelete={requestRemove}
                    />
                </div>
            </div>

            <ElectiveEditorModal
                open={editorOpen}
                mode={editorMode}
                locale={loc}
                types={admin.tabs as any}
                initial={initialDraft}
                onClose={() => setEditorOpen(false)}
                onSave={onSave}
            />

            <ConfirmModal
                open={confirmOpen}
                locale={loc}
                onClose={() => setConfirmOpen(false)}
                onConfirm={confirmRemove}
            />
        </div>
    );
}