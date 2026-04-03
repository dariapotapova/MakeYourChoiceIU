import { useEffect, useState } from 'react';
import type { Elective } from '../types/elective';
import type { Locale } from '../utils/electiveText';
import { useStudentElectivesPage } from '../hooks/useStudentElectivesPage';
import { SearchInput } from '../components/SearchInput';
import { StudentElectiveTypeTabs } from '../components/StudentElectiveTypeTabs';
import { ElectivesList } from '../components/ElectivesList';

interface StudentElectivesPageProps {
    electives: Elective[];
    locale: Locale;
    favouriteIds: number[];
    onToggleFavourite?: (elective: Elective) => void;
}

/**
 * Student page:
 * - хранит query
 * - хранит activeType
 * - использует page-level hook
 * - собирает экран из маленьких компонентов
 */
export function StudentElectivesPage({
                                         electives,
                                         locale,
                                         favouriteIds,
                                         onToggleFavourite,
                                     }: StudentElectivesPageProps) {
    const [query, setQuery] = useState('');
    const [activeType, setActiveType] = useState('all');

    const { tabs, visibleElectives } = useStudentElectivesPage({
        electives,
        query,
        favouriteIds,
        activeType,
    });

    useEffect(() => {
        const hasActiveTab = tabs.some((tab) => tab.value === activeType);

        if (!hasActiveTab) {
            setActiveType('all');
        }
    }, [tabs, activeType]);

    return (
        <main>
            <h1>Student electives</h1>

            <SearchInput
                id="student-electives-search"
                label="Search electives: "
                value={query}
                onChange={setQuery}
                placeholder="Type to search"
            />

            <StudentElectiveTypeTabs
                tabs={tabs}
                activeType={activeType}
                onChange={setActiveType}
            />

            <ElectivesList
                role="student"
                electives={visibleElectives}
                locale={locale}
                query={query}
                favouriteIds={favouriteIds}
                onToggleFavourite={onToggleFavourite}
                emptyText="No electives match the current student filters"
            />
        </main>
    );
}