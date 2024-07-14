import { INode, NodeApiError } from 'n8n-workflow';

export interface CreateClientOptions {
    host: string;
    secret?: string;
    headers?: Record<string, string | (() => Promise<string>)>;
    getNode: () => INode; // Ensure getNode is part of the interface
}

export interface Job {
    uid: string;
    state: string;
    renderProgress?: number;
}

export interface Client {
    addJob(data: any): Promise<Job>;
    updateJob(id: string, data: any): Promise<any>;
    getJob(id: string): Promise<Job>;
    listJobs(): Promise<Job[]>;
    removeJob(id: string): Promise<void>;
    health(): Promise<any>;
}

export function createClient(options: CreateClientOptions): Client {
    const { host, secret, headers, getNode } = options;

    const wrappedFetch = async (path: string, fetchOptions: any) => {
        try {
            const response = await fetch(`${host}${path}`, fetchOptions);
            if (!response.ok) {
                throw await response.json();
            }
            return await response.json();
        } catch (error) {
            throw new NodeApiError(getNode(), error);
        }
    };

    const client: Client = {
        addJob(data: any): Promise<Job> {
            return wrappedFetch('/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(secret && { 'nexrender-secret': secret }),
                    ...(headers || {})
                },
                body: JSON.stringify(data),
            });
        },
        updateJob(id: string, data: any): Promise<any> {
            return wrappedFetch(`/jobs/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...(secret && { 'nexrender-secret': secret }),
                    ...(headers || {})
                },
                body: JSON.stringify(data),
            });
        },
        getJob(id: string): Promise<Job> {
            return wrappedFetch(`/jobs/${id}`, { method: 'GET' });
        },
        listJobs(): Promise<Job[]> {
            return wrappedFetch('/jobs', { method: 'GET' });
        },
        removeJob(id: string): Promise<void> {
            return wrappedFetch(`/jobs/${id}`, { method: 'DELETE' }).then(() => undefined);
        },
        health(): Promise<any> {
            return wrappedFetch('/health', { method: 'GET' });
        }
    };

    return client;
}
