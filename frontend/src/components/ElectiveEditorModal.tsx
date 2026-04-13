import { ElectiveModal } from './ElectiveModal';
import { ElectiveEditorForm } from './ElectiveEditorForm';
import type {
    ElectiveEditorDraft,
    ElectiveEditorMode,
    ElectiveEditorTypeOption,
} from '../types/electiveEditor';
import { isElectiveDraftComplete } from '../utils/electiveEditor';
import buttonStyles from '../styles/button.module.css';

interface ElectiveEditorModalProps {
    open: boolean;
    mode: ElectiveEditorMode;
    draft: ElectiveEditorDraft;
    typeOptions: ElectiveEditorTypeOption[];
    onClose: () => void;
    onChangeField: <K extends keyof ElectiveEditorDraft>(
        key: K,
        value: ElectiveEditorDraft[K]
    ) => void;
    onSaveDraft: () => void;
    onSavePublished: () => void;
    saving?: boolean;
    locale: 'en' | 'ru';
}

const TEXT = {
    en: {
        addTitle: 'Add elective',
        editTitle: 'Edit elective',
        cancel: 'Cancel',
        saveDraft: 'Save as draft',
        save: 'Save',
        hint: 'Description supports Markdown (e.g., **bold**, _italic_, lists).',
        fields: {
            type: 'Type',
            title: 'Title',
            teacher: 'Teacher',
            language: 'Language',
            program: 'Program',
            year: 'Year',
            description: 'Description',
        },
    },
    ru: {
        addTitle: 'Добавить электив',
        editTitle: 'Редактировать электив',
        cancel: 'Отмена',
        saveDraft: 'Сохранить как черновик',
        save: 'Сохранить',
        hint: 'В описании можно использовать Markdown (например, **жирный**, _курсив_, списки).',
        fields: {
            type: 'Тип',
            title: 'Название',
            teacher: 'Преподаватель',
            language: 'Язык',
            program: 'Программа',
            year: 'Курс',
            description: 'Описание',
        },
    },
} as const;

export function ElectiveEditorModal({
                                        open,
                                        mode,
                                        draft,
                                        typeOptions,
                                        onClose,
                                        onChangeField,
                                        onSaveDraft,
                                        onSavePublished,
                                        saving = false,
                                        locale,
                                    }: ElectiveEditorModalProps) {
    const text = TEXT[locale];
    const isComplete = isElectiveDraftComplete(draft);

    return (
        <ElectiveModal
            open={open}
            title={mode === 'add' ? text.addTitle : text.editTitle}
            onClose={onClose}
            footer={
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                        type="button"
                        onClick={onClose}
                        className={`${buttonStyles.button} ${buttonStyles.sizeMd} ${buttonStyles.variantGhost}`}
                        disabled={saving}
                    >
                        {text.cancel}
                    </button>

                    <button
                        type="button"
                        onClick={onSaveDraft}
                        className={`${buttonStyles.button} ${buttonStyles.sizeMd} ${buttonStyles.variantGhost}`}
                        disabled={saving}
                    >
                        {text.saveDraft}
                    </button>

                    <button
                        type="button"
                        onClick={onSavePublished}
                        className={`${buttonStyles.button} ${buttonStyles.sizeMd} ${buttonStyles.variantPrimary}`}
                        disabled={!isComplete || saving}
                    >
                        {text.save}
                    </button>
                </div>
            }
        >
            <ElectiveEditorForm
                draft={draft}
                typeOptions={typeOptions}
                text={{
                    fields: text.fields,
                    hint: text.hint,
                }}
                onChange={onChangeField}
            />
        </ElectiveModal>
    );
}