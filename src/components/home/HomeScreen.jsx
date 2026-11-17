import React, { useState, useEffect } from 'react';
import HomeHeader from './HomeHeader';
import HomeTabs from './HomeTabs';
import ProjectCard from './ProjectCard';
import NewProjectModal from './NewProjectModal';
import { useProjectStore } from '../../store/projectStore';
import { convertAlightLink } from '../../converter/alinkconv';
import { parseAlightXml } from '../../engine/parser/XmlSceneParser';

const TUTORIAL_ITEMS = [
  {
    icon: '/icons/ic_keyframe_add_big.svg',
    title: 'Dasar Animasi & Keyframe',
    desc: 'Pelajari cara menambahkan keyframe untuk menganimasikan posisi, ukuran, rotasi, dan opasitas layer.'
  },
  {
    icon: '/icons/ic_curve_ease_in_out.svg',
    title: 'Kurva Kecepatan (Easing)',
    desc: 'Kuasai editor kurva Bezier, akselerasi ease in/out, dan kurva pantulan untuk gerakan natural.'
  },
  {
    icon: '/icons/ac_ic_effects.svg',
    title: 'Efek Visual & Shaders',
    desc: 'Terapkan efek distorsi, motion blur, color grade, dan efek pencahayaan pada layer apa pun.'
  },
  {
    icon: '/icons/ic_masking_group_bl.svg',
    title: 'Grup & Masking',
    desc: 'Kelompokkan beberapa layer untuk pengeditan terpadu atau gunakan bentuk sebagai masking interaktif.'
  },
  {
    icon: '/icons/ic_export_xml.svg',
    title: 'Impor & Ekspor Format Alight',
    desc: 'Bagikan karya melalui XML preset (.xml, .xml2) dan tautan preset Alight Motion online.'
  }
];

export default function HomeScreen({ onOpenProject }) {
  const [activeTab, setActiveTab] = useState('projects');
  const [linkInput, setLinkInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [isError, setIsError] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  const projects = useProjectStore((state) => state.projects);
  const isLoadingProjects = useProjectStore((state) => state.isLoading);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);
  const createProject = useProjectStore((state) => state.createProject);
  const deleteProject = useProjectStore((state) => state.deleteProject);

  useEffect(() => {
    fetchProjects().catch(() => {});
  }, [fetchProjects]);

  const handleImportLink = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const url = linkInput.trim();
    if (!url) {
      setStatusMsg('Isi link Alight Motion atau Drive dulu.');
      setIsError(true);
      return;
    }

    setIsImporting(true);
    setStatusMsg('Mengambil XML & media...');
    setIsError(false);

    try {
      const result = await convertAlightLink(url);
      if (!result || !result.xml) {
        throw new Error('Gagal membaca XML dari tautan.');
      }

      const scene = parseAlightXml(result.xml, result.xmlName || 'Preset Impor');
      const newId = `proj_${Date.now()}`;
      const newProj = {
        id: newId,
        name: scene.title || result.xmlName || 'Preset Impor',
        packageId: result.packageId || null,
        width: scene.width || 720,
        height: scene.height || 1280,
        fps: scene.fps || 30,
        xml: result.xml,
        scene: { ...scene, id: newId, packageId: result.packageId || null }
      };

      await createProject(newProj);
      setStatusMsg('');
      setLinkInput('');
      if (onOpenProject) {
        onOpenProject(newProj);
      }
    } catch (err) {
      setStatusMsg(err.message || 'Gagal memuat preset.');
      setIsError(true);
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportPresetFile = async (file) => {
    const text = await file.text();
    const scene = parseAlightXml(text, file.name);
    const newId = `proj_${Date.now()}`;
    const newProj = {
      id: newId,
      name: scene.title || file.name.replace(/\.[^/.]+$/, '') || 'Proyek Baru',
      width: scene.width || 720,
      height: scene.height || 1280,
      fps: scene.fps || 30,
      xml: text,
      scene
    };

    await createProject(newProj);
    setIsNewProjectOpen(false);
    if (onOpenProject) {
      onOpenProject(newProj);
    }
  };

  const handleImportPresetLink = async (link) => {
    const result = await convertAlightLink(link);
    if (!result || !result.xml) {
      throw new Error('Gagal membaca XML dari tautan.');
    }
    const scene = parseAlightXml(result.xml, result.xmlName || 'Preset Impor');
    const newId = `proj_${Date.now()}`;
    const newProj = {
      id: newId,
      name: scene.title || result.xmlName || 'Preset Impor',
      packageId: result.packageId || null,
      width: scene.width || 720,
      height: scene.height || 1280,
      fps: scene.fps || 30,
      xml: result.xml,
      scene: { ...scene, id: newId, packageId: result.packageId || null }
    };

    await createProject(newProj);
    setIsNewProjectOpen(false);
    if (onOpenProject) {
      onOpenProject(newProj);
    }
  };

  const handleCreateProject = async (projData) => {
    const newId = `proj_${Date.now()}`;
    const newProj = {
      id: newId,
      name: projData.name || 'Proyek Baru',
      width: projData.width || 720,
      height: projData.height || 1280,
      fps: projData.fps || 30,
      xml: projData.xml || null,
      scene: projData.scene || {
        title: projData.name || 'Proyek Baru',
        width: projData.width || 720,
        height: projData.height || 1280,
        fps: projData.fps || 30,
        totalTime: 5000,
        backgroundColor: [0, 0, 0, 1],
        layers: []
      }
    };

    await createProject(newProj);
    setIsNewProjectOpen(false);
    if (onOpenProject) {
      onOpenProject(newProj);
    }
  };

  return (
    <div id="am-home-screen">
      <HomeHeader>
        <HomeTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </HomeHeader>

      {activeTab === 'projects' && (
        <div className="am-home-import-bar" id="am-home-import-bar">
          <form onSubmit={handleImportLink} className="am-import-input-wrap">
            <input
              type="url"
              id="am-home-alight-link"
              className="am-import-input"
              placeholder="Tempel link https://alight.link/... atau Drive"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              autoCapitalize="off"
              spellCheck="false"
            />
            <button
              id="am-home-btn-import-link"
              className="am-import-btn"
              type="submit"
              disabled={isImporting}
            >
              {isImporting ? '...' : 'Buka'}
            </button>
          </form>
          {statusMsg && (
            <div
              id="am-home-import-status"
              className={`am-import-status ${isError ? 'error' : 'info'}`}
              style={{ display: 'block' }}
            >
              {statusMsg}
            </div>
          )}
        </div>
      )}

      <main className="am-home-content" id="am-home-content">
        {activeTab === 'projects' && (
          <div id="am-home-project-list" className="am-project-grid">
            {isLoadingProjects && projects.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: '30px', textAlign: 'center', color: '#8c93a7' }}>
                Memuat proyek...
              </div>
            ) : projects.length === 0 ? (
              <div className="am-home-empty" style={{ gridColumn: '1 / -1' }}>
                <img src="/icons/ac_projectlist_projects.svg" alt="Empty" />
                <p>
                  Belum ada proyek.<br />
                  Ketuk tombol <strong>+</strong> di bawah untuk membuat proyek baru.
                </p>
              </div>
            ) : (
              projects.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onOpen={onOpenProject}
                  onDelete={deleteProject}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'tutorial' && (
          <div className="am-tutorial-grid">
            {TUTORIAL_ITEMS.map((item) => (
              <div key={item.title} className="am-tutorial-card">
                <div className="am-tutorial-icon">
                  <img src={item.icon} alt={item.title} />
                </div>
                <div className="am-tutorial-info">
                  <div className="am-tutorial-title">{item.title}</div>
                  <div className="am-tutorial-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'elements' && (
          <div className="am-project-grid">
            <div className="am-home-empty" style={{ gridColumn: '1 / -1' }}>
              <img src="/icons/ac_projectlist_elements.svg" alt="Elemen" />
              <p style={{ fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                Paket Elemen Tersimpan
              </p>
              <p>
                Simpan animasi, teks bergaya, atau grup layer favoritmu sebagai Elemen untuk digunakan langsung di proyek mana pun.
              </p>
            </div>
          </div>
        )}
      </main>

      <button
        id="am-home-fab"
        className="am-home-fab"
        title="Buat Proyek Baru"
        type="button"
        onClick={() => setIsNewProjectOpen(true)}
      >
        <img src="/icons/ac_ic_add_element.svg" alt="Buat Proyek" />
      </button>

      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onCreateProject={handleCreateProject}
        onImportLink={handleImportPresetLink}
        onImportFile={handleImportPresetFile}
      />
    </div>
  );
}
