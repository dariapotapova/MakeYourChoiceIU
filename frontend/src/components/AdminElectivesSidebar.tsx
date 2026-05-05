import type { AdminSidebarItem } from '../types/adminSidebar';
import { AdminSidebarNav } from './AdminSidebarNav';
import buttonStyles from '../styles/button.module.css';
import styles from '../styles/adminElectivesSidebar.module.css';

interface AdminElectivesSidebarProps {
    items: AdminSidebarItem[];
    isResetActive: boolean;
    selectedItemIds: string[];
    onToggle: (item: AdminSidebarItem) => void;
    addLabel: string;
    onAdd: () => void;
}

/**
 * Sidebar админа:
 * - контейнер
 * - верхняя кнопка добавления электива
 * - список категорий
 *
 * Ничего не знает про список карточек, модалки и API.
 */
export function AdminElectivesSidebar({
                                          items,
                                          isResetActive,
                                          selectedItemIds,
                                          onToggle,
                                          addLabel,
                                          onAdd,
                                      }: AdminElectivesSidebarProps) {
    return (
        <aside className={styles.sidebar}>
            <button
                type="button"
                onClick={onAdd}
                className={[
                    buttonStyles.button,
                    buttonStyles.sizeMd,
                    buttonStyles.variantPrimary,
                    styles.addButton,
                ].join(' ')}
            >
                {addLabel}
            </button>

            <AdminSidebarNav
                items={items}
                isResetActive={isResetActive}
                selectedItemIds={selectedItemIds}
                onToggle={onToggle}
            />
        </aside>
    );
}
