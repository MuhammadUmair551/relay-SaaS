import { create }        from 'zustand';
import { persist }       from 'zustand/middleware';
import { MOCK_PROJECTS } from '../data/mockData';
import { getAvatarColor, getInitials } from '../lib/utils';

const DEFAULT_MILESTONES = [
  { id: 1, title: 'Project kickoff',   done: false },
  { id: 2, title: 'Design phase',      done: false },
  { id: 3, title: 'Development',       done: false },
  { id: 4, title: 'Review & feedback', done: false },
  { id: 5, title: 'Final delivery',    done: false },
];

function formatSize(bytes) {
  if (bytes < 1024)     return `${bytes} B`;
  if (bytes < 1048576)  return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export const useProjectStore = create(
  persist(
    (set, get) => ({
      projects: MOCK_PROJECTS,

      getByToken: (token) =>
        get().projects.find(p => p.token === token) ?? null,

      getById: (id) =>
        get().projects.find(p => p.id === id) ?? null,

      addProject: ({ name, clientName, clientEmail, budget, dueDate, description }) => {
        const newProject = {
          id:          `proj_${Date.now()}`,
          name,
          description: description ?? '',
          client: {
            name:     clientName,
            email:    clientEmail,
            initials: getInitials(clientName),
            color:    getAvatarColor(clientName),
          },
          status:     'active',
          progress:   0,
          budget:     Number(budget),
          paid:       0,
          dueDate,
          createdAt:  new Date().toISOString().split('T')[0],
          token:      `tkn_${Math.random().toString(36).slice(2, 8)}`,
          milestones: DEFAULT_MILESTONES.map(m => ({ ...m })),
          files:      [],
          feedback:   [],
        };
        set(state => ({ projects: [newProject, ...state.projects] }));
        return newProject.id;
      },

      deleteProject: (id) =>
        set(state => ({
          projects: state.projects.filter(p => p.id !== id),
        })),

      toggleMilestone: (projectId, milestoneId) =>
        set(state => ({
          projects: state.projects.map(p => {
            if (p.id !== projectId) return p;
            const updated  = p.milestones.map(m =>
              m.id === milestoneId ? { ...m, done: !m.done } : m
            );
            const done     = updated.filter(m => m.done).length;
            const progress = Math.round((done / updated.length) * 100);
            return { ...p, milestones: updated, progress };
          }),
        })),

      updateStatus: (id, status) =>
        set(state => ({
          projects: state.projects.map(p =>
            p.id === id ? { ...p, status } : p
          ),
        })),

      addFeedback: (projectId, { name, message }) =>
        set(state => ({
          projects: state.projects.map(p => {
            if (p.id !== projectId) return p;
            const newFeedback = {
              id:        Date.now(),
              name:      name.trim(),
              message:   message.trim(),
              createdAt: new Date().toISOString(),
            };
            return { ...p, feedback: [...(p.feedback ?? []), newFeedback] };
          }),
        })),

      addFile: (projectId, rawFile) =>
        set(state => ({
          projects: state.projects.map(p => {
            if (p.id !== projectId) return p;
            const newFile = {
              id:         Date.now(),
              name:       rawFile.name,
              size:       formatSize(rawFile.size),
              uploadedAt: new Date().toISOString().split('T')[0],
              url:        '#',
            };
            return { ...p, files: [...(p.files ?? []), newFile] };
          }),
        })),

      removeFile: (projectId, fileId) =>
        set(state => ({
          projects: state.projects.map(p => {
            if (p.id !== projectId) return p;
            return { ...p, files: p.files.filter(f => f.id !== fileId) };
          }),
        })),
    }),
    { name: 'relay-projects' }
  )
);