import { EventEmitter } from 'events'; // Import EventEmitter

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

// Declare the createClient function
export function createClient(options: CreateClientOptions): Client {
    const { host, secret, polling, headers, name } = options;

    const client: Client = {
        addJob(data: any): EventEmitter {
            const emitter = new EventEmitter();
            // Implementation logic for addJob
            return emitter;
        },
        updateJob(id: string, data: any): Promise<any> {
            // Implementation logic for updateJob
            return Promise.resolve({});
        },
        getJob(id: string): Promise<Job> {
            // Implementation logic for getJob
            return Promise.resolve({ uid: id, state: 'example' });
        },
        listJobs(): Promise<Job[]> {
            // Implementation logic for listJobs
            return Promise.resolve([]);
        },
        removeJob(id: string): Promise<void> {
            // Implementation logic for removeJob
            return Promise.resolve();
        },
        health(): Promise<any> {
            // Implementation logic for health
            return Promise.resolve({});
        }
    };

    return client;
}
