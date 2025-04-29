import { IEvents } from './events';

// Type guard для проверки, является ли объект экземпляром Model
// Используется для узкого определения типа в условных конструкциях
export const isModel = (obj: unknown): obj is Model<any> => {
    return obj instanceof Model;
};

// Абстрактный базовый класс для создания моделей данных
// Использует дженерик T для типизации данных модели
export abstract class Model<T> {
    constructor(data: Partial<T>, protected events: IEvents) {
        Object.assign(this, data);
    }

    // Метод для отправки событий об изменениях модели
    // Принимает название события и опциональный payload
    emitChanges(event: string, payload?: object) {
        this.events.emit(event, payload ?? {});
    }
}
