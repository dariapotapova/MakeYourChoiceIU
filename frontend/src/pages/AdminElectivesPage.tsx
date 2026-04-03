import { useState } from 'react';
import type { Elective } from '../types/elective';
import type { AdminElectiveFilters } from '../types/electivesList';
import type { Locale } from '../utils/electiveText';
import { useAdminElectivesPage } from '../hooks/useAdminElectivesPage';
import { SearchInput } from '../components/SearchInput';
import { AdminElectiveFilters as AdminElectiveFiltersPanel } from '../components/AdminElectiveFilters';
import { ElectivesList } from '../components/ElectivesList';

interface AdminElectivesPageProps {
    electives: Elective[];
    locale: Locale;
    onEdit?: (elective: Elective) => void;
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

/**
 * Admin page:
 * - хранит query
 * - хранит filters
 * - использует page-level hook
 * - собирает экран из SearchInput, AdminElectiveFilters и ElectivesList
 */
export function AdminElectivesPage({
                                       electives,
                                       locale,
                                       onEdit,
                                       onArchive,
                                       onDelete,
                                   }: AdminElectivesPageProps) {
    const [query, setQuery] = useState('');
    const [filters, setFilters] = useState<AdminElectiveFilters>(INITIAL_FILTERS);

    const { visibleElectives, filterOptions } = useAdminElectivesPage({
        electives,
        query,
        filters,
    });

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
    }

    return (
        <main>
            <h1>Admin electives</h1>

            <SearchInput
                id="admin-electives-search"
                label="Search electives: "
                value={query}
                onChange={setQuery}
                placeholder="Type to search"
            />

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
                onEdit={onEdit}
                onArchive={onArchive}
                onDelete={onDelete}
                emptyText="No electives match the current admin filters"
            />
        </main>
    );
}