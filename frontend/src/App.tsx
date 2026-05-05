import { useMemo, useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { useAuth } from './hooks/useAuth';
import { StudentElectivesPage } from './pages/StudentElectivesPage';
import { AdminElectivesPage } from './pages/AdminElectivesPage';
import { AppShell } from './components/AppShell';
import {
    createElective,
    archiveElective,
    deleteElective,
    updateElective,
} from './api/electives';
import type { Elective } from './types/elective';
import type { UpdateElectivePayload } from './api/electives';
import { mapStudentDataToElectives } from './utils/authElectives';

function App() {
    const auth = useAuth();

    const [favouriteIds, setFavouriteIds] = useState<number[]>([]);
    const [query, setQuery] = useState('');
    const [actionError, setActionError] = useState<string | null>(null);
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

    const studentElectives = useMemo(() => {
        if (!auth.authResponse) {
            return [];
        }

        if (auth.authResponse.role === 'admin') {
            return [];
        }

        return mapStudentDataToElectives(auth.authResponse.student_data);
    }, [auth.authResponse]);

    function handleToggleFavourite(elective: Elective) {
        setFavouriteIds((prev) => {
            const exists = prev.includes(elective.id);
            return exists ? prev.filter((id) => id !== elective.id) : [...prev, elective.id];
        });
    }

    function handleLogout() {
        auth.logout();
        setQuery('');
        setFavouriteIds([]);
        setActionError(null);
        setActionLoadingId(null);
    }

    async function handleCreateElective(payload: UpdateElectivePayload) {
        try {
            setActionError(null);
            setActionLoadingId(-1);

            await createElective(payload);

            /**
             * Пока сервер create endpoint возвращает не объект электива, а только success/error,
             * не можем корректно локально upsert-нуть новый элемент по данным ответа.
             *
             * Поэтому после create лучше сделать повторный login,
             * чтобы заново получить актуальный all_electives.
             *
             * Если позже backend начнёт возвращать созданный elective object,
             * можно будет заменить это на auth.upsertAdminElective(...)
             */
            if (auth.user?.email) {
                await auth.login(auth.user.email);
            }
        } catch (err) {
            setActionError(err instanceof Error ? err.message : 'Failed to create elective');
        } finally {
            setActionLoadingId(null);
        }
    }

    async function handleUpdateElective(id: number, payload: UpdateElectivePayload) {
        try {
            setActionError(null);
            setActionLoadingId(id);

            await updateElective(id, payload);

            /**
             * PATCH по вашему контракту тоже возвращает только success/error,
             * а не полный updated elective.
             * Поэтому безопаснее заново refresh-нуть session через login.
             */
            if (auth.user?.email) {
                await auth.login(auth.user.email);
            }
        } catch (err) {
            setActionError(err instanceof Error ? err.message : 'Failed to update elective');
        } finally {
            setActionLoadingId(null);
        }
    }

    async function handleArchive(elective: Elective) {
        try {
            setActionError(null);
            setActionLoadingId(elective.id);

            await archiveElective(elective.id);

            if (auth.user?.email) {
                await auth.login(auth.user.email);
            }
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

            auth.removeAdminElective(elective.id);
        } catch (err) {
            setActionError(err instanceof Error ? err.message : 'Failed to delete elective');
        } finally {
            setActionLoadingId(null);
        }
    }

    if (!auth.authResponse || !auth.user || !auth.effectiveMode) {
        return (
            <LoginPage
                loading={auth.loading}
                error={auth.error}
                onSubmit={auth.login}
            />
        );
    }

    const isAdminMode = auth.effectiveMode === 'admin';
    const isStudentMode = auth.effectiveMode === 'student';

    return (
        <AppShell
            user={auth.user}
            searchValue={query}
            onSearchChange={setQuery}
            onLogout={handleLogout}
            onSwitchToStudent={auth.user.role === 'admin-student' ? auth.switchToStudent : undefined}
        >
            {actionError ? <p>Action failed: {actionError}</p> : null}
            {actionLoadingId !== null ? <p>Processing elective id: {actionLoadingId}</p> : null}

            {isStudentMode ? (
                <StudentElectivesPage
                    electives={studentElectives}
                    locale="en"
                    favouriteIds={favouriteIds}
                    availableElectiveTypes={auth.studentData?.availableElectiveTypes ?? []}
                    query={query}
                    onToggleFavourite={handleToggleFavourite}
                />
            ) : null}

            {isAdminMode ? (
                <AdminElectivesPage
                    electives={auth.adminElectives}
                    locale="en"
                    query={query}
                    onCreateElective={handleCreateElective}
                    onUpdateElective={handleUpdateElective}
                    onArchive={handleArchive}
                    onDelete={handleDelete}
                />
            ) : null}
        </AppShell>
    );
}

export default App;