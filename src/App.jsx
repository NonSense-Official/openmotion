import React, { useEffect, useState } from 'react';
import HomeScreen from './components/home/HomeScreen';
import EditorShell from './components/layout/EditorShell';
import { useEditorStore } from './store/editorStore';
import { useProjectStore } from './store/projectStore';
import { convertAlightLink } from './converter/alinkconv';
import { parseAlightXml } from './engine/parser/XmlSceneParser';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    const path = window.location.pathname;
    const match = /\/proyek\/([A-Za-z0-9_-]{8,64})/.exec(path) || /^\/([A-Za-z0-9_-]{8,64})$/.exec(path);
    return match ? { view: 'editor', projectId: match[1] } : { view: 'home', projectId: null };
  });

  const setProject = useEditorStore((state) => state.setProject);
  const projects = useProjectStore((state) => state.projects);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);
  const fetchProjectById = useProjectStore((state) => state.fetchProjectById);

  useEffect(() => {
    fetchProjects().catch(() => {});

    const params = new URLSearchParams(window.location.search);
    const linkParam = params.get('alight') || params.get('url') || params.get('drive') || params.get('project') || params.get('xml') || params.get('preset');

    if (linkParam) {
      const fullUrl = /^https?:\/\//i.test(linkParam) || (linkParam.length >= 25 && !linkParam.includes('.'))
        ? linkParam
        : `https://alight.link/${linkParam}`;

      convertAlightLink(fullUrl)
        .then((result) => {
          if (result && result.xml) {
            const scene = parseAlightXml(result.xml, result.xmlName);
            const newId = `proj_${Math.random().toString(36).substring(2, 9)}`;
            setProject({
              id: newId,
              name: scene.title || result.xmlName || 'Preset Alight',
              packageId: result.packageId || null,
              width: scene.width,
              height: scene.height,
              fps: scene.fps,
              xml: result.xml,
              scene: { ...scene, id: newId, packageId: result.packageId || null }
            });
            setCurrentRoute({ view: 'editor', projectId: null });
          }
        })
        .catch(() => {});
    }

    const onPopState = () => {
      const path = window.location.pathname;
      const match = /\/proyek\/([A-Za-z0-9_-]{8,64})/.exec(path) || /^\/([A-Za-z0-9_-]{8,64})$/.exec(path);
      if (match) {
        setCurrentRoute({ view: 'editor', projectId: match[1] });
      } else {
        setCurrentRoute({ view: 'home', projectId: null });
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [fetchProjects, setProject]);

  useEffect(() => {
    if (currentRoute.view === 'editor') {
      const activeScene = useEditorStore.getState().activeScene;
      if (activeScene?.layers?.length && (!currentRoute.projectId || activeScene.id === currentRoute.projectId)) return;

      const pid = currentRoute.projectId || 'default';
      fetchProjectById(pid).then((fullProj) => {
        if (fullProj) {
          setProject(fullProj);
        }
      });
    }
  }, [currentRoute.view, currentRoute.projectId, fetchProjectById, setProject]);

  const handleOpenProject = async (proj) => {
    let fullProj = proj;
    if (!fullProj.scene && !fullProj.xml) {
      const fetched = await fetchProjectById(proj.id);
      if (fetched) fullProj = fetched;
    }
    if (!fullProj.scene && fullProj.xml) {
      fullProj.scene = parseAlightXml(fullProj.xml, fullProj.name);
    }
    setProject(fullProj);
    const newPath = `/proyek/${proj.id}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({ projectId: proj.id }, '', newPath);
    }
    setCurrentRoute({ view: 'editor', projectId: proj.id });
  };

  const handleExitToHome = () => {
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
    setCurrentRoute({ view: 'home', projectId: null });
  };

  return currentRoute.view === 'editor' ? (
    <EditorShell onExit={handleExitToHome} />
  ) : (
    <HomeScreen onOpenProject={handleOpenProject} />
  );
}
