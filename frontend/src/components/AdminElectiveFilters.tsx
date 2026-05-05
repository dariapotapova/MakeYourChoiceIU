import type { AdminElectiveFilters } from '../types/electivesList';

interface AdminElectiveFiltersProps {
    filters: AdminElectiveFilters;
    filterOptions: {
        electiveLanguages: string[];
        degreeYears: string[];
        electiveTypes: string[];
        programLanguages: string[];
        statuses: string[];
    };
    onChange: <K extends keyof AdminElectiveFilters>(
        key: K,
        value: AdminElectiveFilters[K]
    ) => void;
    onReset: () => void;
}

/**
 * Отдельный UI-блок admin filters.
 * Не хранит state внутри себя.
 * Получает:
 * - текущее значение фильтров
 * - доступные options
 * - callbacks на изменение и reset
 */
export function AdminElectiveFilters({
                                         filters,
                                         filterOptions,
                                         onChange,
                                         onReset,
                                     }: AdminElectiveFiltersProps) {
    return (
        <div>
            <label>
                Learning language:
                <select
                    value={filters.electiveLanguage}
                    onChange={(event) => onChange('electiveLanguage', event.target.value)}
                >
                    <option value="">All</option>
                    {filterOptions.electiveLanguages.map((value) => (
                        <option key={`language-${value}`} value={value}>
                            {value}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                Degree year:
                <select
                    value={filters.degreeYear}
                    onChange={(event) => onChange('degreeYear', event.target.value)}
                >
                    <option value="">All</option>
                    {filterOptions.degreeYears.map((value) => (
                        <option key={`degree-${value}`} value={value}>
                            {value}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                Elective type:
                <select
                    value={filters.electiveType}
                    onChange={(event) => onChange('electiveType', event.target.value)}
                >
                    <option value="">All</option>
                    {filterOptions.electiveTypes.map((value) => (
                        <option key={`type-${value}`} value={value}>
                            {value}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                Program language:
                <select
                    value={filters.programLanguage}
                    onChange={(event) => onChange('programLanguage', event.target.value)}
                >
                    <option value="">All</option>
                    {filterOptions.programLanguages.map((value) => (
                        <option key={`program-${value}`} value={value}>
                            {value}
                        </option>
                    ))}
                </select>
            </label>

            <label>
                Status:
                <select
                    value={filters.status}
                    onChange={(event) => onChange('status', event.target.value)}
                >
                    <option value="">All</option>
                    {filterOptions.statuses.map((value) => (
                        <option key={`status-${value}`} value={value}>
                            {value}
                        </option>
                    ))}
                </select>
            </label>

            <button type="button" onClick={onReset}>
                Reset filters
            </button>
        </div>
    );
}