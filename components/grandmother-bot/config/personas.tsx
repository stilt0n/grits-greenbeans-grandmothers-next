import { PersonaOptions } from '@nlux/react';
import { UserIcon } from '@/components/icons';

export const defaultPersonas: PersonaOptions = {
  assistant: {
    name: 'grandmother_bot',
    avatar: <UserIcon />,
    tagline: 'Cooking since before you were born',
  },
  user: {
    name: 'you',
    avatar: <UserIcon />,
  },
};
