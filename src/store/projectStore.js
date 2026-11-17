import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { parseAlightXml } from '../engine/parser/XmlSceneParser';

function extractXmlSceneMeta(xml, fallbackName = 'Proyek Alight') {
  if (!xml || typeof xml !== 'string') {
    return { name: fallbackName, width: 720, height: 1280, fps: 30, totalTime: 5000 };
  }
  const mW = xml.match(/width="(\d+)"/i);
  const mH = xml.match(/height="(\d+)"/i);
  const mF = xml.match(/fps="(\d+)"/i);
  const mT = xml.match(/totalTime="(\d+)"/i);
  const mTitle = xml.match(/title="([^"]+)"/i) || xml.match(/name="([^"]+)"/i);

  return {
    name: mTitle ? mTitle[1] : fallbackName,
    width: mW ? parseInt(mW[1], 10) : 720,
    height: mH ? parseInt(mH[1], 10) : 1280,
    fps: mF ? parseInt(mF[1], 10) : 30,
    totalTime: mT ? parseInt(mT[1], 10) : 5000
  };
}

const normalizeAlightUrl = (p) => {
  if (!p) return '';
  const s = p.trim();
  return /^https?:\/\//i.test(s) || (s.length >= 25 && !s.includes('.')) ? s : `https://alight.link/${s}`;
};

const safeStorage = createJSONStorage(() => {
  if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
});

export const useProjectStore = create(
  persist(
    (set, get) => ({
      projects: [],
      activeProject: null,
      isLoading: false,
      error: null,
      lastSyncedAt: null,

      fetchProjects: async () => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch('/api/projects');
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const list = Array.isArray(data?.projects) ? data.projects : [];
          set({ projects: list, lastSyncedAt: Date.now(), isLoading: false });
          return list;
        } catch (err) {
          set({ error: err.message || 'Gagal memuat proyek', isLoading: false });
          return get().projects;
        }
      },

      fetchProjectById: async (id, password = null) => {
        if (id === 'default') {
          try {
            const res = await fetch('/preset/Beraksi.xml');
            if (res.ok) {
              const xml = await res.text();
              const scene = parseAlightXml(xml, 'Beraksi.xml');
              return {
                id: 'default',
                name: scene.title || '#Ryzenzkidss: Beraksi',
                width: scene.width || 720,
                height: scene.height || 1280,
                fps: scene.fps || 60,
                xml,
                scene: { ...scene, id: 'default' }
              };
            }
          } catch {}
        }

        try {
          const metaRes = await fetch(`/api/project/${id}`);
          if (!metaRes.ok) {
            if (id === 'default') return null;
            throw new Error(`HTTP ${metaRes.status}`);
          }
          const meta = await metaRes.json();
          const headers = password ? { 'x-om-pass': password } : {};
          const sceneRes = await fetch(`/api/project/${id}/scene`, { headers });
          const xml = sceneRes.ok ? await sceneRes.text() : null;

          let scene = null;
          if (xml) {
            try {
              scene = parseAlightXml(xml, meta.name || 'Proyek');
              if (scene) {
                scene.id = id;
                if (meta.packageId) scene.packageId = meta.packageId;
              }
            } catch (err) {
              console.error('Failed to parse XML in fetchProjectById', err);
            }
          }

          return {
            ...meta,
            id,
            xml,
            scene,
            width: scene?.width || meta.width || 720,
            height: scene?.height || meta.height || 1280,
            fps: scene?.fps || meta.fps || 30
          };
        } catch {
          return null;
        }
      },

      createProject: async (projectData) => {
        const id = projectData.id || `proj_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
        const project = {
          id,
          name: projectData.name || 'Proyek Baru',
          width: Number(projectData.width) || 720,
          height: Number(projectData.height) || 1280,
          fps: Number(projectData.fps) || 30,
          thumb: projectData.thumb || null,
          xml: projectData.xml || null,
          media: projectData.media || [],
          scene: projectData.scene || null,
          updatedAt: Date.now(),
          lastSeen: Date.now()
        };

        try {
          await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: project.id,
              name: project.name,
              width: project.width,
              height: project.height,
              fps: project.fps,
              thumb: project.thumb,
              xml: project.xml
            })
          });
        } catch {}

        set((state) => ({
          projects: [project, ...state.projects.filter((p) => p.id !== id)],
          activeProject: project
        }));

        return project;
      },

      saveProject: async (projectData) => {
        const current = get().activeProject;
        const id = projectData.id || current?.id;
        if (!id) return null;

        const merged = {
          ...(current || {}),
          ...projectData,
          id,
          updatedAt: Date.now(),
          lastSeen: Date.now()
        };

        try {
          await fetch(`/api/project/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: merged.name,
              width: merged.width,
              height: merged.height,
              fps: merged.fps,
              thumb: merged.thumb,
              xml: merged.xml,
              uploads: merged.uploads
            })
          });
        } catch {}

        set((state) => ({
          activeProject: merged,
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...merged } : p))
        }));

        return merged;
      },

      deleteProject: async (id) => {
        try {
          await fetch(`/api/project/${id}`, { method: 'DELETE' });
        } catch {}

        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          activeProject: state.activeProject?.id === id ? null : state.activeProject
        }));
      },

      setActiveProject: (project) => set({ activeProject: project }),

      updateActiveProject: (partial) => {
        set((state) => {
          if (!state.activeProject) return state;
          const updated = { ...state.activeProject, ...partial, updatedAt: Date.now() };
          return {
            activeProject: updated,
            projects: state.projects.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
          };
        });
      },

      parseUrlRouting: (loc = typeof window !== 'undefined' ? window.location : null) => {
        if (!loc) return { type: 'home' };
        const sp = new URLSearchParams(loc.search || '');
        const alight = sp.get('alight') || sp.get('url') || sp.get('drive') || sp.get('project') || sp.get('xml') || sp.get('preset');
        if (alight) return { type: 'alight', target: alight };

        const match = /\/proyek\/([A-Za-z0-9_-]{8,64})/i.exec(loc.pathname || '') || /^\/([A-Za-z0-9_-]{8,64})$/i.exec(loc.pathname || '');
        return match ? { type: 'project', projectId: match[1] } : { type: 'home' };
      },

      loadAlightPreset: async (targetParam) => {
        const fullUrl = normalizeAlightUrl(targetParam);
        set({ isLoading: true, error: null });

        try {
          const res = await fetch(`/api/project-xml?url=${encodeURIComponent(fullUrl)}`);
          if (!res.ok) throw new Error(`HTTP ${res.status}: Gagal memproses link preset`);
          const data = await res.json();
          if (!data?.xml) throw new Error('Format XML preset tidak valid');

          const meta = extractXmlSceneMeta(data.xml, data.xmlName || 'Preset Alight');
          const newProj = {
            id: `proj_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`,
            name: meta.name || data.xmlName || 'Preset Alight',
            width: meta.width,
            height: meta.height,
            fps: meta.fps,
            totalTime: meta.totalTime,
            xml: data.xml,
            media: data.media || []
          };

          const saved = await get().createProject(newProj);
          set({ isLoading: false });
          return saved;
        } catch (err) {
          set({ isLoading: false, error: err.message });
          throw err;
        }
      },

      loadProjectById: async (id, password = null) => {
        set({ isLoading: true, error: null });
        try {
          const cached = get().projects.find((p) => p.id === id);
          const serverProject = await get().fetchProjectById(id, password);
          const project = serverProject || cached || { id, name: 'Proyek' };

          set({ activeProject: project, isLoading: false });
          return project;
        } catch (err) {
          set({ isLoading: false, error: err.message });
          return null;
        }
      },

      resolveDeepLink: async (loc = typeof window !== 'undefined' ? window.location : null) => {
        const route = get().parseUrlRouting(loc);

        if (route.type === 'alight') {
          try {
            const project = await get().loadAlightPreset(route.target);
            get().navigateToProject(project.id, false);
            return { view: 'editor', project };
          } catch {
            return { view: 'home', project: null };
          }
        }

        if (route.type === 'project') {
          const project = await get().loadProjectById(route.projectId);
          return { view: 'editor', project };
        }

        set({ activeProject: null });
        return { view: 'home', project: null };
      },

      navigateToProject: (id, pushState = true) => {
        if (typeof window === 'undefined') return;
        const newPath = `/proyek/${id}`;
        if (pushState && window.location.pathname !== newPath) {
          window.history.pushState({ projectId: id }, '', newPath);
        }
        const found = get().projects.find((p) => p.id === id);
        if (found) set({ activeProject: found });
      },

      navigateToHome: (pushState = true) => {
        if (typeof window === 'undefined') return;
        if (pushState && window.location.pathname !== '/') {
          window.history.pushState({}, '', '/');
        }
        set({ activeProject: null });
      }
    }),
    {
      name: 'openmotion_project_store',
      storage: safeStorage,
      partialize: (state) => ({
        projects: state.projects,
        activeProject: state.activeProject,
        lastSyncedAt: state.lastSyncedAt
      })
    }
  )
);
