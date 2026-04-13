import type { ElectiveEditorDraft, ElectiveEditorTypeOption } from '../types/electiveEditor';
import styles from '../styles/electiveEditorForm.module.css';

interface ElectiveEditorFormText {
    fields: {
        type: string;
        title: string;
        teacher: string;
        language: string;
        program: string;
        year: string;
        description: string;
    };
    hint: string;
}

interface ElectiveEditorFormProps {
    draft: ElectiveEditorDraft;
    typeOptions: ElectiveEditorTypeOption[];
    text: ElectiveEditorFormText;
    onChange: <K extends keyof ElectiveEditorDraft>(
        key: K,
        value: ElectiveEditorDraft[K]
    ) => void;
}

/**
 * Только форма.
 * Все данные и изменение полей приходят сверху.
 */
export function ElectiveEditorForm({
                                       draft,
                                       typeOptions,
                                       text,
                                       onChange,
                                   }: ElectiveEditorFormProps) {
    return (
        <div className={styles.form}>
            <label className={styles.field}>
                <span>{text.fields.type}</span>
                <select
                    value={draft.electiveType}
                    onChange={(event) => onChange('electiveType', event.target.value)}
                >
                    <option value="">Select type</option>
                    {typeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </label>

            <label className={styles.field}>
                <span>{text.fields.title}</span>
                <input
                    value={draft.title}
                    onChange={(event) => onChange('title', event.target.value)}
                />
            </label>

            <label className={styles.field}>
                <span>{text.fields.teacher}</span>
                <input
                    value={draft.teacher}
                    onChange={(event) => onChange('teacher', event.target.value)}
                />
            </label>

            <div className={styles.row}>
                <label className={styles.field}>
                    <span>{text.fields.language}</span>
                    <input
                        value={draft.language}
                        onChange={(event) => onChange('language', event.target.value)}
                    />
                </label>

                <label className={styles.field}>
                    <span>{text.fields.year}</span>
                    <input
                        value={draft.year}
                        onChange={(event) => onChange('year', event.target.value)}
                    />
                </label>
            </div>

            <label className={styles.field}>
                <span>{text.fields.program}</span>
                <input
                    value={draft.program}
                    onChange={(event) => onChange('program', event.target.value)}
                />
            </label>

            <label className={styles.field}>
                <span>{text.fields.description}</span>
                <textarea
                    rows={10}
                    value={draft.description}
                    onChange={(event) => onChange('description', event.target.value)}
                    placeholder="Write description in Markdown..."
                />
                <div className={styles.hint}>{text.hint}</div>
            </label>
        </div>
    );
}