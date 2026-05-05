import { useCallback, useMemo, useState } from 'react';
import type { AuthResponse } from '../types/auth';
import type { Elective } from '../types/elective';
import { mapStudentDataToElectives } from '../utils/authElectives';

interface UseStudentElectivesFlowParams {
    authResponse: AuthResponse | null;
}

interface UseStudentElectivesFlowResult {
    studentElectives: Elective[];
    favouriteIds: number[];
    handleToggleFavourite: (elective: Elective) => void;
    resetStudentState: () => void;
}

export function useStudentElectivesFlow({
    authResponse,
}: UseStudentElectivesFlowParams): UseStudentElectivesFlowResult {
    const [favouriteIds, setFavouriteIds] = useState<number[]>([]);

    const studentElectives = useMemo(() => {
        if (!authResponse || authResponse.role === 'admin') {
            return [];
        }

        return mapStudentDataToElectives(authResponse.student_data);
    }, [authResponse]);

    const handleToggleFavourite = useCallback((elective: Elective) => {
        setFavouriteIds((prev) => {
            const exists = prev.includes(elective.id);
            return exists ? prev.filter((id) => id !== elective.id) : [...prev, elective.id];
        });
    }, []);

    const resetStudentState = useCallback(() => {
        setFavouriteIds([]);
    }, []);

    return {
        studentElectives,
        favouriteIds,
        handleToggleFavourite,
        resetStudentState,
    };
}
