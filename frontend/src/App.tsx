import { useMemo, useState } from 'react';
import { StudentElectiveCard } from './components/StudentElectiveCard';
import { AdminElectiveCard } from './components/AdminElectiveCard';
import { useElectives } from './hooks/useElectives';
import type { Elective } from './types/elective';

function App() {
    const { electives, loading, error, refetch } = useElectives();

    /**
     * Локальный query для теста поиска и подсветки.
     * Пока просто вручную вводим строку в input.
     */
    const [query, setQuery] = useState('');

    /**
     * Локальное "избранное" для student-теста.
     * Храним id курсов в массиве.
     *
     * Потом это можно заменить на:
     * - API
     * - global state
     * - отдельный хук
     */
    const [favouriteIds, setFavouriteIds] = useState<number[]>([]);

    function handleToggleFavourite(elective: Elective) {
        setFavouriteIds((prev) => {
            const exists = prev.includes(elective.id);

            if (exists) {
                return prev.filter((id) => id !== elective.id);
            }

            return [...prev, elective.id];
        });
    }

    /**
     * Для удобства быстрый lookup:
     * находится ли конкретный курс в избранном.
     */
    const favouriteSet = useMemo(() => new Set(favouriteIds), [favouriteIds]);

    function handleEdit(elective: Elective) {
        console.log('edit elective', elective);
    }

    function handleArchive(elective: Elective) {
        console.log('archive elective', elective);
    }

    function handleDelete(elective: Elective) {
        console.log('delete elective', elective);
    }

    if (loading) {
        return <div>Loading electives...</div>;
    }

    if (error) {
        return (
            <div>
                <p>Failed to load electives: {error}</p>
                <button type="button" onClick={refetch}>
                    Retry
                </button>
            </div>
        );
    }
    console.log(electives[0]);
    return (
        <main style={{ maxWidth: 980, margin: '0 auto', padding: '24px' }}>
            <h1>Electives test page</h1>

            <div style={{ marginBottom: 20 }}>
                <label htmlFor="query-input">Search query: </label>
                <input
                    id="query-input"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Type to test highlight"
                />
            </div>

            <hr />

            <section style={{ display: 'grid', gap: 16, marginTop: 24 }}>
                <h2>Student cards</h2>

                {electives.map((elective) => (
                    <StudentElectiveCard
                        key={`student-${elective.id}`}
                        elective={elective}
                        locale="en"
                        query={query}
                        isFavourite={favouriteSet.has(elective.id)}
                        onToggleFavourite={handleToggleFavourite}
                    />
                ))}
            </section>

            <hr style={{ margin: '32px 0' }} />

            <section style={{ display: 'grid', gap: 16 }}>
                <h2>Admin cards</h2>

                {electives.map((elective) => (
                    <AdminElectiveCard
                        key={`admin-${elective.id}`}
                        elective={elective}
                        locale="en"
                        query={query}
                        onEdit={handleEdit}
                        onArchive={handleArchive}
                        onDelete={handleDelete}
                    />
                ))}
            </section>
        </main>
    );
}

export default App;