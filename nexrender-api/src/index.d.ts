// nexrender-api/src/index.d.ts

export interface CreateClientOptions {
    host: string;
    secret?: string;
    polling?: number;
    headers?: Record<string, string | (() => Promise<string>)>;
    name?: string;
}

export interface Job {
    uid: string;
    state: string;
    renderProgress?: number;
}

export interface Client {
    addJob(data: any): EventEmitter;
    updateJob(id: string, data: any): Promise<any>;
    getJob(id: string): Promise<Job>;
    listJobs(): Promise<Job[]>;
    removeJob(id: string): Promise<void>;
    health(): Promise<any>;
}

export function createClient(options: CreateClientOptions): Client;
