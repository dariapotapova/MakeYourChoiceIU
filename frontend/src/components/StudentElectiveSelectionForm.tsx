interface StudentElectiveSelectionFormProps {
    electiveType: string;
    requiredCount: number;
}

/**
 * Пока это заглушка-скелет.
 * Позже сюда подключится реальная форма выбора и submit.
 */
export function StudentElectiveSelectionForm({
                                                 electiveType,
                                                 requiredCount,
                                             }: StudentElectiveSelectionFormProps) {
    return (
        <section>
            <h3>Selection form</h3>
            <p>Elective type: {electiveType}</p>
            <p>You need to choose: {requiredCount}</p>
            <p>Last submit / form logic is not connected yet.</p>
        </section>
    );
}