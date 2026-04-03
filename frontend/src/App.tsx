import { useState } from 'react';
import { useElectives } from './hooks/useElectives';
import { StudentElectivesPage } from './pages/StudentElectivesPage';
import { AdminElectivesPage } from './pages/AdminElectivesPage';
import { archiveElective, deleteElective, updateElective } from './api/electives';
import type { Elective } from './types/elective';

function App() {
    const { electives, loading, error, refetch } = useElectives();

    const [mode, setMode] = useState<'student' | 'admin'>('student');
    const [favouriteIds, setFavouriteIds] = useState<number[]>([]);
    const [actionError, setActionError] = useState<string | null>(null);
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

    function handleToggleFavourite(elective: Elective) {
        setFavouriteIds((prev) => {
            const exists = prev.includes(elective.id);

            if (exists) {
                return prev.filter((id) => id !== elective.id);
            }

            return [...prev, elective.id];
        });
    }

    async function handleArchive(elective: Elective) {
        try {
            setActionError(null);
            setActionLoadingId(elective.id);

            await archiveElective(elective.id);
            await refetch();
        } catch (err) {
            setActionError(err instanceof Error ? err.message : 'Failed to archive elective');
        } finally {
            setActionLoadingId(null);
        }
    }

    async function handleDelete(elective: Elective) {
        const confirmed = window.confirm(
            `Delete elective "${elective.name}"? This action cannot be undone.`
        );

        if (!confirmed) {
            return;
        }

        try {
            setActionError(null);
            setActionLoadingId(elective.id);

            await deleteElective(elective.id);
            await refetch();
        } catch (err) {
            setActionError(err instanceof Error ? err.message : 'Failed to delete elective');
        } finally {
            setActionLoadingId(null);
        }
    }

    async function handleEdit(elective: Elective) {
        const nextName = window.prompt('Edit elective name', elective.name);
        if (nextName === null) {
            return;
        }

        const nextInstructor = window.prompt('Edit instructor', elective.instructor);
        if (nextInstructor === null) {
            return;
        }

        const nextDescription = window.prompt('Edit description', elective.description);
        if (nextDescription === null) {
            return;
        }

        try {
            setActionError(null);
            setActionLoadingId(elective.id);

            await updateElective(elective.id, {
                name: nextName,
                instructor: nextInstructor,
                description: nextDescription,
            });

            await refetch();
        } catch (err) {
            setActionError(err instanceof Error ? err.message : 'Failed to update elective');
        } finally {
            setActionLoadingId(null);
        }
    }

    if (loading) {
        return <div>Loading electives...</div>;
    }

    if (error) {
        return (
            <main>
                <h1>Electives test</h1>
                <p>Failed to load electives: {error}</p>
                <button type="button" onClick={refetch}>
                    Retry
                </button>
            </main>
        );
    }

    return (
        <main>
            <div>
                <button
                    type="button"
                    onClick={() => setMode('student')}
                    aria-pressed={mode === 'student'}
                >
                    Student mode
                </button>

                <button
                    type="button"
                    onClick={() => setMode('admin')}
                    aria-pressed={mode === 'admin'}
                >
                    Admin mode
                </button>
            </div>

            {actionError ? <p>Action failed: {actionError}</p> : null}
            {actionLoadingId !== null ? <p>Processing elective id: {actionLoadingId}</p> : null}

            {mode === 'student' ? (
                <StudentElectivesPage
                    electives={electives}
                    locale="en"
                    favouriteIds={favouriteIds}
                    onToggleFavourite={handleToggleFavourite}
                />
            ) : (
                <AdminElectivesPage
                    electives={electives}
                    locale="en"
                    onEdit={handleEdit}
                    onArchive={handleArchive}
                    onDelete={handleDelete}
                />
            )}
        </main>
    );
}

export default App;