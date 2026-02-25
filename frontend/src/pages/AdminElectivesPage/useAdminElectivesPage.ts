// src/pages/admin/AdminElectivesPage/useAdminElectives.ts
import { useEffect, useMemo, useState } from 'react';
import { useElectiveTypesTabs } from '../../hooks/useElectiveTypesTabs';
import { useLocalStorage } from '../../hooks/useLocalStorage';
// Поменяй импорт под ваш мок/апи:
import { getElectives } from '../..//api/electives';

export type ElectiveType = 'tech' | 'hum' | 'math' | 'custom';

export type Elective = {
    id: string;
    title: string;
    teacher: string;
    language: string;
    program: string;
    year: number;
    description: string;
    // admin-only
    type: ElectiveType;
    archived?: boolean;
};

export type Draft = {
    type: ElectiveType;
    title: string;
    teacher: string;
    language: string;
    program: string;
    year: number;
    description: string;
};

type Params = {
    groupId: string;
    locale: 'en' | 'ru';
};

const DEFAULT_TYPES: ElectiveType[] = ['tech', 'hum', 'math', 'custom'];

function uid() {
    return `elc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useAdminElectives({ groupId, locale }: Params) {
    const { tabs } = useElectiveTypesTabs(groupId, locale);

    const storageKey = `adminElectives:${groupId}`;
    const [store, setStore] = useLocalStorage<Elective[]>(storageKey, []);

    const [activeType, setActiveType] = useState<ElectiveType | 'all'>('all');
    const [query, setQuery] = useState('');

    // initial load (only if empty)
    useEffect(() => {
        let cancelled = false;
        if (store.length > 0) return;

        (async () => {
            const types: ElectiveType[] =
                tabs?.length ? (tabs.map((t) => t.type) as ElectiveType[]) : DEFAULT_TYPES;

            const perType = await Promise.all(types.map((type) => getElectives({ groupId, type })));

            const merged: Elective[] = perType.flatMap((arr, idx) =>
                arr.map((e: any) => ({
                    ...e,
                    type: types[idx],
                    archived: false,
                }))
            );

            if (!cancelled) setStore(merged);
        })();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupId, tabs?.length]);

    const typesForSidebar = useMemo(() => {
        return [
            { type: 'all' as const, title: locale === 'ru' ? 'Все элективы' : 'All electives' },
            ...(tabs?.length
                ? tabs.map((t) => ({ type: t.type as ElectiveType, title: t.title }))
                : DEFAULT_TYPES.map((t) => ({ type: t, title: t.toUpperCase() }))),
        ];
    }, [tabs, locale]);

    const filtered = useMemo(() => {
        const base = activeType === 'all' ? store : store.filter((e) => e.type === activeType);
        const q = query.trim().toLowerCase();
        if (!q) return base;
        return base.filter((e) => `${e.title} ${e.teacher} ${e.description}`.toLowerCase().includes(q));
    }, [store, activeType, query]);

    // CRUD
    const addElective = (draft: Draft) => {
        const item: Elective = {
            id: uid(),
            type: draft.type,
            title: draft.title.trim(),
            teacher: draft.teacher.trim(),
            language: draft.language.trim(),
            program: draft.program.trim(),
            year: Number(draft.year) || 1,
            description: draft.description,
            archived: false,
        };
        setStore((prev) => [item, ...prev]);
    };

    const editElective = (id: string, draft: Draft) => {
        setStore((prev) =>
            prev.map((e) =>
                e.id === id
                    ? {
                        ...e,
                        type: draft.type,
                        title: draft.title.trim(),
                        teacher: draft.teacher.trim(),
                        language: draft.language.trim(),
                        program: draft.program.trim(),
                        year: Number(draft.year) || 1,
                        description: draft.description,
                    }
                    : e
            )
        );
    };

    const archiveElective = (id: string) => {
        setStore((prev) => prev.map((e) => (e.id === id ? { ...e, archived: true } : e)));
    };

    const removeElective = (id: string) => {
        setStore((prev) => prev.filter((e) => e.id !== id));
    };

    const getById = (id: string) => store.find((e) => e.id === id) ?? null;

    return {
        tabs: typesForSidebar,
        activeType,
        setActiveType,
        query,
        setQuery,
        items: filtered,
        addElective,
        editElective,
        archiveElective,
        removeElective,
        getById,
    };
}