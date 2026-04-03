export type Locale = 'en' | 'ru';

export const ELECTIVE_TEXT = {
    en: {
        meta: {
            teacher: 'Teacher',
            language: 'Language',
            program: 'Program',
            year: 'Year',
            prerequisite: 'Prerequisite',
            status: 'Status',
            type: 'Type',
            degreeYears: 'Degree years',
        },
        actions: {
            seeMore: 'See more',
            edit: 'Edit',
            archive: 'Archive',
            delete: 'Delete',
            addFav: 'Add to favourites',
            removeFav: 'Remove from favourites',
            openMenu: 'Open menu',
            close: 'Close',
        },
        hints: {
            matchInFullDescription: 'Match found in full description',
        },
    },
    ru: {
        meta: {
            teacher: 'Преподаватель',
            language: 'Язык',
            program: 'Программа',
            year: 'Курс',
            prerequisite: 'Пререквизиты',
            status: 'Статус',
            type: 'Тип',
            degreeYears: 'Годы обучения',
        },
        actions: {
            seeMore: 'Подробнее',
            edit: 'Редактировать',
            archive: 'Архивировать',
            delete: 'Удалить',
            addFav: 'В избранное',
            removeFav: 'Убрать из избранного',
            openMenu: 'Открыть меню',
            close: 'Закрыть',
        },
        hints: {
            matchInFullDescription: 'Совпадение найдено в полном описании',
        },
    },
} as const;