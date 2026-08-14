export interface SpaceEntry {
    id: string;
    location: string;
    name: string;
    photoUrl?: string;
    [key: string]: any; // Allow additional properties with any key and value type
}