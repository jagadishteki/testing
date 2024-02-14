export interface Menu{
    id?: number;
    name?: string;
    icon_url?: string;
    url?: string;
    childern?: Menu[];
    isCollapsible: boolean;
}