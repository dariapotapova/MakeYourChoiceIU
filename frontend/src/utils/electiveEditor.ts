import type { Elective } from '../types/elective';
import type {
    ElectiveEditorDraft,
    ElectiveEditorTypeOption,
    ElectiveMutationStatus,
} from '../types/electiveEditor';
import type { AdminSidebarItem } from '../types/adminSidebar';
import type { UpdateElectivePayload } from '../api/electives';

/**
 * Пустой draft для add flow.
 * Если есть prefilledType, подставляем его в type field.
 */
export function createEmptyElectiveDraft(prefilledType = ''): ElectiveEditorDraft {
    return {
        electiveType: prefilledType,
        title: '',
        teacher: '',
        language: '',
        program: '',
        year: '',
        description: '',
    };
}

/**
 * Маппим существующий Elective в draft редактора.
 * Это нужно для режима edit.
 */
export function mapElectiveToEditorDraft(elective: Elective): ElectiveEditorDraft {
    return {
        electiveType: elective.electiveType,
        title: elective.name,
        teacher: elective.instructor,
        language: elective.electiveLanguage,
        program: elective.programLanguage,
        year: elective.degreeYear[0] ?? '',
        description: elective.description,
    };
}

/**
 * Все поля, которые считаем обязательными для полноценной публикации.
 * Если хотя бы одно пустое -> Save disabled, Save as draft enabled.
 */
export function isElectiveDraftComplete(draft: ElectiveEditorDraft): boolean {
    return (
        draft.electiveType.trim() !== '' &&
        draft.title.trim() !== '' &&
        draft.teacher.trim() !== '' &&
        draft.language.trim() !== '' &&
        draft.program.trim() !== '' &&
        draft.year.trim() !== '' &&
        draft.description.trim() !== ''
    );
}

/**
 * Строим payload для create/update.
 *
 * Важно:
 * - фронт работает с удобным draft
 * - бэк ждёт snake_case и свои имена полей
 */
export function mapDraftToElectivePayload(
    draft: ElectiveEditorDraft,
    status: ElectiveMutationStatus
): UpdateElectivePayload {
    return {
        name: draft.title.trim(),
        instructor: draft.teacher.trim(),
        description: draft.description.trim(),
        elective_language: draft.language.trim(),
        elective_type: draft.electiveType.trim(),
        program_language: draft.program.trim(),
        degree_year: draft.year.trim() ? [draft.year.trim()] : [],
        status,
    };
}

/**
 * Sidebar items -> options для select в редакторе.
 * Исключаем 'all', потому что это не реальный тип электива.
 */
export function mapSidebarItemsToEditorTypeOptions(
    items: AdminSidebarItem[]
): ElectiveEditorTypeOption[] {
    return items
        .filter((item) => item.type !== 'all')
        .map((item) => ({
            value: String(item.type),
            label: item.title,
        }));
}