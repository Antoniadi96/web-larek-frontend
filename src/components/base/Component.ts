import { IEvents } from './events';

// Абстрактный базовый класс для компонентов
export abstract class Component<T> {
    protected constructor(protected readonly container: HTMLElement) {
    }

    // Метод для переключения класса элемента
    toggleClass(element: HTMLElement, className: string, force?: boolean) {
        element.classList.toggle(className, force);
    }

    // Защищенный метод для установки текста элемента
    protected setText(element: HTMLElement, value: unknown) {
        if (element) {
            element.textContent = String(value);
        }
    }

    // Метод для установки состояния disabled у элемента
    setDisabled(element: HTMLElement, state: boolean) {
        if (element) {
            if (state) element.setAttribute('disabled', 'disabled');
            else element.removeAttribute('disabled');
        }
    }

    // Защищенный метод для скрытия элемента
    protected setHidden(element: HTMLElement) {
        element.style.display = 'none';
    }

    // Защищенный метод для показа элемента
    protected setVisible(element: HTMLElement) {
        element.style.removeProperty('display');
    }

    // Защищенный метод для установки атрибутов изображения
    protected setImage(element: HTMLImageElement, src: string, alt?: string) {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    // Метод рендеринга компонента с возможностью передачи данных
    render(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}
