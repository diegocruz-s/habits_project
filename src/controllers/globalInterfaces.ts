export interface HttpRequest<D> {
    body?: D
    params?: any
    headers?: any
}

export interface HttpResponse<T> {
    statusCode: number
    body: T
}

