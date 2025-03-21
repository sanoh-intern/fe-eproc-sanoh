export const roles = [
    { value: '1', label: 'Super Admin' },
    { value: '2', label: 'Purchasing' },
    { value: '3', label: 'Presdir' },
    { value: '4', label: 'Review' },
    { value: '5', label: 'Supplier' },
];


export const rolesName = [
    { value: 'super-admin', label: 'Super Admin' },
    { value: 'purchasing', label: 'Purchasing' },
    { value: 'presdir', label: 'Presdir' },
    { value: 'review', label: 'Review' },
    { value: 'supplier', label: 'Supplier' },
];

export const getRoleName = (role: string): string => {
    const foundRole = roles.find(r => r.value === role);
    return foundRole ? foundRole.label : 'Unknown Role';
};

export const getRoleValue = (role: string): string | null => {
    const foundRole = roles.find(r => r.label === role);
    return foundRole ? foundRole.value : null;
};

export const getRolePath = (role: string): string => {
    const foundRole = roles.find(r => r.value === role);
    return foundRole ? foundRole.label.toLowerCase().replace(/ /g, '-') : 'unknown-role';
};

export type RoleValue = '1' | '2' | '3' | '4' | '5' | null;