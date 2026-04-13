import type { AdminSidebarItem } from './adminSidebar';

export type ElectiveEditorMode = 'add' | 'edit';

export interface ElectiveEditorDraft {
    electiveType: string;
    title: string;
    teacher: string;
    language: string;
    program: string;
    year: string;
    description: string;
}

export interface ElectiveEditorTypeOption {
    value: string;
    label: string;
}

export type ElectiveMutationStatus = 0 | 1;

/**
 * Удобный helper-type:
 * из sidebar items потом строим select options для формы.
 */
export type ElectiveEditorSidebarItems = AdminSidebarItem[];