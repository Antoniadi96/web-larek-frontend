// Интерфейс для работы с API, импортируемый из локального файла типов
import { IApi } from '../../types';

// Тип для ответа API, который содержит общее количество элементов и массив самих элементов
export type ApiListResponse<Type> = {
    total: number;
    items: Type[];
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Основной класс для работы с API, реализующий интерфейс IApi
export class Api implements IApi {
    constructor(readonly baseUrl: string, protected options: RequestInit = {}) {
        this.baseUrl = baseUrl;
        this.options = {
            headers: {
                'Content-Type': 'application/json',
                ...((options.headers as object) ?? {}),
            },
        };
    }

    // Защищенный метод для обработки ответа от сервера
    protected handleResponse<T>(response: Response): Promise<T> {
        if (response.ok) return response.json();
        else
            return response
                .json()
                .then((data) => Promise.reject(data.error ?? response.statusText));
    }

    // Метод GET-запроса к API
    get<T>(uri: string) {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method: 'GET',
        }).then(this.handleResponse<T>);
    }

    // Универсальный метод для POST/PUT/DELETE запросов
    post<T>(uri: string, data: object, method: ApiPostMethods = 'POST') {
        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data),
        }).then(this.handleResponse<T>);
    }
}
