export interface Role {
  id: number;
  name: string;
}

export const roles: Role[] = [
  { id: 1, name: 'superadmin' },
  { id: 2, name: 'administrator' }
];

export let nextRoleId = 3;
