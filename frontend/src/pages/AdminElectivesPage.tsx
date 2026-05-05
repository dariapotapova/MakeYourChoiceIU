import { useState } from 'react';
import type { Elective } from '../types/elective';
import type { AdminElectiveFilters } from '../types/electivesList';
import type { Locale } from '../utils/electiveText';
import type { AdminSidebarItem, AdminSidebarItemType } from '../types/adminSidebar';
import { useAdminElectivesPage } from '../hooks/useAdminElectivesPage';
import { useAdminElectiveEditor } from '../hooks/useAdminElectiveEditor';
import { AdminElectiveFilters as AdminElectiveFiltersPanel } from '../components/AdminElectiveFilters';
import { ElectivesList } from '../components/ElectivesList';
import { AdminElectivesSidebar } from '../components/AdminElectivesSidebar';
import { AdminPageLayout } from '../components/AdminPageLayout';
import { ElectiveEditorModal } from '../components/ElectiveEditorModal';
import {
    mapDraftToElectivePayload,
    mapSidebarItemsToEditorTypeOptions,
} from '../utils/electiveEditor';
import type { UpdateElectivePayload } from '../api/electives';

interface AdminElectivesPageProps {
    electives: Elective[];
    locale: Locale;
    query: string;
    onCreateElective: (payload: UpdateElectivePayload) => Promise<void>;
    onUpdateElective: (id: number, payload: UpdateElectivePayload) => Promise<void>;
    onArchive?: (elective: Elective) => void;
    onDelete?: (elective: Elective) => void;
}

const INITIAL_FILTERS: AdminElectiveFilters = {
    electiveLanguage: '',
    degreeYear: '',
    electiveType: '',
    programLanguage: '',
    status: '',
};

const SIDEBAR_ITEMS: AdminSidebarItem[] = [
    { type: 'all', title: 'All electives' },
    { type: 'TECH', title: 'Tech' },
    { type: 'HUM', title: 'Hum' },
    { type: 'MATH', title: 'Math' },
];

export function AdminElectivesPage({
                                       electives,
                                       locale,
                                       query,
                                       onCreateElective,
                                       onUpdateElective,
                                       onArchive,
                                       onDelete,
                                   }: AdminElectivesPageProps) {
    const [activeType, setActiveType] = useState<AdminSidebarItemType>('all');
    const [filters, setFilters] = useState<AdminElectiveFilters>(INITIAL_FILTERS);
    const [saving, setSaving] = useState(false);

    const editor = useAdminElectiveEditor();

    const effectiveFilters: AdminElectiveFilters = {
        ...filters,
        electiveType: activeType === 'all' ? filters.electiveType : String(activeType),
    };

    const { visibleElectives, filterOptions } = useAdminElectivesPage({
        electives,
        query,
        filters: effectiveFilters,
    });

    const typeOptions = mapSidebarItemsToEditorTypeOptions(SIDEBAR_ITEMS);

    function updateFilter<Key extends keyof AdminElectiveFilters>(
        key: Key,
        value: AdminElectiveFilters[Key]
    ) {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    function resetFilters() {
        setFilters(INITIAL_FILTERS);
        setActiveType('all');
    }

    function handleAddElective() {
        const prefilledType = activeType === 'all' ? '' : String(activeType);
        editor.openAdd(prefilledType);
    }

    function handleEditElective(elective: Elective) {
        editor.openEdit(elective);
    }

    async function handleSave() {
        const payload = mapDraftToElectivePayload(editor.draft);

        try {
            setSaving(true);

            if (editor.mode === 'add') {
                await onCreateElective(payload);
            } else if (editor.editingElectiveId !== null) {
                await onUpdateElective(editor.editingElectiveId, payload);
            }

            editor.close();
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            <AdminPageLayout
                sidebar={
                    <AdminElectivesSidebar
                        items={SIDEBAR_ITEMS}
                        active={activeType}
                        onChange={setActiveType}
                        addLabel="Add elective"
                        onAdd={handleAddElective}
                    />
                }
                content={
                    <section>
                        <h1>Admin electives</h1>

                        <AdminElectiveFiltersPanel
                            filters={filters}
                            filterOptions={filterOptions}
                            onChange={updateFilter}
                            onReset={resetFilters}
                        />

                        <ElectivesList
                            role="admin"
                            electives={visibleElectives}
                            locale={locale}
                            query={query}
                            onEdit={handleEditElective}
                            onArchive={onArchive}
                            onDelete={onDelete}
                            emptyText="No electives match the current admin filters"
                        />
                    </section>
                }
            />

            <ElectiveEditorModal
                open={editor.isOpen}
                mode={editor.mode}
                draft={editor.draft}
                typeOptions={typeOptions}
                onClose={editor.close}
                onChangeField={editor.updateField}
                onSave={handleSave}
                saving={saving}
                locale={locale}
            />
        </>
    );
}